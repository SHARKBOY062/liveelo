import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import SecurityBanner from "@/components/SecurityBanner";
import HeroBanner from "@/components/HeroBanner";
import CpfConsulta from "@/components/CpfConsulta";
import ProductsCarousel from "@/components/ProductsCarousel";
import AppDownload from "@/components/AppDownload";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <PromoBar />
      <Header />
      <SecurityBanner />
      <HeroBanner />
      <CpfConsulta />
      <ProductsCarousel />
      <AppDownload />
      <Footer />
    </div>
  );
}
