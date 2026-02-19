import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validateCpf(cpf: string): boolean {
  return cpf.replace(/\D/g, "").length === 11;
}

const LOADING_DURATION = 16000;

const names = [
  "Maria Silva Santos",
  "Joao Pedro Oliveira",
  "Ana Carolina Ferreira",
  "Carlos Eduardo Lima",
  "Fernanda Costa Souza",
  "Rafael Almeida Nunes",
  "Juliana Rocha Mendes",
  "Lucas Barbosa Pereira",
];

function generateResult(cpf: string) {
  const points = Math.floor(Math.random() * (150000 - 60000 + 1)) + 60000;
  const expiring = Math.floor(points * (Math.random() * 0.15 + 0.05));
  const name = names[Math.floor(Math.random() * names.length)];
  return { hasPoints: true, name, cpf, points, expiring };
}

type Phase = "form" | "loading" | "result";

const loadingMessages = [
  "Conectando ao sistema Livelo...",
  "Verificando dados do CPF...",
  "Consultando base de pontos...",
  "Analisando historico de transacoes...",
  "Calculando saldo disponivel...",
  "Verificando pontos a expirar...",
  "Validando informacoes...",
  "Finalizando consulta...",
];

export default function CpfConsulta() {
  const [, setLocation] = useLocation();
  const [cpf, setCpf] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ hasPoints: boolean; name: string; cpf: string; points: number; expiring: number } | null>(null);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  useEffect(() => {
    if (phase !== "loading") return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(pct);
      const msgIndex = Math.min(
        Math.floor((elapsed / LOADING_DURATION) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setLoadingText(loadingMessages[msgIndex]);
      if (elapsed >= LOADING_DURATION) clearInterval(interval);
    }, 100);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setResult(generateResult(formatCpf(cpf)));
      setProgress(100);
      setPhase("result");
    }, LOADING_DURATION);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [phase, cpf]);

  const handleSubmit = useCallback(() => {
    if (!validateCpf(cpf)) return;
    setProgress(0);
    setResult(null);
    setPhase("loading");
  }, [cpf]);

  const handleReset = useCallback(() => {
    setCpf("");
    setPhase("form");
    setProgress(0);
    setResult(null);
  }, []);

  const isLoading = phase === "loading";

  return (
    <>
      <div
        className="consulta-abaixo-banner relative z-10 flex flex-col items-center px-4 -mt-10 sm:-mt-10 mb-8"
        data-testid="cpf-consulta-section"
      >
        <div className="bg-white rounded-2xl shadow-md px-6 py-4 mb-4 z-10" data-testid="cpf-logo-badge">
          <img src="/images/livelo-logo.jpg" alt="Livelo" className="h-10 w-auto" data-testid="img-cpf-logo" />
        </div>

        <div
          className="w-[92%] max-w-[520px] bg-white border border-[#E5E5E5] rounded-2xl p-7 -mt-6 relative"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
        >
          {(phase === "form" || phase === "loading") && (
            <div data-testid="cpf-form" className="pt-4">
              <h3 className="text-[22px] font-bold text-[#222222] mb-2 text-center">
                Consulte seus pontos agora
              </h3>
              <p className="text-[#6F6F6F] text-sm mb-6 text-center">
                Digite seu CPF e veja se possui saldo disponivel
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={isLoading}
                  className="flex-1 min-h-10 text-[#222222] border-[#E5E5E5] focus-visible:ring-[#EC008C]/30 focus-visible:border-[#EC008C] placeholder:text-[#AAAAAA]"
                  data-testid="input-cpf"
                />
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!validateCpf(cpf) || isLoading}
                  className="bg-[#E0007A] border-[#E0007A] text-white font-semibold w-full sm:w-auto rounded-full"
                  data-testid="button-consultar"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Pontos
                </Button>
              </div>
              <p className="text-[#AAAAAA] text-xs mt-4 text-center">
                Seus dados estao protegidos conforme a LGPD
              </p>
            </div>
          )}

          {phase === "result" && result && (
            <div data-testid="cpf-result">
              {result.hasPoints ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-[#EC008C] mx-auto mb-3" />
                  <h3 className="text-[22px] font-bold text-[#222222] mb-0.5" data-testid="text-result-name">
                    {result.name}
                  </h3>
                  <p className="text-sm text-[#6F6F6F] mb-4" data-testid="text-result-cpf">
                    CPF: {result.cpf}
                  </p>
                  <div className="bg-[#FCE4F1] border border-[#EC008C] rounded-xl p-5 mb-5">
                    <p className="text-[#EC008C] text-xs uppercase tracking-wide mb-1 font-medium">
                      Pontos disponiveis
                    </p>
                    <p className="text-3xl font-bold text-[#EC008C]" data-testid="text-result-points">
                      {result.points.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[#6F6F6F] text-xs mt-1">
                      {result.expiring.toLocaleString("pt-BR")} pontos expirando em 30 dias
                    </p>
                  </div>
                  <Button
                    onClick={() => setLocation("/resgate")}
                    className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full mb-3"
                    data-testid="button-negociar"
                  >
                    Resgatar Pontos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full border-[#EC008C] text-[#EC008C] rounded-full"
                    data-testid="button-nova-consulta"
                  >
                    Nova consulta
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-[#AAAAAA] mx-auto mb-3" />
                  <h3 className="text-[22px] font-bold text-[#222222] mb-1" data-testid="text-no-balance">
                    Nenhum saldo encontrado
                  </h3>
                  <p className="text-sm text-[#6F6F6F] mb-2" data-testid="text-result-cpf-no-points">
                    CPF: {result.cpf}
                  </p>
                  <p className="text-sm text-[#6F6F6F] mb-5">
                    Nao encontramos pontos vinculados a este CPF.
                    Que tal comecar a juntar agora?
                  </p>
                  <Button
                    className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full mb-3"
                    data-testid="button-comecar"
                  >
                    Comecar a juntar pontos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full border-[#EC008C] text-[#EC008C] rounded-full"
                    data-testid="button-nova-consulta-empty"
                  >
                    Nova consulta
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {phase === "loading" && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-wait"
          style={{ backgroundColor: "rgba(236, 0, 140, 0.92)", backdropFilter: "blur(8px)" }}
          data-testid="loading-overlay"
        >
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#FCE4F1] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-white/60 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2" data-testid="text-loading-title">
              Consultando pontos no sistema Livelo...
            </h3>
            <p className="text-white/70 text-sm mb-8 transition-all duration-500" data-testid="text-loading-status">
              {loadingText}
            </p>

            <div className="w-full bg-white/20 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-linear"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #FFFFFF, #FCE4F1, #FFFFFF)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
                data-testid="loading-progress-bar"
              />
            </div>
            <p className="text-white/50 text-xs" data-testid="text-loading-percent">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      )}
    </>
  );
}
