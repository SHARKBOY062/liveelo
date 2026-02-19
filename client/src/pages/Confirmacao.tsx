import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";

const bancoNomes: Record<string, string> = {
  itau: "Itau",
  santander: "Santander",
  bradesco: "Bradesco",
  nubank: "Nubank",
  bb: "Banco do Brasil",
  caixa: "Caixa",
};

export default function Confirmacao() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tipo = params.get("tipo") || "milhas";
  const banco = params.get("banco") || "";
  const [loading, setLoading] = useState(false);

  const bancoNome = bancoNomes[banco] || banco;

  const pontos = useMemo(() => {
    const saved = localStorage.getItem("pontosUsuario");
    if (saved) return parseInt(saved, 10);
    const generated = Math.floor(Math.random() * (150000 - 20000 + 1)) + 20000;
    localStorage.setItem("pontosUsuario", String(generated));
    return generated;
  }, []);

  const percentual = 0.10;
  const valorSaque = pontos * percentual;
  const protocolo = useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);

  const handleSolicitar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation("/solicitacao");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col" data-testid="confirmacao-page">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
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

              <p className="text-sm text-[#6F6F6F] mb-1">Valor disponivel para saque (10%):</p>
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
        </div>
      </main>

      <Footer />

      {loading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95"
          data-testid="loading-solicitar-overlay"
        >
          <div className="text-center">
            <div className="w-12 h-12 border-[5px] border-gray-200 border-t-[#EC008C] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#EC008C] font-semibold text-base">Processando solicitacao...</p>
          </div>
        </div>
      )}
    </div>
  );
}
