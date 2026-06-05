'use client';

import type { CSSProperties } from 'react';
import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
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

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--landing-accent)]">
              Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="mt-6 border-t border-black/5 pt-6 space-y-8 text-sm leading-relaxed text-[var(--landing-muted)]">
              <p>
                Welcome to SuperVendor ("Company," "we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and protect information when you visit or use our website,
                {' '}
                <code className="bg-[var(--landing-bg)] px-2 py-1 rounded text-[var(--landing-brand-strong)] font-mono">
                  https://www.supervendor.io
                </code>
                {' '}
                (the "Website"), and any related services (collectively, the "Services").
              </p>

              <p>
                By accessing or using our Services, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">1. Information We Collect</h3>

                <h4 className="font-bold text-[var(--landing-brand-strong)] text-lg mb-2">Information You Provide to Us</h4>
                <p className="mb-2">We may collect information that you voluntarily provide, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Name</li>
                  <li>Company name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing information</li>
                  <li>Account credentials</li>
                  <li>Customer support communications</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h4 className="font-bold text-[var(--landing-brand-strong)] text-lg mb-2 mt-6">Information Collected Automatically</h4>
                <p className="mb-2">When you use our Services, we may automatically collect certain information, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Website usage data</li>
                  <li>Pages visited</li>
                  <li>Date and time of visits</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">2. How We Use Your Information</h3>
                <p className="mb-2">We may use collected information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide, operate, and maintain our Services</li>
                  <li>Create and manage user accounts</li>
                  <li>Process transactions and payments</li>
                  <li>Communicate with users regarding accounts and services</li>
                  <li>Send service-related notifications</li>
                  <li>Provide customer support</li>
                  <li>Improve and develop our Services</li>
                  <li>Monitor and analyze usage trends</li>
                  <li>Detect, prevent, and address fraud, abuse, and security issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">3. Email and SMS Communications</h3>
                <p className="mb-2">By registering for, subscribing to, or using our Services, you consent to receive emails and SMS/text messages regarding:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Account notifications</li>
                  <li>Billing and payment information</li>
                  <li>Service updates</li>
                  <li>Security alerts</li>
                  <li>Customer support communications</li>
                  <li>Other service-related information</li>
                </ul>
                <p className="mt-2">
                  We may continue sending service-related communications while you maintain an active account or paid customer relationship with us.
                </p>
                <p className="mt-2">
                  Message and data rates may apply. You may opt out of marketing communications where applicable; however, essential service-related communications may continue as necessary to provide the Services.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">4. Cookies and Tracking Technologies</h3>
                <p className="mb-2">We use cookies, pixels, analytics tools, and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Remember user preferences</li>
                  <li>Improve website functionality</li>
                  <li>Analyze website traffic</li>
                  <li>Enhance user experience</li>
                  <li>Measure marketing effectiveness</li>
                </ul>
                <p className="mt-2">You may control cookies through your browser settings. Disabling cookies may affect certain features of the Services.</p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">5. Sharing of Information</h3>
                <p className="font-semibold mb-2">We do not sell your personal information.</p>
                <p className="mb-2">We may share information with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Service providers and vendors that help operate our business</li>
                  <li>Payment processors</li>
                  <li>Cloud hosting providers</li>
                  <li>Analytics providers</li>
                  <li>Customer support platforms</li>
                  <li>SMS and email communication providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="mt-2">All third parties are authorized to use your information only as necessary to provide services on our behalf or comply with legal obligations.</p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">6. Data Security</h3>
                <p>
                  We implement reasonable administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, disclosure, alteration, or destruction.
                </p>
                <p className="mt-2">
                  However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">7. Data Retention</h3>
                <p className="mb-2">We retain personal information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide our Services</li>
                  <li>Maintain business records</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">8. Your Privacy Rights</h3>
                <p className="mb-2">Depending on your location, you may have rights regarding your personal information, including the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of personal information</li>
                  <li>Object to certain processing activities</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="mt-2">To exercise these rights, please contact us using the information below.</p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">9. Third-Party Services</h3>
                <p>
                  Our Services may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices or content of those third parties.
                </p>
                <p className="mt-2">Users should review the privacy policies of any third-party services they access.</p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">10. Children's Privacy</h3>
                <p>
                  Our Services are not directed to children under the age of 13, and we do not knowingly collect personal information from children.
                </p>
                <p className="mt-2">
                  If we become aware that personal information has been collected from a child without appropriate consent, we will take reasonable steps to delete such information.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">11. International Data Transfers</h3>
                <p>
                  Your information may be processed and stored in countries other than your country of residence. By using our Services, you consent to such transfers where permitted by applicable law.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">12. Changes to This Privacy Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. Changes will become effective when posted on this page. Your continued use of the Services after any updates constitutes acceptance of the revised Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--landing-brand-strong)] text-xl mb-4">13. Contact Us</h3>
                <p className="mb-2">If you have any questions regarding this Privacy Policy or our privacy practices, please contact us:</p>
                <div className="space-y-1">
                  <p>SuperVendor</p>
                  <p>
                    Website:
                    {' '}
                    <Link href="http://www.supervendor.io" className="text-[var(--landing-accent)] underline hover:text-[var(--landing-brand-strong)]">
                      https://www.supervendor.io
                    </Link>
                  </p>
                  <p>
                    Email:
                    {' '}
                    <Link href="mailto:privacy@supervendor.io" className="text-[var(--landing-accent)] underline hover:text-[var(--landing-brand-strong)]">
                      privacy@supervendor.io
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
