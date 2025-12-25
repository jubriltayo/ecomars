import { Rocket } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t glass backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                Ecomars
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your digital marketplace for creators and buyers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  Digital Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="hover:text-primary transition-colors"
                >
                  Trending
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h3 className="text-sm font-semibold mb-4">For Creators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sell"
                  className="hover:text-primary transition-colors"
                >
                  Sell on Ecomars
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-primary transition-colors"
                >
                  Creator Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ecomars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
