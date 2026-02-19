import { Smartphone, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppDownload() {
  return (
    <section className="py-16 px-4 lg:px-6 bg-white" data-testid="app-download-section">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <span className="text-[#FF6600] text-sm font-semibold uppercase tracking-wider mb-3 block">
                Baixe o app
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-app-title">
                Livelo na palma da sua mao
              </h2>
              <p className="text-gray-400 text-base mb-6 leading-relaxed">
                Acompanhe seus pontos, resgate produtos, compre com Pix e muito mais. Tudo pelo app Livelo.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white text-sm">4.7 na App Store</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="no-default-hover-elevate"
                  data-testid="button-app-store"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </Button>
                <Button
                  variant="secondary"
                  className="no-default-hover-elevate"
                  data-testid="button-google-play"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33-2.928 1.693-2.39-2.39 3.016-3.016zM5.864 2.658L16.8 8.991l-2.302 2.302L5.864 2.658z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center p-8">
              <div className="relative">
                <div className="w-64 h-[500px] rounded-[2.5rem] border-4 border-gray-700 overflow-hidden">
                  <img src="/images/livelo-logo.jpg" alt="App Livelo" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#FF6600] text-white rounded-2xl p-4 shadow-xl">
                  <Download className="w-6 h-6 mb-1" />
                  <p className="text-xs font-bold">Gratis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
