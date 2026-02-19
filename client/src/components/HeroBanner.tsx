export default function HeroBanner() {
  return (
    <section className="relative w-full" data-testid="hero-banner">
      <img
        src="/images/hero-banner-livelo.webp"
        alt="Livelo - Seus pontos valem mais"
        className="w-full h-auto object-cover"
        data-testid="img-hero-banner"
      />
    </section>
  );
}
