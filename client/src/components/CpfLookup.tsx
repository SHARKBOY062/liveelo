import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Award, AlertCircle, Loader2, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  return true;
}

function getLastDigit(cpf: string): number {
  const digits = cpf.replace(/\D/g, "");
  return parseInt(digits.charAt(digits.length - 1), 10);
}

const simulatedNames = [
  "Maria Silva",
  "Jose Santos",
  "Ana Oliveira",
  "Carlos Souza",
  "Fernanda Lima",
  "Paulo Costa",
  "Juliana Pereira",
  "Rafael Almeida",
  "Camila Ferreira",
  "Lucas Rodrigues",
];

interface ResultData {
  hasPoints: boolean;
  name: string;
  points: number;
  status: string;
}

export default function CpfLookup() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    setError("");
    setResult(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValidCpf(cpf)) {
      setError("CPF invalido. Verifique e tente novamente.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      const lastDigit = getLastDigit(cpf);
      const hasPoints = lastDigit % 2 === 0;
      const nameIndex = lastDigit;
      const name = simulatedNames[nameIndex] || "Cliente Livelo";

      setResult({
        hasPoints,
        name,
        points: hasPoints ? 1200 + lastDigit * 350 : 0,
        status: hasPoints ? "Ativo" : "Sem saldo",
      });
      setLoading(false);
    }, 4000);
  }, [cpf]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-[#7B2D8E] via-[#6a2579] to-[#5a1f66] flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-[#FF6600]/20" />
        </div>

        <Card className="w-full max-w-md p-8 shadow-lg relative z-10" data-testid="cpf-lookup-card">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#7B2D8E]/10 mb-4">
              <Search className="w-7 h-7 text-[#7B2D8E]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-title">
              Consulte seus pontos
            </h1>
            <p className="text-sm text-muted-foreground mt-2" data-testid="text-subtitle">
              Informe seu CPF para verificar saldo disponivel
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                data-testid="input-cpf"
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1" data-testid="text-error">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <Button
              className="w-full bg-[#7B2D8E] border-[#7B2D8E] text-white font-semibold no-default-hover-elevate"
              onClick={handleSubmit}
              disabled={loading || cpf.replace(/\D/g, "").length < 11}
              data-testid="button-consultar"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analisando dados...
                </span>
              ) : (
                "Consultar Pontos"
              )}
            </Button>
          </div>

          {result && (
            <div className="mt-6" data-testid="result-area">
              {result.hasPoints ? (
                <div className="bg-[#7B2D8E]/5 border border-[#7B2D8E]/15 rounded-md p-5 space-y-3" data-testid="result-with-points">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-[#7B2D8E]" />
                    <span className="font-semibold text-gray-900">Resultado</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Nome</span>
                      <span className="font-medium text-gray-900" data-testid="text-name">{result.name}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Pontos disponiveis</span>
                      <span className="font-bold text-[#7B2D8E] text-lg" data-testid="text-points">
                        {result.points.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-green-600 font-medium" data-testid="text-status">{result.status}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2 bg-[#FF6600] border-[#FF6600] text-white font-semibold no-default-hover-elevate"
                    data-testid="button-resgatar"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Resgatar Agora
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-5 text-center" data-testid="result-no-points">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Nenhum saldo encontrado no momento.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
