'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import { verifyCheckoutSession, ShopOrder } from '@/lib/shop';
import { useCart } from '@/app/contexts/CartContext';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { CheckCircle2, Loader2 } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const themeVars: CSSProperties = {
  ['--landing-bg' as string]: '#f5efe7',
  ['--landing-surface' as string]: '#fffaf4',
  ['--landing-ink' as string]: '#112033',
  ['--landing-muted' as string]: '#5b6778',
  ['--landing-brand' as string]: '#1d4160',
  ['--landing-brand-strong' as string]: '#0d1b2b',
  ['--landing-accent' as string]: '#c86c49',
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing payment session.');
      return;
    }

    verifyCheckoutSession(sessionId)
      .then((data) => {
        setOrder(data.order);
        setPaymentStatus(data.paymentStatus);
        if (data.paymentStatus === 'paid' || data.order.status === 'paid') {
          clearCart();
        }
      })
      .catch((err) => setError(err.message || 'Unable to verify payment'));
  }, [sessionId, clearCart]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-[var(--landing-muted)]">
        <Loader2 className="w-5 h-5 animate-spin" />
        Confirming your payment...
      </div>
    );
  }

  const isPaid = paymentStatus === 'paid' || order.status === 'paid';

  return (
    <div className="max-w-2xl mx-auto text-center pt-4 sm:pt-8">
      <CheckCircle2 className={`w-16 h-16 mx-auto mb-6 ${isPaid ? 'text-green-600' : 'text-amber-500'}`} />
      <h1 className="font-[family:var(--font-space-grotesk)] text-3xl font-bold text-[var(--landing-brand-strong)]">
        {isPaid ? 'Payment Successful' : 'Payment Pending'}
      </h1>
      <p className="mt-3 text-[var(--landing-muted)]">
        {isPaid
          ? 'Thank you for your order. A confirmation has been recorded in our system.'
          : 'Your payment is still being processed. Please check back shortly.'}
      </p>

      <div className="mt-8 rounded-[2rem] bg-white p-8 text-left shadow-[0_24px_64px_rgba(17,32,51,0.08)]">
        <p className="text-sm text-[var(--landing-muted)]">Order Number</p>
        <p className="text-xl font-bold text-[var(--landing-brand-strong)]">{order.orderNumber}</p>

        <div className="mt-6 space-y-2 text-sm">
          <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
          <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
          {order.customerPhone && <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>}
          <p className="whitespace-pre-line"><span className="font-semibold">Shipping:</span><br />{order.shippingAddress}</p>
          <p><span className="font-semibold">Status:</span> {order.status}</p>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.productName} × {item.quantity}</span>
              <span className="font-semibold">${item.lineTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-bold text-lg">
          <span>Total Paid</span>
          <span className="text-[var(--landing-accent)]">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div
      style={themeVars}
      className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
    >
      <LandingHeader />
      <main className="pt-[140px]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense fallback={<p className="py-12 text-center text-[var(--landing-muted)]">Loading...</p>}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
