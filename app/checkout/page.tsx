'use client';

import type { CSSProperties, FormEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';
import { createCheckoutSession, validateCart } from '@/lib/shop';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const cardElementOptions = {
  style: {
    base: {
      color: '#112033',
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

function CheckoutForm({
  validatedTotal,
  validatedItems,
  error,
  setError,
}: {
  validatedTotal: number | null;
  validatedItems: Array<{ name: string; quantity: number; lineTotal: number }>;
  error: string | null;
  setError: (err: string | null) => void;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartLineItems } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'United States',
  });
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('United States');
  const countryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryContainerRef.current && !countryContainerRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await createCheckoutSession({
        items: cartLineItems,
        customer: form,
      });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Payment input fields not found');
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        result.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: form.name,
              email: form.email,
              phone: form.phone || undefined,
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        router.push(`/checkout/success?session_id=${paymentIntent.id}`);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setSubmitting(false);
    }
  };

  return (
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
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[var(--landing-brand-strong)]">Shipping Address</label>
          <input
            required
            placeholder="123 ShipBob Street"
            value={form.shippingAddressLine1}
            onChange={(e) => setForm({ ...form, shippingAddressLine1: e.target.value })}
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
          />
          <input
            placeholder="Additional Street Field"
            value={form.shippingAddressLine2}
            onChange={(e) => setForm({ ...form, shippingAddressLine2: e.target.value })}
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="e.g. Chicago"
              value={form.shippingCity}
              onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
            />
            <input
              required
              placeholder="60612"
              value={form.shippingZip}
              onChange={(e) => setForm({ ...form, shippingZip: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
            />
          </div>
          <input
            placeholder="State"
            value={form.shippingState}
            onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
          />
          
          <div ref={countryContainerRef} className="relative">
            <input
              required
              placeholder="Country"
              value={form.shippingCountry}
              onFocus={() => {
                setShowCountryDropdown(true);
                setCountrySearch(form.shippingCountry);
              }}
              onChange={(e) => {
                setForm({ ...form, shippingCountry: e.target.value });
                setCountrySearch(e.target.value);
                setShowCountryDropdown(true);
              }}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--landing-accent)]"
            />
            {showCountryDropdown && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg">
                {COUNTRIES.filter((country) =>
                  country.toLowerCase().includes(countrySearch.toLowerCase())
                ).map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, shippingCountry: country });
                      setShowCountryDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--landing-accent-soft)]/20 text-[var(--landing-ink)] transition-colors"
                  >
                    {country}
                  </button>
                ))}
                {COUNTRIES.filter((country) =>
                  country.toLowerCase().includes(countrySearch.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-2.5 text-sm text-[var(--landing-muted)]">
                    No country found. Type to use custom value.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-black/5 pt-5">
          <label className="block text-sm font-semibold text-[var(--landing-brand-strong)] mb-3">Card Information</label>
          <div className="w-full rounded-xl border border-black/10 px-4 py-3.5 bg-[var(--landing-surface)] focus-within:border-[var(--landing-accent)] transition-colors">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || validatedTotal === null || !stripe}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 font-[family:var(--font-space-grotesk)]"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          {submitting ? 'Confirming Payment...' : `Secure Pay $${(validatedTotal ?? 0).toFixed(2)}`}
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
          Prices and stock are verified on our servers before payment. Card information is processed securely by Stripe elements.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartLineItems, isReady } = useCart();
  const [validatedTotal, setValidatedTotal] = useState<number | null>(null);
  const [validatedItems, setValidatedItems] = useState<Array<{ name: string; quantity: number; lineTotal: number }>>([]);
  const [error, setError] = useState<string | null>(null);

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
            Enter your details below. Payment is securely processed using inline Stripe Card elements.
          </p>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              validatedTotal={validatedTotal}
              validatedItems={validatedItems}
              error={error}
              setError={setError}
            />
          </Elements>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
