'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 mx-auto mb-6 text-amber-600" />
        <h1 className="text-3xl font-black text-slate-900 mb-3">Payment Cancelled</h1>
        <p className="text-slate-600 mb-8">
          Your subscription payment was not completed. No plan change was made.
        </p>
        <Link
          href="/dashboard/payment-settings"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700"
        >
          Back to Payment Settings
        </Link>
      </div>
    </div>
  );
}
