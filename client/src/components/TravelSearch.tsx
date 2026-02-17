import { useState } from "react";
import { Plane, Building2, Car, Package, Search, MapPin, Calendar, Users, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "voos", label: "Voos", icon: Plane },
  { id: "hoteis", label: "Hoteis", icon: Building2 },
  { id: "carros", label: "Carros", icon: Car },
  { id: "pacotes", label: "Pacotes", icon: Package },
];

export default function TravelSearch() {
  const [activeTab, setActiveTab] = useState("voos");
  const [roundTrip, setRoundTrip] = useState(true);

  return (
    <section className="relative -mt-16 z-10 px-4 lg:px-6" data-testid="travel-search">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors flex-1 justify-center
                    ${activeTab === tab.id
                      ? "text-[#7B2D8E] border-b-2 border-[#7B2D8E] bg-purple-50/50"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {activeTab === "voos" && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="trip"
                      checked={roundTrip}
                      onChange={() => setRoundTrip(true)}
                      className="accent-[#7B2D8E]"
                    />
                    Ida e volta
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="trip"
                      checked={!roundTrip}
                      onChange={() => setRoundTrip(false)}
                      className="accent-[#7B2D8E]"
                    />
                    Somente ida
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-3 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Origem"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                      data-testid="input-origin"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B2D8E]" data-testid="swap-airports">
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="md:col-span-3 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Destino"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                      data-testid="input-destination"
                    />
                  </div>
                  <div className="md:col-span-3 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Datas de ida e volta"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                      data-testid="input-dates"
                    />
                  </div>
                  <div className="md:col-span-1 relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="1"
                      defaultValue="1"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                      data-testid="input-travelers"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      className="w-full bg-[#7B2D8E] hover:bg-[#6a2579] text-white font-semibold py-3 h-auto rounded-lg no-default-hover-elevate"
                      data-testid="search-flights"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input type="checkbox" className="accent-[#7B2D8E] rounded" id="show-points" />
                  <label htmlFor="show-points" className="text-xs text-gray-500">
                    Exibir preco em pontos ou pontos+dinheiro
                  </label>
                </div>
              </div>
            )}

            {activeTab === "hoteis" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Destino"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-hotel-destination"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Entrada e saida"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-hotel-dates"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="2 hospedes | 1 quarto"
                    defaultValue="2 hospedes | 1 quarto"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-hotel-guests"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    className="w-full bg-[#7B2D8E] hover:bg-[#6a2579] text-white font-semibold py-3 h-auto rounded-lg no-default-hover-elevate"
                    data-testid="search-hotels"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "carros" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Onde quer retirar o carro?"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-car-pickup"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Retirada"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-car-pickup-date"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Devolucao"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-car-return-date"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    className="w-full bg-[#7B2D8E] hover:bg-[#6a2579] text-white font-semibold py-3 h-auto rounded-lg no-default-hover-elevate"
                    data-testid="search-cars"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "pacotes" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Origem"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-pkg-origin"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Destino"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-pkg-destination"
                  />
                </div>
                <div className="md:col-span-2 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Datas"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-pkg-dates"
                  />
                </div>
                <div className="md:col-span-2 relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Hospedes"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E] bg-gray-50"
                    data-testid="input-pkg-guests"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    className="w-full bg-[#7B2D8E] hover:bg-[#6a2579] text-white font-semibold py-3 h-auto rounded-lg no-default-hover-elevate"
                    data-testid="search-packages"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
