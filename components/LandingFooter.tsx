'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Hardware', href: '/#hardware' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Support & Contact', href: '/#contact' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--landing-brand)] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="font-[family:var(--font-space-grotesk)] text-2xl font-semibold tracking-[-0.05em]">
              SuperVendor
            </p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/74">
              Fast delivery tools with live sync and instant printing.
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
              <Link
                href="/terms-and-conditions"
                className="transition hover:text-white text-left"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="transition hover:text-white text-left"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Why SuperVendor?</p>
            <div className="mt-4 space-y-3 text-sm text-white/76">
              <p>Faster delivery stops.</p>
              <p>Fewer mistakes.</p>
              <p>Instant invoices.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Quick Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/52">Access</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/76">
              Ready to get started?
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/52 flex flex-col sm:flex-row sm:justify-center items-center gap-4">
          <span>Copyright {currentYear} SuperVendor.</span>
        </div>
      </div>
    </footer>
  );
};
