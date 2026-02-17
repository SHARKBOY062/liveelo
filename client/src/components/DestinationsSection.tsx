import { ArrowRight, MapPin } from "lucide-react";

const destinations = [
  {
    city: "Rio de Janeiro",
    country: "Brasil",
    points: "A partir de 12.000 pts",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    points: "A partir de 25.000 pts",
    gradient: "from-sky-500 to-indigo-700",
  },
  {
    city: "Lisboa",
    country: "Portugal",
    points: "A partir de 55.000 pts",
    gradient: "from-amber-500 to-orange-700",
  },
  {
    city: "Miami",
    country: "Estados Unidos",
    points: "A partir de 42.000 pts",
    gradient: "from-teal-500 to-cyan-700",
  },
  {
    city: "Paris",
    country: "Franca",
    points: "A partir de 60.000 pts",
    gradient: "from-rose-500 to-pink-700",
  },
  {
    city: "Cancun",
    country: "Mexico",
    points: "A partir de 35.000 pts",
    gradient: "from-emerald-500 to-green-700",
  },
];

export default function DestinationsSection() {
  return (
    <section className="py-16 px-4 lg:px-6 bg-gray-50" data-testid="destinations-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-destinations-title">
              Destinos populares
            </h2>
            <p className="text-gray-500 text-sm mt-1">Use pontos para viajar para destinos incriveis</p>
          </div>
          <button className="text-[#7B2D8E] text-sm font-semibold flex items-center gap-1" data-testid="link-all-destinations">
            Ver mais destinos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => (
            <div
              key={dest.city}
              className={`relative bg-gradient-to-br ${dest.gradient} rounded-xl p-5 text-white cursor-pointer group overflow-hidden aspect-[3/4] flex flex-col justify-end`}
              data-testid={`destination-${dest.city.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs text-white/80">{dest.country}</span>
                </div>
                <h3 className="font-bold text-base mb-1">{dest.city}</h3>
                <p className="text-xs text-white/80">{dest.points}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
