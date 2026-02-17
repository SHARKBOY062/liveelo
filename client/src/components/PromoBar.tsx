import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

const promoMessages = [
  {
    text: "Vincule a conta Livelo e comece a acumular pontos.",
    link: "Vincular conta",
    bg: "bg-[#1a1a2e]",
  },
  {
    text: "Especial Viagem com pontos! Use ou junte pontos em ofertas exclusivas de viagem!",
    link: "Confira",
    bg: "bg-[#7B2D8E]",
  },
];

export default function PromoBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const current = promoMessages[currentIndex];

  return (
    <div className={`${current.bg} text-white py-2.5 px-4 relative z-50`} data-testid="promo-bar">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5">
          {promoMessages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white" : "bg-white/40"}`}
              data-testid={`promo-dot-${i}`}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-center">
          {current.text}
          <button className="ml-2 underline font-semibold inline-flex items-center gap-0.5" data-testid="promo-link">
            {current.link}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          data-testid="promo-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
