'use client';

import type { CSSProperties } from 'react';
import { startTransition, useEffect, useEffectEvent, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { API_URL } from '@/lib/config';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Printer,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Waypoints,
  Zap
} from 'lucide-react';
import image1 from '@/src/1.jpeg';
import image2 from '@/src/2.jpeg';
import image3 from '@/src/3.jpeg';
import image3Old from '@/src/3_old.jpeg';
import image4 from '@/src/4.jpeg';
import image5 from '@/src/5.jpeg';
import image6 from '@/src/6.jpeg';
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

const heroSlides: Array<{
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  spotlight: string;
  ctaText: string;
}> = [
    {
      eyebrow: 'Mobility & Power',
      title: 'Your Delivery Business, Fully Mobile',
      description:
        'Super Vendor is built for small vendors who need powerful tools on the go. Manage your routes, track products, and service your clients seamlessly from the palm of your hand.',
      image: image1,
      alt: 'Delivery driver beside a stocked vehicle holding a portable invoice printer.',
      spotlight: 'Portable printing at the curb',
      ctaText: 'Get Started',
    },
    {
      eyebrow: 'Handheld Invoicing',
      title: 'Print Invoices Right at the Location',
      description:
        'Close the deal instantly. Generate and print professional, accurate invoices directly from your handheld device and mobile printer before you even walk out the door.',
      image: image6,
      alt: 'Portable invoice printer producing printed receipts beside a stack of invoices.',
      spotlight: 'Print at the stop',
      ctaText: 'See How It Works',
    },
    {
      eyebrow: 'Inventory Management',
      title: 'Total Inventory Control on the Road',
      description:
        'Know exactly what’s on your truck at all times. Track your stock levels in real-time as you deliver to local businesses, ensuring complete accuracy at every stop.',
      image: image5,
      alt: 'Delivery team unloading a vehicle while another worker updates stock from a handheld device.',
      spotlight: 'One system for every stop',
      ctaText: 'Explore Features',
    },
  ];

const proofTags = [
  'Scan fast',
  'Sync live',
  'Print instantly',
];

const overviewChecks = [
  'Scan products as soon as they leave the vehicle.',
  'Keep store and delivery data updated live.',
  'Print invoices on-site in seconds.',
  'Reduce mistakes and save time.',
];

const statCards = [
  {
    value: '03',
    label: 'Core actions',
    description: 'Scan stock, sync records, and print invoices in one route-ready loop.',
    icon: ScanLine,
  },
  {
    value: '06',
    label: 'Field touchpoints',
    description: 'From loading the vehicle to shelf refill, every stop stays visible and connected.',
    icon: Waypoints,
  },
  {
    value: '01',
    label: 'One simple system',
    description: 'Drivers and stores stay on the same page.',
    icon: Printer,
  },
];

const reasons = [
  {
    title: 'Scan once at the stop',
    description: 'Capture items and quantities right away.',
  },
  {
    title: 'Sync in real time',
    description: 'Updates appear instantly without extra typing.',
  },
  {
    title: 'Print before pulling away',
    description: 'Give the customer an invoice before the driver leaves.',
  },
];

const hardwareProducts = [
  {
    id: 1,
    name: 'Zebra ZD420 Thermal Printer',
    description: 'High-performance direct thermal printer for labels and receipts',
    price: 299.99,
    image: '/landing/pos-planning.jpg'
  },
  {
    id: 2,
    name: 'Honeywell Voyager 1470g Scanner',
    description: 'Handheld barcode scanner with USB connectivity',
    price: 149.99,
    image: '/landing/warehouse-worker.jpg'
  },
  {
    id: 3,
    name: 'Star Micronics TSP143III Printer',
    description: 'Receipt printer with Auto-Cutter and USB interface',
    price: 249.99,
    image: '/landing/tablet-warehouse.jpg'
  },
  {
    id: 4,
    name: 'Epson TM-T88VII Thermal Printer',
    description: 'Industry-standard high-speed receipt printer',
    price: 349.99,
    image: '/landing/mobile-credibility.jpg'
  },
  {
    id: 5,
    name: 'Socket Mobile DuraScan Scanner',
    description: 'Wireless Bluetooth barcode scanner',
    price: 199.99,
    image: '/landing/forklift-operations.jpg'
  },
];

