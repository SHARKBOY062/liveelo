import { ArrowRight } from "lucide-react";

const partnerCategories = [
  {
    title: "Companhias aereas",
    partners: [
      { name: "LATAM", color: "#1B3A6B" },
      { name: "Azul", color: "#003087" },
      { name: "GOL", color: "#FF6600" },
      { name: "TAP", color: "#004D40" },
      { name: "American", color: "#0078D2" },
      { name: "Delta", color: "#C8102E" },
    ],
  },
  {
    title: "Cartoes de credito",
    partners: [
      { name: "Bradesco", color: "#CC092F" },
      { name: "BB", color: "#FFEB3B" },
      { name: "Inter", color: "#FF6600" },
      { name: "C6 Bank", color: "#242424" },
      { name: "Pan", color: "#0066B3" },
      { name: "BMG", color: "#FF6600" },
    ],
  },
  {
    title: "Shopping online",
    partners: [
      { name: "Amazon", color: "#FF9900" },
      { name: "Magazine", color: "#0086FF" },
      { name: "Netshoes", color: "#242424" },
      { name: "Centauro", color: "#E31837" },
      { name: "Boticario", color: "#004D40" },
      { name: "Renner", color: "#CC092F" },
    ],
  },
];

export default function Partners() {
  return (
    <section className="py-16 px-4 lg:px-6 bg-white" data-testid="partners-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-partners-title">
            Parceiros Livelo
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Junte e use pontos com mais de 340 parceiros em diversas categorias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerCategories.map((category) => (
            <div key={category.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100" data-testid={`partner-category-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <h3 className="font-semibold text-gray-900 mb-5 text-base">{category.title}</h3>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {category.partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="bg-white rounded-lg h-16 flex items-center justify-center border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow"
                    data-testid={`partner-${partner.name.toLowerCase()}`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: partner.color }}
                    >
                      {partner.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[#7B2D8E] text-sm font-semibold flex items-center gap-1 mx-auto" data-testid={`link-all-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
                Ver todos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
