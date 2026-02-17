import { Check, Star, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basico",
    price: "24,90",
    points: "1.000",
    icon: Star,
    features: [
      "1.000 pontos por mes",
      "Bonus de 50% ao turbinar",
      "Desconto em produtos selecionados",
      "Acesso a ofertas exclusivas",
    ],
    highlighted: false,
  },
  {
    name: "Plus",
    price: "44,90",
    points: "2.000",
    icon: Crown,
    features: [
      "2.000 pontos por mes",
      "Bonus de 80% ao turbinar",
      "Frete gratis em produtos",
      "Acesso antecipado a promocoes",
      "Desconto exclusivo em viagens",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "79,90",
    points: "5.000",
    icon: Zap,
    features: [
      "5.000 pontos por mes",
      "Bonus de 100% ao turbinar",
      "Frete gratis em todos os produtos",
      "Prioridade no atendimento",
      "Cashback em pontos extras",
      "Acesso VIP a eventos",
    ],
    highlighted: false,
  },
];

export default function ClubLivelo() {
  return (
    <section
      className="py-16 px-4 lg:px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4A0E78 0%, #7B2D8E 40%, #9B4DCA 100%)",
      }}
      data-testid="club-section"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="text-orange-300 text-sm font-semibold uppercase tracking-wider mb-2 block">
            Programa de assinatura
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" data-testid="text-club-title">
            Clube Livelo
          </h2>
          <p className="text-white/70 text-base max-w-2xl mx-auto">
            Assine o Clube Livelo e turbine seus pontos todo mes com beneficios exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`rounded-md p-6 relative ${
                  plan.highlighted
                    ? "bg-white text-gray-900 shadow-2xl"
                    : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                }`}
                data-testid={`plan-${plan.name.toLowerCase()}`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6600] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais popular
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlighted ? "bg-purple-100 text-[#7B2D8E]" : "bg-white/20 text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className={`text-xs ${plan.highlighted ? "text-gray-500" : "text-white/60"}`}>
                      {plan.points} pts/mes
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <span className={`text-xs ${plan.highlighted ? "text-gray-500" : "text-white/60"}`}>R$</span>
                  <span className="text-3xl font-bold ml-1">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-gray-500" : "text-white/60"}`}>/mes</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? "text-[#7B2D8E]" : "text-orange-300"
                        }`}
                      />
                      <span className={plan.highlighted ? "text-gray-600" : "text-white/80"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold no-default-hover-elevate ${
                    plan.highlighted
                      ? "bg-[#7B2D8E] border-[#7B2D8E] text-white"
                      : "bg-white/20 text-white border border-white/30"
                  }`}
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  Assinar agora
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
