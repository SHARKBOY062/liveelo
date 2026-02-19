import { useState } from "react";
import { ChevronRight, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  "Destaques",
  "Eletronicos",
  "Casa e Decoracao",
  "Moda",
  "Games",
  "Beleza",
  "Esportes",
];

const products = [
  {
    name: "Smart TV 55\" 4K UHD",
    brand: "Samsung",
    points: "89.900",
    pointsPlusCash: "45.000 pts + R$ 899",
    rating: 4.5,
    tag: "Mais vendido",
    image: "/images/product-tv.png",
    category: "Eletronicos",
  },
  {
    name: "Fone Bluetooth Premium",
    brand: "JBL",
    points: "15.900",
    pointsPlusCash: "8.000 pts + R$ 159",
    rating: 4.7,
    tag: "Novo",
    image: "/images/product-headphones.png",
    category: "Eletronicos",
  },
  {
    name: "Air Fryer Digital 5.5L",
    brand: "Mondial",
    points: "22.500",
    pointsPlusCash: "11.000 pts + R$ 225",
    rating: 4.3,
    tag: null,
    image: "/images/product-airfryer.png",
    category: "Casa e Decoracao",
  },
  {
    name: "Kit Perfume Masculino",
    brand: "Boticario",
    points: "18.900",
    pointsPlusCash: "9.500 pts + R$ 189",
    rating: 4.8,
    tag: "Oferta",
    image: "/images/product-perfume.png",
    category: "Beleza",
  },
  {
    name: "Console Game Next Gen",
    brand: "Sony",
    points: "199.000",
    pointsPlusCash: "100.000 pts + R$ 1.990",
    rating: 4.9,
    tag: "Mais vendido",
    image: "/images/product-console.png",
    category: "Games",
  },
  {
    name: "Tenis Esportivo Running",
    brand: "Nike",
    points: "32.000",
    pointsPlusCash: "16.000 pts + R$ 320",
    rating: 4.4,
    tag: null,
    image: "/images/product-shoes.png",
    category: "Esportes",
  },
];

export default function ProductsCarousel() {
  const [activeCategory, setActiveCategory] = useState("Destaques");
  const [showPopup, setShowPopup] = useState(false);

  const filtered = activeCategory === "Destaques" ? products : products.filter((p) => p.category === activeCategory);

  const handleProductClick = () => {
    setShowPopup(true);
  };

  const handleGoToConsulta = () => {
    setShowPopup(false);
    const cpfInput = document.querySelector('[data-testid="input-cpf"]');
    if (cpfInput) {
      cpfInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (cpfInput as HTMLInputElement).focus(), 600);
    }
  };

  return (
    <>
      <section className="py-16 px-4 lg:px-6 bg-gray-50" data-testid="products-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-products-title">
                Use seus pontos
              </h2>
              <p className="text-gray-500 text-sm mt-1">Troque seus pontos por produtos incriveis</p>
            </div>
            <button className="text-[#7B2D8E] text-sm font-semibold flex items-center gap-1" data-testid="link-see-all">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeCategory === cat
                    ? "bg-[#7B2D8E] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#7B2D8E] hover:text-[#7B2D8E]"
                  }`}
                data-testid={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(filtered.length > 0 ? filtered : products.slice(0, 4)).map((product, i) => (
                <div
                  key={i}
                  onClick={handleProductClick}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                  data-testid={`product-card-${i}`}
                >
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-[#FF6600] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 font-medium mb-1">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">{product.rating}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#7B2D8E] font-bold text-lg">{product.points} <span className="text-xs font-medium">pontos</span></p>
                      <p className="text-xs text-gray-400">ou {product.pointsPlusCash}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          onClick={() => setShowPopup(false)}
          data-testid="popup-cpf-overlay"
        >
          <div
            className="bg-white rounded-md max-w-[360px] w-[90%] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="popup-cpf-box"
          >
            <AlertTriangle className="w-12 h-12 text-[#FF6600] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Consulte seus pontos primeiro
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Para continuar, e necessario consultar seus pontos informando seu CPF.
            </p>
            <Button
              onClick={handleGoToConsulta}
              className="w-full bg-[#7B2D8E] border-[#7B2D8E] text-white font-semibold mb-2"
              data-testid="button-popup-consultar"
            >
              Consultar Agora
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowPopup(false)}
              className="w-full text-gray-500"
              data-testid="button-popup-cancelar"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
