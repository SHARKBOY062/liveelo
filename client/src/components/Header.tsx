import { useState } from "react";
import { Search, User, Menu, X, ChevronDown, ShoppingCart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Juntar pontos", hasDropdown: true },
  { label: "Usar pontos", hasDropdown: true },
  { label: "Cartoes de credito", hasDropdown: true },
  { label: "Clube Livelo", hasDropdown: false },
  { label: "Pra voce", hasDropdown: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-100" data-testid="header">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="/" className="flex items-center" data-testid="logo-link">
              <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="24" fontFamily="Inter" fontWeight="800" fontSize="22" fill="#7B2D8E">livelo</text>
                <circle cx="108" cy="12" r="4" fill="#FF6600" />
              </svg>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1" data-testid="main-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#7B2D8E] transition-colors rounded-md"
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-[#7B2D8E] transition-colors rounded-md"
              data-testid="search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-[#7B2D8E] transition-colors rounded-md hidden sm:block"
              data-testid="help-button"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-[#7B2D8E] transition-colors rounded-md hidden sm:block"
              data-testid="cart-button"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <Button
              variant="outline"
              className="ml-2 border-[#7B2D8E] text-[#7B2D8E] hover:bg-[#7B2D8E] hover:text-white text-sm font-semibold no-default-hover-elevate"
              data-testid="login-button"
            >
              <User className="w-4 h-4 mr-1.5" />
              Entrar
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-100 px-4 lg:px-6 py-3" data-testid="search-bar">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Busque por produtos, viagens, parceiros..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8E]/20 focus:border-[#7B2D8E]"
                data-testid="search-input"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-gray-700 border-b border-gray-50"
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
