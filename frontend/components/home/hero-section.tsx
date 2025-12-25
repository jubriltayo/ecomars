import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap, Rocket } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="space-y-16">
      {/* Main Hero */}
      <section className="text-center py-12 md:py-24 relative overflow-hidden rounded-3xl bg-linear-card border">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-warm text-white text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            The Future of Digital Commerce
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient-primary">Sell Digital</span>
            <br />
            <span className="text-gradient-warm">Products That Matter</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Ecomars is your all-in-one platform to sell digital products,
            connect with customers, and grow your creative business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-linear-primary hover:opacity-90 text-white shine-effect"
            >
              <Link href="/products">
                Browse Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-start-selling"
            >
              <Link href="/sell">
                Start Selling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Shield}
          title="Secure Payments"
          description="Industry-leading encryption and secure payment processing for peace of mind."
          variant="primary"
        />
        <FeatureCard
          icon={Zap}
          title="Instant Delivery"
          description="Digital products delivered instantly after purchase. No waiting required."
          variant="warm"
        />
        <FeatureCard
          icon={Rocket}
          title="Creator-First"
          description="Built for creators with the tools you need to succeed and grow your audience."
          variant="cool"
        />
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant: "primary" | "warm" | "cool";
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  variant,
}: FeatureCardProps) {
  const variantClasses = {
    primary: "feature-icon-primary",
    warm: "feature-icon-warm",
    cool: "feature-icon-cool",
  };

  return (
    <div className="p-6 rounded-2xl bg-linear-card border feature-card">
      <div className={`feature-icon ${variantClasses[variant]} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
