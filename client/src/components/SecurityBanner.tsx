import { ShieldCheck, X } from "lucide-react";
import { useState } from "react";

export default function SecurityBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200" data-testid="security-banner">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Atencao!</span> A Livelo NAO envia SMS pedindo informacoes bancarias, nem codigos de seguranca e dados sensiveis.{" "}
            <button className="text-[#7B2D8E] font-semibold underline" data-testid="security-link">
              Confira nossas dicas de seguranca
            </button>
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-amber-600 hover:text-amber-800 flex-shrink-0"
          data-testid="security-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
