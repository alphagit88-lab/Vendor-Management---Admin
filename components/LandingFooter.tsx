'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp } from 'lucide-react';

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
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 720);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
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

      {showTopButton ? (
        <button
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-24 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--landing-accent)] text-white shadow-[0_20px_40px_rgba(200,108,73,0.34)] transition hover:-translate-y-1"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      ) : null}

      <a
        href="https://wa.me/94715356485?text=Hello,%0AAnyone%20here%20to%20chat?"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_rgba(37,211,102,0.34)] transition hover:-translate-y-1"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.11.55 4.15 1.51 5.94L2 22l4.34-1.14c1.74.9 3.7 1.38 5.7 1.38 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.91zm5.63 13.8c-.25.7-1.45 1.33-2.03 1.35-.52.02-1.2.03-1.93-.12-.44-.09-1-.3-1.72-.59-3.02-1.23-4.99-4.1-5.13-4.29-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.12 1-2.42.25-.29.55-.36.73-.36.18 0 .37 0 .53.01.17.01.44-.06.69.51.26.6.89 2.07.97 2.22.08.15.13.33.04.53-.09.2-.14.33-.28.51-.14.19-.3.42-.43.57-.15.17-.31.36-.13.7.18.34.81 1.33 1.74 2.15 1.19 1.06 2.19 1.39 2.5 1.55.31.16.49.13.67-.08.18-.22.77-.9.98-1.22.21-.32.42-.27.71-.16.29.11 1.85.87 2.17 1.03.32.16.53.24.61.38.08.14.08.81-.18 1.5z"/>
        </svg>
      </a>
    </>
  );
};
