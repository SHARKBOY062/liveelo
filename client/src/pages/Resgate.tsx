import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Plane, Banknote, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";

const options = [
  {
    icon: Plane,
    title: "Milhas Aereas",
    description: "Converta seus pontos em milhas para viajar com as principais companhias aereas do Brasil e do mundo.",
    cta: "Transferir para companhias",
    tipo: "milhas",
    color: "#EC008C",
    bgLight: "#FCE4F1",
  },
  {
    icon: Banknote,
    title: "Cashback",
    description: "Receba o valor direto na sua conta bancaria. Resgate rapido e sem complicacao.",
    cta: "Solicitar Deposito",
    tipo: "cashback",
    color: "#EC008C",
    bgLight: "#FCE4F1",
  },
  {
    icon: ShoppingBag,
    title: "Produtos do Site",
    description: "Troque seus pontos por eletronicos, roupas, acessorios e muito mais no catalogo Livelo.",
    cta: "Ver Catalogo",
    tipo: "produtos",
    color: "#EC008C",
    bgLight: "#FCE4F1",
  },
];

export default function Resgate() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleCardClick = useCallback((tipo: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation(`/banco?tipo=${tipo}`);
    }, 3000);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col" data-testid="resgate-page">
      <PromoBar />
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-[#6F6F6F] text-sm mb-8 hover:text-[#EC008C] transition-colors"
            data-testid="button-voltar"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o inicio
          </button>

          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-2" data-testid="text-resgate-title">
              Como deseja resgatar seus pontos?
            </h1>
            <p className="text-[#6F6F6F] text-base" data-testid="text-resgate-subtitle">
              Escolha a melhor opcao para voce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#EC008C] hover:shadow-lg transition-all cursor-pointer group"
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                onClick={() => handleCardClick(option.tipo)}
                data-testid={`card-resgate-${i}`}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: option.bgLight }}
                >
                  <option.icon className="w-7 h-7" style={{ color: option.color }} />
                </div>

                <h3 className="text-lg font-bold text-[#222222] mb-2">
                  {option.title}
                </h3>
                <p className="text-[#6F6F6F] text-sm mb-6 flex-1">
                  {option.description}
                </p>

                <Button
                  className="w-full bg-[#E0007A] border-[#E0007A] text-white font-semibold rounded-full"
                  data-testid={`button-resgate-${i}`}
                >
                  {option.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {loading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95"
          data-testid="loading-resgate-overlay"
        >
          <div className="text-center">
            <div className="w-12 h-12 border-[5px] border-gray-200 border-t-[#EC008C] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#EC008C] font-semibold text-base">Preparando seu resgate...</p>
          </div>
        </div>
      )}
    </div>
  );
}
