'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScanLine, Printer, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { MediaImage } from '@/components/MediaImage';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Shop', href: '/shop' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Support & Contact', href: '/#contact' },
];

export const LandingHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!cartOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartOpen]);

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-24">
          <Link href="/#home" className="flex min-w-0 items-center h-full" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="Vendor Management logo"
              width={160}
              height={80}
              priority
              className="h-full w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-black transition hover:bg-[var(--landing-accent-soft)] hover:text-[var(--landing-brand-strong)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative" ref={cartRef}>
              <button
                type="button"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--landing-brand-strong)] shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:bg-[var(--landing-accent-soft)]"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {totalItems}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--landing-accent)] text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl bg-white shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-[var(--landing-brand-strong)]">Your Cart</h3>
                  </div>
                  {cart.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      Your cart is empty
                    </div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto p-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                              <MediaImage
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--landing-brand-strong)]">{item.name}</p>
                              <p className="text-xs text-[var(--landing-muted)]">${item.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-[var(--landing-brand-strong)]">Total</span>
                          <span className="font-bold text-[var(--landing-accent)]">${totalPrice.toFixed(2)}</span>
                        </div>
                        <Link
                          href="/cart"
                          className="block w-full text-center rounded-full bg-[var(--landing-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(200,108,73,0.25)] transition hover:bg-[var(--landing-accent)]/90"
                          onClick={() => setCartOpen(false)}
                        >
                          View Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.34)]"
            >
              Login
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/cart" className="relative inline-flex items-center justify-center rounded-full bg-white p-2 text-[var(--landing-brand-strong)] shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--landing-accent)] text-[8px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white text-[var(--landing-brand-strong)] shadow-sm"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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