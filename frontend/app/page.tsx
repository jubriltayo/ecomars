import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedProducts />
    </div>
  );
}
