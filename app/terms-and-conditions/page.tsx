'use client';

import type { CSSProperties } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';

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

export default function TermsAndConditionsPage() {
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
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2.2rem] border border-black/6 bg-white p-8 md:p-12 shadow-[0_32px_96px_rgba(17,32,51,0.24)]">
            <h2 className="font-[family:var(--font-space-grotesk)] text-3xl font-bold leading-tight tracking-[-0.05em] text-[var(--landing-brand-strong)]">
              Terms and Conditions
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--landing-accent)]">
              Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="mt-6 border-t border-black/5 pt-6 space-y-6 text-sm leading-relaxed text-[var(--landing-muted)]">
              <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                Communications Consent
              </h3>
              <p>
                By signing up for, subscribing to, or using our services, you consent to receive communications from us by email and SMS/text message regarding your account, services, transactions, billing, support, updates, reminders, and other service-related information.
              </p>
              <p>
                By creating an account, submitting your information, or otherwise signing up for our services, you expressly agree to receive these communications. Such communications may be sent for as long as you maintain an active paid customer relationship with us.
              </p>
              <p>
                Message and data rates may apply for SMS/text messages, depending on your mobile carrier and plan. Customers may opt out of promotional communications where permitted by law; however, service-related communications that are necessary for account administration, billing, security, or delivery of services may continue while the customer maintains an active account.
              </p>
              <p>
                By providing your email address and mobile phone number, you represent that you are authorized to receive communications at those contact methods and agree to keep your contact information current and accurate.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
