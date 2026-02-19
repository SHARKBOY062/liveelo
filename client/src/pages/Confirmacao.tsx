import { useLocation, useSearch } from "wouter";
import { CheckCircle2, ArrowLeft } from "lucide-react";
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

  const tipoLabel = tipo === "milhas" ? "Milhas Aereas" : tipo === "cashback" ? "Cashback" : "Produtos do Site";
  const bancoNome = bancoNomes[banco] || banco;

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

            <h1 className="text-2xl font-bold text-[#222222] mb-3" data-testid="text-confirmacao-title">
              Solicitacao enviada!
            </h1>

            <p className="text-[#6F6F6F] text-base mb-6" data-testid="text-confirmacao-desc">
              Sua solicitacao de <span className="font-semibold text-[#EC008C]">{tipoLabel}</span> foi registrada com sucesso.
              {bancoNome && (
                <> O deposito sera realizado na sua conta do <span className="font-semibold text-[#222]">{bancoNome}</span>.</>
              )}
            </p>

            <div className="bg-[#FCE4F1] rounded-xl p-4 mb-6" data-testid="info-prazo">
              <p className="text-sm text-[#EC008C] font-semibold">Prazo estimado: 3 a 5 dias uteis</p>
            </div>

            <p className="text-xs text-[#999] mb-8">
              Voce recebera uma notificacao quando o processo for concluido.
              Protocolo: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>

            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full"
              data-testid="button-voltar-inicio"
            >
              Voltar para o inicio
            </Button>

            <button
              onClick={() => setLocation("/resgate")}
              className="mt-3 text-sm text-[#EC008C] font-medium hover:underline"
              data-testid="button-novo-resgate"
            >
              Fazer novo resgate
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
