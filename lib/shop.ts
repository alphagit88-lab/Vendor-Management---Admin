import { API_URL } from './config';

export type HardwareProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  isActive?: boolean;
  sortOrder?: number;
};

export type CartLineItem = {
  productId: number;
  quantity: number;
};

export function getProductGalleryImages(featuredImage: string, images: string[]): string[] {
  if (!featuredImage) return images;
  const rest = images.filter((img) => img !== featuredImage);
  return [featuredImage, ...rest];
}

export type ValidatedCart = {
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  total: number;
};

export type ShopOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZip?: string | null;
  shippingCountry?: string | null;
  status: string;
  subtotal: number;
  totalAmount: number;
  currency: string;
  paidAt: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export async function fetchPublicProducts(): Promise<HardwareProduct[]> {
  const res = await fetch(`${API_URL}/hardware-products/public`, { cache: 'no-store' });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load products');
  return data.data;
}

export async function fetchProductBySlug(slug: string): Promise<HardwareProduct | null> {
  const res = await fetch(`${API_URL}/hardware-products/public/${slug}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load product');
  return data.data;
}

export async function validateCart(items: CartLineItem[]): Promise<ValidatedCart> {
  const res = await fetch(`${API_URL}/shop/cart/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Cart validation failed');
  return data.data;
}

export async function createCheckoutSession(payload: {
  items: CartLineItem[];
  customer: {
    name: string;
    email: string;
    phone?: string;
    shippingAddress?: string;
    shippingAddressLine1?: string;
    shippingAddressLine2?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingZip?: string;
    shippingCountry?: string;
  };
}): Promise<{ clientSecret: string; orderId: number; orderNumber: string; sessionId: string }> {
  const res = await fetch(`${API_URL}/shop/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Checkout failed');
  return data.data;
}

export async function verifyCheckoutSession(sessionId: string): Promise<{
  order: ShopOrder;
  paymentStatus: string;
}> {
  const res = await fetch(`${API_URL}/shop/orders/verify?session_id=${encodeURIComponent(sessionId)}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Unable to verify payment');
  return data.data;
}
