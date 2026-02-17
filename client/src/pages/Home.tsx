import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import SecurityBanner from "@/components/SecurityBanner";
import HeroBanner from "@/components/HeroBanner";
import TravelSearch from "@/components/TravelSearch";
import PointsSection from "@/components/PointsSection";
import ProductsCarousel from "@/components/ProductsCarousel";
import DestinationsSection from "@/components/DestinationsSection";
import Partners from "@/components/Partners";
import ClubLivelo from "@/components/ClubLivelo";
import AppDownload from "@/components/AppDownload";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <PromoBar />
      <Header />
      <SecurityBanner />
      <HeroBanner />
      <TravelSearch />
      <div className="mt-8">
        <PointsSection />
      </div>
      <ProductsCarousel />
      <DestinationsSection />
      <Partners />
      <ClubLivelo />
      <AppDownload />
      <Footer />
    </div>
  );
}
