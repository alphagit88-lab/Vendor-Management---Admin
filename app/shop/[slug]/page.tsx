"use client";

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { useParams, useRouter } from "next/navigation";
import { HardwareProduct, fetchProductBySlug, getProductGalleryImages } from "@/lib/shop";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { ProductImageSlider } from "@/components/ProductImageSlider";
import { useCart } from "@/app/contexts/CartContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";

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

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<HardwareProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    fetchProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div style={themeVars} className={`min-h-screen bg-[var(--landing-bg)] ${spaceGrotesk.variable}`}>
        <LandingHeader />
        <main className="pt-[116px] text-center text-[var(--landing-muted)]">Loading product...</main>
        <LandingFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={themeVars}
        className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
      >
        <LandingHeader />
        <main className="pt-[116px] flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="font-[family:var(--font-space-grotesk)] text-2xl font-bold text-[var(--landing-brand-strong)]">Product Not Found</h1>
            <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-accent)] hover:underline">
              Go Back to Shop
            </Link>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div
      style={themeVars}
      className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
    >
      <LandingHeader />
      <main className="pt-[116px]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-brand-strong)] hover:text-[var(--landing-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ProductImageSlider images={getProductGalleryImages(product.image, product.images)} alt={product.name} />

            <div>
              <h1 className="font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-6 text-3xl font-bold font-[family:var(--font-space-grotesk)] tracking-[-0.05em] text-[var(--landing-accent)]">
                ${product.price.toFixed(2)}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--landing-muted)]">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
              <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                {product.description}
              </p>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.36)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>

          {product.longDescription && (
            <section className="mt-8">
              <div className="rounded-[2.2rem] bg-gradient-to-br from-[var(--landing-surface-strong)]/70 via-[var(--landing-surface)]/50 to-[var(--landing-bg)] px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent)]">
                  Overview
                </p>
                <h2 className="mt-3 font-[family:var(--font-space-grotesk)] text-2xl font-bold tracking-[-0.04em] text-[var(--landing-brand-strong)] sm:text-3xl">
                  Product Details
                </h2>
                <div className="mt-3 h-0.5 w-10 rounded-full bg-[var(--landing-accent)]/60" />
                <p className="mt-8 whitespace-pre-line text-base leading-[1.85] text-[var(--landing-ink)]/75 sm:text-[1.05rem]">
                  {product.longDescription}
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
