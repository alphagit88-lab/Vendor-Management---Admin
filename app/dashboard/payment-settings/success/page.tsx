'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { verifySubscriptionCheckout } from '@/lib/subscriptions';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [planName, setPlanName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing payment session.');
      return;
    }

    verifySubscriptionCheckout(sessionId)
      .then((data) => {
        setPlanName(data.subscriptionPlan?.name || data.purchase?.planName || null);
      })
      .catch((err) => setError(err.message || 'Unable to verify payment'));
  }, [sessionId]);

  if (error) {
    return (
      <div className="text-center max-w-md mx-auto">
        <p className="text-red-600 mb-6">{error}</p>
        <Link href="/dashboard/payment-settings" className="text-indigo-600 font-semibold hover:underline">
          Back to Payment Settings
        </Link>
      </div>
    );
  }

  if (!planName) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Confirming your subscription payment...
      </div>
    );
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-600" />
      <h1 className="text-3xl font-black text-slate-900 mb-3">Subscription Activated</h1>
      <p className="text-slate-600 mb-2">
        Your payment was successful and <strong>{planName}</strong> is now your active plan.
      </p>
      <p className="text-sm text-slate-500 mb-8">This is a one-time subscription purchase.</p>
      <button
        onClick={() => router.push('/dashboard/payment-settings')}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700"
      >
        Back to Payment Settings
      </button>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Suspense fallback={<p className="text-slate-500">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
