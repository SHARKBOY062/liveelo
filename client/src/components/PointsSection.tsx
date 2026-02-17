import { CreditCard, ShoppingBag, Smartphone, Gift, ArrowRight } from "lucide-react";

const ways = [
  {
    icon: CreditCard,
    title: "Cartao de credito",
    desc: "Junte pontos automaticamente nas suas compras do dia a dia com cartoes parceiros.",
    color: "bg-purple-100 text-[#7B2D8E]",
  },
  {
    icon: ShoppingBag,
    title: "Shopping Livelo",
    desc: "Compre em lojas parceiras e acumule pontos extras em cada compra.",
    color: "bg-orange-100 text-[#FF6600]",
  },
  {
    icon: Smartphone,
    title: "Parceiros no app",
    desc: "Vincule servicos como Uber, iFood e outros para juntar pontos automaticamente.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Gift,
    title: "Clube Livelo",
    desc: "Assine e turbine seus pontos com bonificacoes exclusivas todo mes.",
    color: "bg-green-100 text-green-600",
  },
];

export default function PointsSection() {
  return (
    <section className="py-16 px-4 lg:px-6 bg-white" data-testid="points-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-points-title">
            Como juntar pontos Livelo
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Existem diversas maneiras de acumular pontos. Escolha a melhor para voce e comece agora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ways.map((way) => {
            const Icon = way.icon;
            return (
              <div
                key={way.title}
                className="group bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                data-testid={`card-${way.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-12 h-12 rounded-xl ${way.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">{way.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{way.desc}</p>
                <span className="text-[#7B2D8E] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