const serviceCards = [
  {
    eyebrow: '1. The Setup',
    title: 'Simple & Mobile',
    description: 'Everything you need to run your route fits in the palm of your hand.',
    image: image5,
    alt: 'Delivery team unloading a vehicle and using handheld devices.',
    featured: false,
    bullets: [
      {
        label: 'Subscribe & Log In',
        text: 'Sign up for our service and log in using any mobile device with an internet connection.',
      },
      {
        label: 'Mobile Printing',
        text: 'Pair your device with a standard 3-inch mobile receipt printer. You can use your existing compatible printer, or purchase one directly from us to guarantee seamless integration.',
      },
    ],
  },
  {
    eyebrow: '2. Inventory',
    title: 'Smart Inventory Control',
    description: 'Never guess what is on the truck again. Super Vendor gives you total visibility over your stock.',
    image: image3Old,
    alt: 'Driver organizing snacks and supplies inside a convenience store aisle.',
    featured: false,
    bullets: [
      {
        label: 'Warehouse-to-Van Tracking',
        text: 'Digitally transfer inventory from your main warehouse directly to your delivery vans.',
      },
      {
        label: 'Driver Visibility',
        text: 'Delivery drivers know exactly how many items they have on hand at all times, right from their device.',
      },
      {
        label: 'Set Par Levels',
        text: 'Establish minimum stock requirements so you always know when it is time to reorder or restock your vehicles.',
      },
    ],
  },
  {
    eyebrow: '3. Customers',
    title: 'Customer & Pricing Management',
    description: 'Tailor your service to fit your best clients and largest accounts.',
    image: image2,
    alt: 'Two team members reviewing boxes and invoice paperwork inside a convenience store.',
    featured: false,
    bullets: [
      {
        label: 'Customer Profiles',
        text: 'Manage all your store owners and client details in one easy-to-access place.',
      },
      {
        label: 'Custom Pricing',
        text: 'Set up custom pricing tiers and special discounts for individual customers.',
      },
      {
        label: 'Group Locations',
        text: 'Managing a chain? Group multiple store locations together to apply uniform special pricing across the board.',
      },
    ],
  },
  {
    eyebrow: '4. Delivery',
    title: 'Deliver & Invoice on the Spot',
    description: 'Close out your stops faster and look professional doing it.',
    image: image6,
    alt: 'Portable printer creating a printed invoice.',
    featured: true,
    bullets: [
      {
        label: 'Live Order Adjustments',
        text: 'Add products to the order on the fly right at the delivery location.',
      },
      {
        label: 'Order Check-In Tabs',
        text: 'Print order check-in tabs to help the store quickly verify the delivery.',
      },
      {
        label: 'Instant Mobile Invoices',
        text: 'Print a physical, accurate invoice on your 3-inch mobile printer before you even leave the store.',
      },
      {
        label: 'Email Confirmations',
        text: 'Automatically shoot a digital copy of the invoice straight to the customer’s email for their records.',
      },
    ],
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Static Enterprise Plan
  const staticEnterprisePlan = {
    id: 999,
    name: "Custom Enterprise Solution",
    price: null,
    description: "A fully tailored system for large companies needing absolute independence and limitless capacity.",
    isEnterprise: true,
    features: [
      "Capacity: Unlimited everything",
      "Web Presence: Custom domain and full front-facing website",
      "Experience: Advanced customer features and portals",
      "Infrastructure: Dedicated custom app with your choice of hosting and complete data control"
    ]
  };

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/subscription-plans/public`);
        const data = await res.json();
        if (data.success) {
          setPlans(data.data);
        }
      } catch (err) {
        console.error('Failed to load subscription plans:', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // Combine fetched plans + static enterprise plan as last element
  const allPlans = [...plans, staticEnterprisePlan];

  const advanceSlide = useEffectEvent((direction: 1 | -1 = 1) => {
    startTransition(() => {
      setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
    });
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      advanceSlide(1);
    }, 6500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [plans]);

  const currentSlide = heroSlides[activeSlide];

  return (
    <div
      style={themeVars}
      className={`min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-ink)] ${spaceGrotesk.variable}`}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        [data-reveal] {
          opacity: 0;
          filter: blur(10px);
          transform: translate3d(0, 42px, 0) scale(0.98);
          transition:
            opacity 0.85s ease,
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.85s ease;
          will-change: opacity, transform, filter;
        }

        [data-reveal='left'] {
          transform: translate3d(-52px, 18px, 0) scale(0.98);
        }

        [data-reveal='right'] {
          transform: translate3d(52px, 18px, 0) scale(0.98);
        }

        [data-reveal='zoom'] {
          transform: scale(0.92);
        }

        [data-reveal].is-visible {
          opacity: 1;
          filter: blur(0);
          transform: translate3d(0, 0, 0) scale(1);
        }

        @keyframes heroContent {
          from {
            opacity: 0;
            transform: translate3d(0, 34px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .hero-copy {
          animation: heroContent 0.72s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          [data-reveal] {
            opacity: 1;
            filter: none;
            transform: none;
            transition: none;
          }

          .hero-copy {
            animation: none;
          }
        }
      `}</style>

      <LandingHeader />

      <main className="pt-[116px]">
        <section id="home" className="relative isolate overflow-hidden scroll-mt-32">
          <div className="relative min-h-[calc(100svh-116px)] bg-[var(--landing-brand-strong)]">
            <div className="absolute inset-0">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`absolute inset-0 transition-opacity duration-[1400ms] ${index === activeSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    placeholder="blur"
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${index === activeSlide ? 'scale-100' : 'scale-[1.08]'
                      }`}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(200,108,73,0.30),transparent_18%),linear-gradient(90deg,rgba(10,17,28,0.94)_0%,rgba(10,17,28,0.80)_44%,rgba(10,17,28,0.36)_74%,rgba(10,17,28,0.58)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(95,158,160,0.16)_0%,transparent_26%,transparent_72%,rgba(10,17,28,0.62)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[36%] bg-[linear-gradient(180deg,rgba(29,65,96,0.18)_0%,rgba(29,65,96,0.02)_100%)]" />

            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 hidden h-[3.75rem] w-[3.75rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-white/16 md:inline-flex"
              onClick={() => advanceSlide(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 hidden h-[3.75rem] w-[3.75rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-white/16 md:inline-flex"
              onClick={() => advanceSlide(1)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid w-full gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                <div className="max-w-3xl">
                  <div key={currentSlide.title} className="hero-copy">
                    <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[var(--landing-accent-soft)]">
                      {currentSlide.eyebrow}
                    </p>
                    <h1 className="mt-6 max-w-[12ch] font-[family:var(--font-space-grotesk)] text-5xl font-bold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.35rem]">
                      {currentSlide.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                      {currentSlide.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.36)]"
                      >
                        {currentSlide.ctaText}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="#overview"
                        className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/14"
                      >
                        Learn More
                      </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      {proofTags.map((tag) => (
                        <div
                          key={tag}
                          className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/82 backdrop-blur-sm"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="ml-auto max-w-md rounded-[2rem] border border-white/12 bg-white/10 p-6 text-white shadow-[0_28px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/58">
                      Why it helps
                    </p>
                    <p className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold leading-tight tracking-[-0.05em] text-white">
                      {currentSlide.spotlight}
                    </p>
                    <div className="mt-5 space-y-3 text-sm leading-7 text-white/76">
                      <div className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--landing-highlight)]" />
                        <span>Less waiting at each stop.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--landing-highlight)]" />
                        <span>Fewer invoice mistakes.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-3 px-4">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-3 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-12 bg-white' : 'w-3 bg-white/35 hover:bg-white/55'
                    }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="relative scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div data-reveal="left" className="relative min-h-[520px] sm:min-h-[620px]">
                <div className="absolute left-0 top-0 w-[62%] overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_30px_80px_rgba(17,32,51,0.10)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={image2}
                      alt="Delivery staff reviewing products and invoice paperwork inside a store."
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 26vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-[60%] overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_30px_80px_rgba(17,32,51,0.12)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={image4}
                      alt="Delivery worker standing beside a vehicle with portable printer and stacked supplies."
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 25vw, 56vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute bottom-[9%] left-[8%] max-w-[16rem] rounded-[1.8rem] border border-[var(--landing-accent-soft)] bg-[var(--landing-surface)] p-5 shadow-[0_20px_50px_rgba(17,32,51,0.08)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-accent)]">
                    Route snapshot
                  </p>
                  <p className="mt-3 font-[family:var(--font-space-grotesk)] text-3xl font-semibold tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                    Live print. Live sync.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">
                    Field teams can confirm, update, and print on-site without losing momentum.
                  </p>
                </div>
              </div>

              <div data-reveal="right">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                  Overview
                </p>
                <h2 className="mt-4 max-w-[13ch] font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                  Simple tools for faster stops.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                  SuperVendor helps drivers scan items, sync updates, and print invoices without slowing down.
                </p>

                <div className="mt-8 grid gap-4">
                  {overviewChecks.map((item, index) => (
                    <div
                      key={item}
                      data-reveal="zoom"
                      style={{ transitionDelay: `${index * 100}ms` }}
                      className="flex items-start gap-4 rounded-[1.7rem] border border-black/6 bg-[rgba(255,250,244,0.85)] px-5 py-4 shadow-[0_16px_44px_rgba(17,32,51,0.05)] backdrop-blur-sm"
                    >
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-[var(--landing-muted)]">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(17,32,51,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-brand-strong)] text-white">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--landing-brand-strong)]">Easy for drivers</p>
                        <p className="text-sm text-[var(--landing-muted)]">Scan, update, confirm.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(17,32,51,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-accent)] text-white">
                        <Printer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--landing-brand-strong)]">Easy for stores</p>
                        <p className="text-sm text-[var(--landing-muted)]">Get the invoice instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--landing-brand)] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-3">
              {statCards.map((card, index) => (
                <article
                  key={card.label}
                  data-reveal="zoom"
                  style={{ transitionDelay: `${index * 110}ms` }}
                  className="rounded-[2rem] border border-white/12 bg-white/5 p-8 shadow-[0_18px_46px_rgba(0,0,0,0.16)] backdrop-blur-sm"
                >
                  <card.icon className="h-8 w-8 text-[var(--landing-accent-soft)]" />
                  <p className="mt-6 font-[family:var(--font-space-grotesk)] text-6xl font-bold tracking-[-0.06em] text-white">
                    {card.value}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">{card.label}</p>
                  <p className="mt-2 max-w-[30ch] text-sm leading-7 text-white/72">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-32 px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center" data-reveal="zoom">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                How It Works
              </p>
              <h2 className="mt-4 font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                How It Works: From Warehouse to Storefront
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                A simple, robust, and connected delivery loop.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map((card, index) => (
                <div
                  key={card.title}
                  data-reveal="zoom"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="relative pt-16"
                >
                  <article className="group relative h-full rounded-[2.2rem] border border-black/6 bg-white px-8 pb-10 pt-20 text-center text-[var(--landing-brand-strong)] shadow-[0_24px_64px_rgba(17,32,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(29,65,96,0.4)] hover:bg-[linear-gradient(180deg,#1d4160_0%,#0d1b2b_100%)] hover:text-white hover:shadow-[0_30px_72px_rgba(13,27,43,0.18)]">
                    <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.2rem] border-4 border-[var(--landing-surface)] bg-white shadow-[0_20px_50px_rgba(17,32,51,0.15)]">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        placeholder="blur"
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    <p
                      className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--landing-accent)] transition-colors duration-300 group-hover:text-white/70"
                    >
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 font-[family:var(--font-space-grotesk)] text-2xl font-bold leading-tight tracking-[-0.05em]">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--landing-muted)] transition-colors duration-300 group-hover:text-white/78">
                      {card.description}
                    </p>
                    <div className="mt-6 space-y-4 text-left border-t border-black/5 pt-5 transition-colors duration-300 group-hover:border-white/10">
                      {card.bullets.map((bullet) => (
                        <div key={bullet.label} className="text-[0.825rem] leading-relaxed">
                          <p className="font-bold text-[var(--landing-brand-strong)] transition-colors duration-300 group-hover:text-white">
                            {bullet.label}
                          </p>
                          <p className="mt-1 text-[0.785rem] text-[var(--landing-muted)] transition-colors duration-300 group-hover:text-white/80">
                            {bullet.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="hardware" className="scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div data-reveal="left" className="relative overflow-hidden rounded-[2.4rem] border border-black/6 bg-white shadow-[0_28px_80px_rgba(17,32,51,0.16)]">
                <div className="relative aspect-square bg-white">
                  <Image
                    src={image3}
                    alt="Three panels showing delivery driver by a van, checking inventory inside the van, and printing an invoice at a store counter."
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div data-reveal="right">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                  Why SuperVendor?
                </p>
                <h2 className="mt-4 max-w-[12ch] font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                  Faster stops. Clearer invoices.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                  It keeps delivery simple from the vehicle to the counter.
                </p>

                <div className="mt-8 space-y-5">
                  {reasons.map((reason, index) => (
                    <div
                      key={reason.title}
                      data-reveal="right"
                      style={{ transitionDelay: `${index * 110}ms` }}
                      className="flex items-start gap-4 rounded-[1.8rem] border border-black/6 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(17,32,51,0.05)]"
                    >
                      <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent)] text-white shadow-[0_14px_32px_rgba(200,108,73,0.22)]">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--landing-brand-strong)]">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.9rem] border border-[var(--landing-accent-soft)] bg-[var(--landing-surface)] p-6 shadow-[0_18px_42px_rgba(17,32,51,0.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--landing-brand-strong)] text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--landing-brand-strong)]">Built to stay simple</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--landing-muted)]">
                        Drivers, stores, and invoices stay connected in one simple flow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="hardware-shop" className="scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24 bg-[var(--landing-bg)]">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center" data-reveal="zoom">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                Hardware Shop
              </p>
              <h2 className="mt-4 font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                Professional Equipment for Your Business
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                Get everything you need to run your operations smoothly — from printers to scanners, all in one place.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hardwareProducts.map((product, index) => (
                <article
                  key={product.id}
                  data-reveal="zoom"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="group relative overflow-hidden rounded-[2.2rem] border border-black/6 bg-white shadow-[0_24px_64px_rgba(17,32,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(29,65,96,0.3)] hover:shadow-[0_32px_72px_rgba(17,32,51,0.12)]"
                >
                  <div className="relative h-64 bg-[var(--landing-surface)] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 3}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-[var(--landing-accent)] text-white text-[0.65rem] font-bold uppercase tracking-wider rounded-full">
                        New
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="text-lg font-bold font-[family:var(--font-space-grotesk)] text-[var(--landing-brand-strong)]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--landing-muted)]">
                      {product.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-3xl font-bold font-[family:var(--font-space-grotesk)] tracking-[-0.05em] text-[var(--landing-brand-strong)]">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-[var(--landing-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(200,108,73,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--landing-accent)]/90 hover:shadow-[0_20px_40px_rgba(200,108,73,0.30)]"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24 bg-gradient-to-br from-[var(--landing-surface)] via-[var(--landing-surface-strong)] to-[var(--landing-bg)]">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center" data-reveal="zoom">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                Pricing Plans
              </p>
              <h2 className="mt-4 font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[1.1] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                Find the Right Plan for Your Operations
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                We offer three tailored solutions: two specialized software packages for small and growing vendors, plus a custom enterprise option for large companies needing absolute independence and limitless capacity.
              </p>
              <p className="mt-4 text-sm text-[var(--landing-accent)] font-semibold">
                If you can't select from our available packages below, please contact us for more information on a tailored solution.
              </p>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 max-w-6xl mx-auto items-stretch">
              {loadingPlans ? (
                // Loading placeholders
                [1, 2, 3].map(i => (
                  <div 
                    key={i}
                    data-reveal="zoom"
                    className="relative w-full md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.75rem)] max-w-sm rounded-[2.2rem] border p-8 border-black/6 bg-white/80 backdrop-blur-sm shadow-[0_24px_64px_rgba(17,32,51,0.08)] overflow-hidden animate-pulse"
                  >
                    <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded-md mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded-md mb-8"></div>
                    <div className="space-y-4">
                      {[1,2,3,4].map(j => (
                        <div key={j} className="h-5 bg-gray-200 rounded-md"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded-full mt-8"></div>
                  </div>
                ))
              ) : (
                allPlans.map((plan, index) => {
                  const isPopular = plan.is_popular || false;
                  const isEnterprise = plan.isEnterprise || false;
                  const price = plan.price;
                  
                  return (
                    <div 
                      key={plan.id} 
                      data-reveal="zoom"
                      className={`relative w-full md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.75rem)] max-w-sm rounded-[2.2rem] border p-8 shadow-[0_24px_64px_rgba(17,32,51,0.08)] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                        isPopular 
                          ? 'border-[var(--landing-accent)] bg-[var(--landing-brand-strong)] text-white' 
                          : 'border-black/6 bg-white/80 backdrop-blur-sm'
                      }`}
                    >
                    {isPopular && (
                      <div className="absolute right-0 top-0 bg-[var(--landing-accent)] text-white text-[0.65rem] font-bold uppercase tracking-wider px-5 py-2 rounded-bl-2xl">
                        Popular
                      </div>
                    )}
                    
                    <div>
                      <h3 className={`text-2xl font-bold font-[family:var(--font-space-grotesk)] ${
                        isPopular ? 'text-white' : 'text-[var(--landing-brand-strong)]'
                      }`}>{plan.name}</h3>
                      
                      {plan.description && (
                        <p className={`mt-4 text-sm min-h-[48px] ${
                          isPopular ? 'text-white/80' : 'text-[var(--landing-muted)]'
                        }`}>
                          {plan.description}
                        </p>
                      )}
                      
                      <p className="mt-6">
                        {price !== null ? (
                          <>
                            <span className={`text-5xl font-bold tracking-tight font-[family:var(--font-space-grotesk)] ${
                              isPopular ? 'text-white' : 'text-[var(--landing-brand-strong)]'
                            }`}>
                              ${Number(price).toFixed(2)}
                            </span>
                            {/*<span className={`text-sm font-semibold ${
                              isPopular ? 'text-white/60' : 'text-[var(--landing-muted)]'
                            }`}>/month</span>*/}
                          </>
                        ) : (
                          <span className={`text-2xl font-bold tracking-tight font-[family:var(--font-space-grotesk)] ${
                            isPopular ? 'text-white' : 'text-[var(--landing-brand-strong)]'
                          }`}>
                            Contact Us for Pricing
                          </span>
                        )}
                      </p>
                      
                      <ul className={`mt-8 space-y-4 text-sm ${
                        isPopular ? 'text-white/90' : 'text-[var(--landing-brand-strong)]'
                      }`}>
                        {isEnterprise ? (
                          plan.features?.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className={`h-4 w-4 shrink-0 mt-1 ${
                                isPopular ? 'text-[var(--landing-accent)]' : 'text-[var(--landing-highlight)]'
                              }`} />
                              <span>{feature}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            {(plan.customer_limit ?? 0) > 0 && (
                              <li className="flex items-start gap-3">
                                <Check className={`h-4 w-4 shrink-0 mt-1 ${
                                  isPopular ? 'text-[var(--landing-accent)]' : 'text-[var(--landing-highlight)]'
                                }`} />
                                <span><strong>Customers:</strong> Up to {plan.customer_limit} customers</span>
                              </li>
                            )}
                            {(plan.product_limit ?? 0) > 0 && (
                              <li className="flex items-start gap-3">
                                <Check className={`h-4 w-4 shrink-0 mt-1 ${
                                  isPopular ? 'text-[var(--landing-accent)]' : 'text-[var(--landing-highlight)]'
                                }`} />
                                <span><strong>Products:</strong> Up to {plan.product_limit} products</span>
                              </li>
                            )}
                            {(plan.van_limit ?? 0) > 0 && (
                              <li className="flex items-start gap-3">
                                <Check className={`h-4 w-4 shrink-0 mt-1 ${
                                  isPopular ? 'text-[var(--landing-accent)]' : 'text-[var(--landing-highlight)]'
                                }`} />
                                <span><strong>Vans:</strong> Manage up to {plan.van_limit} delivery vans</span>
                              </li>
                            )}
                            {(plan.warehouse_limit ?? 0) > 0 && (
                              <li className="flex items-start gap-3">
                                <Check className={`h-4 w-4 shrink-0 mt-1 ${
                                  isPopular ? 'text-[var(--landing-accent)]' : 'text-[var(--landing-highlight)]'
                                }`} />
                                <span><strong>Warehouses:</strong> Up to {plan.warehouse_limit} warehouse locations</span>
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="mt-8">
                      <Link
                        href={price !== null ? `/login?plan=${plan.id}` : 'https://wa.me/94715356485?text=Hello,%0ACan%20we%20discuss%20a%20custom%20pricing%20plan%20for%20our%20needs?'}
                        target="_blank"
                        className={`w-full inline-flex items-center justify-center rounded-full py-3.5 text-sm font-semibold transition ${
                          isPopular 
                            ? 'bg-[var(--landing-accent)] text-white shadow-lg hover:bg-[var(--landing-accent)]/90' 
                            : 'border border-black/10 bg-white/50 text-[var(--landing-brand-strong)] hover:bg-[var(--landing-accent-soft)]'
                        }`}
                      >
                        {price !== null ? 'Get Started' : 'Contact Us'}
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div data-reveal="left">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--landing-accent)]">
                  Get in Touch
                </p>
                <h2 className="mt-4 font-[family:var(--font-space-grotesk)] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--landing-brand-strong)] sm:text-5xl">
                  Support & Contact
                </h2>
                <p className="mt-6 text-lg leading-8 text-[var(--landing-muted)]">
                  Have questions about setting up your portable printer or syncing your routes? Our dedicated support team is here to keep your business moving.
                </p>

                <div className="mt-8 space-y-6 text-sm text-[var(--landing-brand-strong)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <a href="mailto:support@supervendor.io" className="text-[var(--landing-accent)] hover:underline">support@supervendor.io</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Call Support</p>
                      <p className="text-[var(--landing-muted)]">+1 (800) 555-0199</p>
                    </div>
                  </div>
                </div>
              </div>

              <div data-reveal="right" className="rounded-[2.2rem] border border-black/6 bg-white p-8 shadow-[0_24px_64px_rgba(17,32,51,0.08)]">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--landing-brand-strong)] mb-2">Name</label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[var(--landing-accent)] focus:outline-none bg-[var(--landing-bg)]/20"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--landing-brand-strong)] mb-2">Email</label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[var(--landing-accent)] focus:outline-none bg-[var(--landing-bg)]/20"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-[var(--landing-brand-strong)] mb-2">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[var(--landing-accent)] focus:outline-none bg-[var(--landing-bg)]/20"
                      placeholder="Tell us about your fleet..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-full bg-[var(--landing-accent)] py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(200,108,73,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(200,108,73,0.30)]"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
