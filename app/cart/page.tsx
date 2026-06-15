'use client';

import type { CSSProperties } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { useCart } from '@/app/contexts/CartContext';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/MediaImage';

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

export default function CartPage() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

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
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-brand-strong)] hover:text-[var(--landing-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--landing-muted)]">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>

          {cart.length === 0 ? (
            <div className="mt-12 text-center py-20 bg-white rounded-[2.2rem] border border-black/5 shadow-[0_24px_64px_rgba(17,32,51,0.08)]">
              <ShoppingCart className="w-16 h-16 mx-auto text-[var(--landing-muted)] mb-6" />
              <h2 className="text-2xl font-bold text-[var(--landing-brand-strong)] mb-4">
                Your cart is empty
              </h2>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-[2.2rem] border border-black/5 shadow-[0_12px_36px_rgba(17,32,51,0.06)]"
                  >
                    <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-gray-100">
                      <MediaImage
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-xl font-bold font-[family:var(--font-space-grotesk)] text-[var(--landing-brand-strong)] hover:text-[var(--landing-accent)] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-2xl font-bold font-[family:var(--font-space-grotesk)] tracking-[-0.05em] text-[var(--landing-accent)]">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-3 rounded-full bg-[var(--landing-accent-soft)] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white text-[var(--landing-brand-strong)] font-semibold shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center font-semibold text-[var(--landing-brand-strong)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white text-[var(--landing-brand-strong)] font-semibold shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="sm:self-end text-right">
                      <p className="text-2xl font-bold font-[family:var(--font-space-grotesk)] tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={clearCart}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="p-8 bg-white rounded-[2.2rem] border border-black/5 shadow-[0_24px_64px_rgba(17,32,51,0.08)]">
                  <h3 className="text-xl font-bold font-[family:var(--font-space-grotesk)] text-[var(--landing-brand-strong)]">
                    Order Summary
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--landing-muted)] font-medium">Subtotal</span>
                      <span className="font-semibold text-[var(--landing-brand-strong)]">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--landing-muted)] font-medium">Shipping</span>
                      <span className="font-semibold text-[var(--landing-brand-strong)]">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-[var(--landing-brand-strong)] text-lg">Total</span>
                      <span className="font-bold text-[var(--landing-accent)] text-2xl">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-8 w-full inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.36)]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}