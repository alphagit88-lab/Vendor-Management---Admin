import { API_URL } from './config';

export type SubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  description?: string;
  product_limit?: number;
  sales_person_limit?: number;
  customer_limit?: number;
  van_limit?: number;
  warehouse_limit?: number;
  is_popular?: boolean;
};

export type SubscriptionStatus = {
  currentPlanId: number | null;
  subscriptionPlan: SubscriptionPlan | null;
  paidPlanIds: number[];
  purchases: Array<{
    id: number;
    subscriptionPlanId: number;
    planName: string;
    amount: number;
    status: string;
    paidAt: string | null;
    createdAt: string;
  }>;
};

export type PlanChangeResult = {
  action: 'already_assigned' | 'assigned' | 'checkout';
  message?: string;
  planId?: number;
  clientSecret?: string;
  sessionId?: string;
  purchaseId?: number;
  amount?: number;
};

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const res = await fetch(`${API_URL}/subscriptions/status`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load subscription status');
  return data.data;
}

export async function requestPlanChange(planId: number): Promise<PlanChangeResult> {
  const res = await fetch(`${API_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ planId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Plan change failed');
  return data.data;
}

export async function verifySubscriptionCheckout(sessionId: string) {
  const res = await fetch(
    `${API_URL}/subscriptions/verify?session_id=${encodeURIComponent(sessionId)}`,
    { headers: authHeaders(), cache: 'no-store' }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Unable to verify payment');
  return data.data;
}
