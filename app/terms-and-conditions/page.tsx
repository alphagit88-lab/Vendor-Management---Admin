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
              <p>
                Welcome to Super Vendor. These Terms and Conditions govern your access to and use of our software and services. This platform is strictly dedicated to serving small vendors. By choosing to use our services, you fully agree to the terms outlined below.
              </p>

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  1. Communications Consent
                </h3>
                <p className="mt-2">
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

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  2. Absolute Limitation of Liability
                </h3>
                <p className="mt-2">
                  Super Vendor provides its platform and services on an "as is" basis. By using our platform, you explicitly agree that:
                </p>
                <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Zero Liability:</strong> Super Vendor, its developers, and its affiliates are not liable for anything related to your use of this service.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Data Loss:</strong> We are completely absolved of any responsibility or liability for data losses, corruption, or breaches of any kind.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Waiver of Legal Action:</strong> You agree that you cannot take any legal action, file lawsuits, or initiate arbitration against Super Vendor for any reason, under any circumstances, resulting from your decision to use our services.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  3. Vendor and Customer Responsibility
                </h3>
                <p className="mt-2">
                  Super Vendor operates solely as a software platform and is completely removed from your daily business operations and transactions.
                </p>
                <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Full Accountability:</strong> You and your customers bear total responsibility for everything concerning your business, your transactions, and your interactions.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Product Delivery:</strong> We are not responsible for the products you deliver, the quality of your goods, shipping issues, or customer disputes.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  4. Legal Compliance and Prohibited Activities
                </h3>
                <p className="mt-2">
                  As a vendor utilizing our platform, you must operate strictly within the bounds of the law.
                </p>
                <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">USA Compliance:</strong> You are entirely responsible for ensuring that all products you sell and distribute are 100% legal to sell within the United States of America.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Strict Prohibition:</strong> The sale, promotion, or distribution of any illegal, counterfeit, or regulated illicit products using the Super Vendor platform is strictly prohibited. Violation of this clause will result in immediate termination.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  5. Billing, Termination, and Data Access
                </h3>
                <p className="mt-2">
                  Access to Super Vendor is contingent upon your timely payment for our services.
                </p>
                <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Right to Terminate:</strong> If you fail to pay for your subscription or service fees, we reserve the right to immediately suspend or terminate your account without prior notice.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Loss of Data Access:</strong> Upon account termination due to non-payment or policy violation, you will immediately lose all access to your account and your data.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Data Responsibility Post-Termination:</strong> Super Vendor is not responsible for storing, retrieving, or transferring your data once your account has been terminated.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-lg">
                  6. Subscription Pricing and Fair Usage
                </h3>
                <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Price Increases:</strong> We reserve the right to increase your monthly subscription charges. You will be provided with a thirty (30) day prior notice before any new pricing takes effect.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Mandatory Upgrades:</strong> Our lowest subscription tiers are designed for standard usage. If you are on the lowest subscription plan and we determine that your account is using our system heavily or utilizing excessive resources, we reserve the right to force an upgrade to a higher subscription tier.
                  </li>
                  <li>
                    <strong className="text-[var(--landing-brand-strong)]">Refusal to Upgrade:</strong> If you refuse to comply with a mandatory upgrade due to heavy usage, we retain the right to terminate your account immediately and you will lose access to your data, as outlined in Section 5.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
