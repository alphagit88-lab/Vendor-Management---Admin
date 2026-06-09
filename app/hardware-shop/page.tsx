"use client";

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { HardwareProduct, fetchPublicProducts } from "@/lib/shop";
import { MediaImage } from "@/components/MediaImage";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { useCart } from "@/app/contexts/CartContext";
import { ShoppingCart, ArrowRight } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const themeVars: CSSProperties = {
  ['--landing-bg' as string]: '#f5efe7',
  ['--landing-surface' as string]: '#fffaf4',
  ['--landing-surface-strong' as string]: '#f1e6d7',
  ['--landing-ink' as string]: '#112033',
  ['--landing-muted' as string]: '#5b6778',
  ['--landing-brand' as string]: '#1d4160',
  ['--landing-brand-strong' as string]: '#0d1b2b',
  ['--landing-accent' as string]: '#c86c49',
  ['--landing-accent-soft' as string]: '#ead2c3',
  ['--landing-highlight' as string]: '#5f9ea0',
};

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<HardwareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicProducts()
      .then(setProducts)
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={themeVars}
      className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <LandingHeader />
      <main className="pt-[116px]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
              Hardware Shop
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--landing-muted)]">
              Professional equipment for your delivery operations.
            </p>
          </div>

          {loading ? (
            <p className="mt-12 text-center text-[var(--landing-muted)]">Loading products...</p>
          ) : error ? (
            <p className="mt-12 text-center text-red-600">{error}</p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-[2.2rem] border border-black/6 bg-white shadow-[0_24px_64px_rgba(17,32,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(29,65,96,0.3)] hover:shadow-[0_32px_72px_rgba(17,32,51,0.12)]"
                >
                  <Link href={`/hardware-shop/${product.slug}`}>
                    <div className="relative h-64 bg-[var(--landing-surface)] overflow-hidden">
                      <MediaImage
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={product.id <= 3}
                      />
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/hardware-shop/${product.slug}`}>
                      <h3 className="text-lg font-bold font-[family:var(--font-space-grotesk)] text-[var(--landing-brand-strong)] hover:text-[var(--landing-accent)] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--landing-muted)]">
                      {product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold font-[family:var(--font-space-grotesk)] tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.stock <= 0 && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-red-500">Out of stock</span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/hardware-shop/${product.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[var(--landing-accent-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--landing-brand-strong)] hover:bg-[var(--landing-accent-soft)] transition-all duration-200"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(200,108,73,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--landing-accent)]/90 hover:shadow-[0_20px_40px_rgba(200,108,73,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
