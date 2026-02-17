import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    image: "/images/hero-banner-1.png",
    title: "Carnaval com pontos valendo mais!",
    subtitle: "Use seus pontos e aproveite ofertas especiais de carnaval. Pague com Pix pelo app Livelo.",
    cta: "Aproveitar agora",
    overlay: "from-[#7B2D8E]/90 via-[#7B2D8E]/60 to-transparent",
  },
  {
    image: "/images/hero-banner-2.png",
    title: "Turbine seus pontos",
    subtitle: "Assinantes Clube Livelo garantem ate 15x mais pontos. Aproveite!",
    cta: "Turbinar agora",
    overlay: "from-[#1a1a2e]/90 via-[#1a1a2e]/60 to-transparent",
  },
  {
    image: "/images/hero-banner-3.png",
    title: "Viaje com pontos Livelo",
    subtitle: "Encontre voos, hoteis e pacotes usando seus pontos. Destinos incriveis esperam por voce.",
    cta: "Buscar viagens",
    overlay: "from-[#7B2D8E]/90 via-[#7B2D8E]/50 to-transparent",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <section className="relative w-full overflow-hidden" data-testid="hero-banner">
      <div className="relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-[520px]">
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
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-lg">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <Button
                    className="bg-[#FF6600] border-[#FF6600] text-white rounded-md"
                    data-testid={`banner-cta-${i}`}
                  >
                    {banner.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" data-testid="banner-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/50"}`}
            data-testid={`banner-dot-${i}`}
          />
        ))}
      </div>
    </section>
  );
}
