import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const footerSections = [
  {
    title: "Juntar pontos",
    links: ["Cartoes de credito", "Shopping Livelo", "Parceiros", "Compras internacionais", "Clube Livelo"],
  },
  {
    title: "Usar pontos",
    links: ["Viagens", "Produtos", "Gift cards", "Experiencias", "Pix com pontos", "Transferir pontos"],
  },
  {
    title: "Institucional",
    links: ["Sobre a Livelo", "Trabalhe conosco", "Imprensa", "Blog", "Regulamentos"],
  },
  {
    title: "Ajuda",
    links: ["Central de ajuda", "Fale conosco", "Politica de privacidade", "Termos de uso", "Seguranca"],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-gray-900 text-gray-300" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <svg width="100" height="28" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="24" fontFamily="Inter" fontWeight="800" fontSize="22" fill="#FFFFFF">livelo</text>
                <circle cx="108" cy="12" r="4" fill="#FF6600" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              O maior programa de pontos e recompensas do Brasil. Junte e use pontos do seu jeito.
            </p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold hover-elevate"
                  data-testid={`social-${social.toLowerCase()}`}
                >
                  {social[0]}
                </button>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="sm:cursor-default flex items-center justify-between w-full sm:pointer-events-none"
              >
                <h4 className="font-semibold text-white text-sm mb-0 sm:mb-4">{section.title}</h4>
                <span className="sm:hidden">
                  {openSection === section.title ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>
              <ul
                className={`mt-3 sm:mt-0 space-y-2.5 ${
                  openSection === section.title ? "block" : "hidden sm:block"
                }`}
              >
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500" data-testid="text-copyright">
              Livelo S.A. - CNPJ: 29.278.684/0001-00. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" data-testid="link-privacy">
                Privacidade
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" data-testid="link-terms">
                Termos
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" data-testid="link-cookies">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
