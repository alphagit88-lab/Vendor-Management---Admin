'use client';

import type { CSSProperties, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';
import { createCheckoutSession, validateCart } from '@/lib/shop';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';

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
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartLineItems, isReady } = useCart();
  const [validatedTotal, setValidatedTotal] = useState<number | null>(null);
  const [validatedItems, setValidatedItems] = useState<Array<{ name: string; quantity: number; lineTotal: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
  });

  useEffect(() => {
    if (!isReady) return;
    if (cartLineItems.length === 0) {
      router.replace('/cart');
      return;
    }

    validateCart(cartLineItems)
      .then((data) => {
        setValidatedTotal(data.total);
        setValidatedItems(
          data.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          }))
        );
      })
      .catch((err) => setError(err.message || 'Unable to validate cart'));
  }, [isReady, cartLineItems, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createCheckoutSession({
        items: cartLineItems,
        customer: form,
      });
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div style={themeVars} className={`min-h-screen bg-[var(--landing-bg)] ${spaceGrotesk.variable}`}>
        <LandingHeader />
        <main className="pt-[116px] text-center text-[var(--landing-muted)]">Preparing checkout...</main>
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
          <Link
            href="/cart"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-brand-strong)] hover:text-[var(--landing-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <h1 className="font-[family:var(--font-space-grotesk)] text-4xl font-bold tracking-[-0.06em] text-[var(--landing-brand-strong)]">
            Checkout
          </h1>
          <p className="mt-3 text-[var(--landing-muted)]">
            Enter your details below. Payment is securely processed by Stripe.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <form onSubmit={handleSubmit} className="rounded-[2.2rem] bg-white p-8 shadow-[0_24px_64px_rgba(17,32,51,0.08)] space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[var(--landing-brand-strong)] mb-2">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--landing-brand-strong)] mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--landing-brand-strong)] mb-2">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--landing-brand-strong)] mb-2">Shipping Address</label>
                <textarea
                  required
                  rows={4}
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting || validatedTotal === null}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {submitting ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
              </button>
            </form>

            <div className="rounded-[2.2rem] bg-gradient-to-br from-[var(--landing-surface-strong)]/70 via-[var(--landing-surface)]/50 to-[var(--landing-bg)] p-8">
              <h2 className="text-xl font-bold text-[var(--landing-brand-strong)]">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {(validatedItems.length ? validatedItems : cart.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  lineTotal: item.price * item.quantity,
                }))).map((item) => (
                  <div key={`${item.name}-${item.quantity}`} className="flex justify-between gap-4 text-sm">
                    <span className="text-[var(--landing-muted)]">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-[var(--landing-brand-strong)]">${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-black/10 flex justify-between items-center">
                <span className="font-bold text-lg text-[var(--landing-brand-strong)]">Total</span>
                <span className="font-bold text-2xl text-[var(--landing-accent)]">
                  ${(validatedTotal ?? 0).toFixed(2)}
                </span>
              </div>
              <p className="mt-4 text-xs text-[var(--landing-muted)]">
                Prices and stock are verified on our servers before payment. Final amount is charged by Stripe.
              </p>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
