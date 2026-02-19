import { useState, useEffect, useCallback } from "react";
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

const mockResults = [
  { hasPoints: true, name: "Maria Silva Santos", cpf: "", points: 14750, expiring: 2300 },
  { hasPoints: true, name: "Joao Pedro Oliveira", cpf: "", points: 8420, expiring: 1100 },
  { hasPoints: true, name: "Ana Carolina Ferreira", cpf: "", points: 32100, expiring: 5600 },
  { hasPoints: false, name: "", cpf: "", points: 0, expiring: 0 },
  { hasPoints: true, name: "Carlos Eduardo Lima", cpf: "", points: 5230, expiring: 800 },
];

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
  const [cpf, setCpf] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<typeof mockResults[0] | null>(null);
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
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult({ ...randomResult, cpf: formatCpf(cpf) });
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
        className="consulta-abaixo-banner relative z-10 flex justify-center px-4 -mt-10 sm:-mt-10 mb-8"
        data-testid="cpf-consulta-section"
      >
        <div className="w-[95%] max-w-[620px] bg-gradient-to-br from-[#E91E63] to-[#FF4081] rounded-md shadow-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-15">
            <img src="/images/livelo-logo.jpg" alt="" className="h-10 w-auto brightness-200 contrast-0 invert" />
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          {(phase === "form" || phase === "loading") && (
            <div data-testid="cpf-form" className="relative z-10">
              <img src="/images/livelo-logo.jpg" alt="Livelo" className="h-10 w-auto mx-auto mb-4 rounded-sm" data-testid="img-cpf-logo" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                Consulte seus pontos agora
              </h3>
              <p className="text-white/70 text-sm sm:text-base mb-6 text-center">
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
                  className="flex-1 min-h-10 bg-white/95 text-gray-900 border-white/30 focus-visible:ring-white/30 placeholder:text-gray-400"
                  data-testid="input-cpf"
                />
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!validateCpf(cpf) || isLoading}
                  className="bg-white border-white text-[#E91E63] font-semibold w-full sm:w-auto"
                  data-testid="button-consultar"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Pontos
                </Button>
              </div>
              <p className="text-white/40 text-xs mt-4 text-center">
                Seus dados estao protegidos conforme a LGPD
              </p>
            </div>
          )}

          {phase === "result" && result && (
            <div data-testid="cpf-result">
              {result.hasPoints ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5" data-testid="text-result-name">
                    {result.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4" data-testid="text-result-cpf">
                    CPF: {result.cpf}
                  </p>
                  <div className="bg-gradient-to-r from-[#7B2D8E] to-[#FF6600] rounded-md p-4 mb-4">
                    <p className="text-white/80 text-xs uppercase tracking-wide mb-0.5">
                      Pontos disponiveis
                    </p>
                    <p className="text-3xl font-bold text-white" data-testid="text-result-points">
                      {result.points.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      {result.expiring.toLocaleString("pt-BR")} pontos expirando em 30 dias
                    </p>
                  </div>
                  <Button
                    className="w-full bg-[#FF6600] border-[#FF6600] text-white font-semibold mb-2"
                    data-testid="button-negociar"
                  >
                    Negociar Pontos
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-[#7B2D8E]"
                    data-testid="button-nova-consulta"
                  >
                    Nova consulta
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1" data-testid="text-no-balance">
                    Nenhum saldo encontrado
                  </h3>
                  <p className="text-sm text-gray-500 mb-2" data-testid="text-result-cpf-no-points">
                    CPF: {result.cpf}
                  </p>
                  <p className="text-sm text-gray-500 mb-5">
                    Nao encontramos pontos vinculados a este CPF.
                    Que tal comecar a juntar agora?
                  </p>
                  <Button
                    className="w-full bg-[#7B2D8E] border-[#7B2D8E] text-white font-semibold mb-2"
                    data-testid="button-comecar"
                  >
                    Comecar a juntar pontos
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-[#7B2D8E]"
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
          style={{ backgroundColor: "rgba(123, 45, 142, 0.95)", backdropFilter: "blur(8px)" }}
          data-testid="loading-overlay"
        >
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#FF6600] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
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
                  background: "linear-gradient(90deg, #FF6600, #FFB366, #FF6600)",
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
