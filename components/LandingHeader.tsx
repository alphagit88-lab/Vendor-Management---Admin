'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScanLine, Printer, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Hardware Shop', href: '/#hardware-shop' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Support & Contact', href: '/#contact' },
];

export const LandingHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[var(--landing-brand-strong)] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/80">
            <ScanLine className="h-4 w-4 text-[var(--landing-highlight)]" />
            Real-time route invoicing for delivery teams
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/88 backdrop-blur md:flex">
            <Printer className="h-4 w-4 text-[var(--landing-accent)]" />
            On-site print ready
          </div>
        </div>
      </div>

      <div className="border-b border-black/5 bg-[rgba(255,250,244,0.92)] shadow-[0_12px_36px_rgba(16,32,51,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/#home" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <div className="relative h-12 w-32 shrink-0 overflow-hidden rounded-md border border-black/5 bg-white shadow-sm">
              <Image
                src="/lgon.jpeg"
                alt="Vendor Management logo"
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-[family:var(--font-space-grotesk)] text-xl font-bold tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                SuperVendor
              </p>
              <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-muted)]">
                Scan. Sync. Print.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--landing-muted)] transition hover:bg-[var(--landing-accent-soft)] hover:text-[var(--landing-brand-strong)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(200,108,73,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(200,108,73,0.34)]"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white text-[var(--landing-brand-strong)] shadow-sm lg:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/6 bg-[var(--landing-surface)] lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--landing-brand-strong)] transition hover:bg-[var(--landing-surface-strong)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--landing-accent)] px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
};
