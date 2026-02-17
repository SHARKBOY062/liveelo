import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const banners = [
  {
    image: "/images/hero-banner-1.png",
    title: "Carnaval com pontos valendo mais!",
    subtitle: "Use seus pontos e aproveite ofertas especiais de carnaval. Pague com Pix pelo app Livelo.",
    overlay: "from-[#7B2D8E]/90 via-[#7B2D8E]/60 to-transparent",
  },
  {
    image: "/images/hero-banner-2.png",
    title: "Turbine seus pontos",
    subtitle: "Assinantes Clube Livelo garantem ate 15x mais pontos. Aproveite!",
    overlay: "from-[#1a1a2e]/90 via-[#1a1a2e]/60 to-transparent",
  },
  {
    image: "/images/hero-banner-3.png",
    title: "Viaje com pontos Livelo",
    subtitle: "Encontre voos, hoteis e pacotes usando seus pontos. Destinos incriveis esperam por voce.",
    overlay: "from-[#7B2D8E]/90 via-[#7B2D8E]/50 to-transparent",
  },
];

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

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [cpf, setCpf] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<typeof mockResults[0] | null>(null);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  const isLoading = phase === "loading";

  return (
    <>
      <section className="relative w-full overflow-hidden" data-testid="hero-banner">
        <div className="relative h-[480px] sm:h-[500px] md:h-[540px] lg:h-[560px]">
          {banners.map((banner, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.overlay}`} />
            </div>
          ))}

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {banners[current].title}
              </h2>
              <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto drop-shadow">
                {banners[current].subtitle}
              </p>
            </div>

            <div
              className="consulta-banner w-[90%] max-w-[480px]"
              data-testid="cpf-consulta-section"
            >
              {(phase === "form" || phase === "loading") && (
                <div
                  className="rounded-md p-5 sm:p-6 shadow-xl"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)" }}
                  data-testid="cpf-form"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 text-center">
                    Consulte seus pontos agora
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">
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
                      className="flex-1 min-h-10 text-gray-900 border-gray-300 focus-visible:ring-[#7B2D8E]/30"
                      data-testid="input-cpf"
                    />
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={!validateCpf(cpf) || isLoading}
                      className="bg-[#FF6600] border-[#FF6600] text-white font-semibold w-full sm:w-auto"
                      data-testid="button-consultar"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Consultar Pontos
                    </Button>
                  </div>
                  <p className="text-gray-400 text-xs mt-3 text-center">
                    Seus dados estao protegidos conforme a LGPD
                  </p>
                </div>
              )}

              {phase === "result" && result && (
                <Card
                  className="p-5 sm:p-6 border-0 shadow-xl"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.97)", backdropFilter: "blur(12px)" }}
                  data-testid="cpf-result"
                >
                  {result.hasPoints ? (
                    <div className="text-center">
                      <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-900 mb-0.5" data-testid="text-result-name">
                        {result.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3" data-testid="text-result-cpf">
                        CPF: {result.cpf}
                      </p>
                      <div className="bg-gradient-to-r from-[#7B2D8E] to-[#FF6600] rounded-md p-3 mb-3">
                        <p className="text-white/80 text-xs uppercase tracking-wide mb-0.5">
                          Pontos disponiveis
                        </p>
                        <p className="text-2xl font-bold text-white" data-testid="text-result-points">
                          {result.points.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-white/70 text-xs mt-0.5">
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
                      <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-900 mb-1" data-testid="text-no-balance">
                        Nenhum saldo encontrado
                      </h3>
                      <p className="text-xs text-gray-500 mb-2" data-testid="text-result-cpf-no-points">
                        CPF: {result.cpf}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
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
                </Card>
              )}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            data-testid="banner-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            data-testid="banner-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" data-testid="banner-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/50"}`}
                data-testid={`banner-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </section>

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
