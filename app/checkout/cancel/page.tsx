'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { XCircle } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const themeVars: CSSProperties = {
  ['--landing-bg' as string]: '#f5efe7',
  ['--landing-muted' as string]: '#5b6778',
  ['--landing-brand-strong' as string]: '#0d1b2b',
  ['--landing-accent' as string]: '#c86c49',
};

export default function CheckoutCancelPage() {
  return (
    <div
      style={themeVars}
      className={`min-h-screen bg-[var(--landing-bg)] ${spaceGrotesk.variable}`}
    >
      <LandingHeader />
      <main className="pt-[116px] px-4 py-16 text-center">
        <XCircle className="w-16 h-16 mx-auto mb-6 text-amber-600" />
        <h1 className="font-[family:var(--font-space-grotesk)] text-3xl font-bold text-[var(--landing-brand-strong)]">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-[var(--landing-muted)] max-w-md mx-auto">
          Your payment was not completed. No charge was made. You can return to your cart and try again.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart" className="rounded-full bg-[var(--landing-accent)] px-8 py-4 font-semibold text-white">
            Back to Cart
          </Link>
          <Link href="/hardware-shop" className="rounded-full border border-black/10 bg-white px-8 py-4 font-semibold text-[var(--landing-brand-strong)]">
            Continue Shopping
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
