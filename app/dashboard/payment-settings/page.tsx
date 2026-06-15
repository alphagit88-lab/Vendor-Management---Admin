"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, ArrowRight, Check, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';
import {
  fetchSubscriptionStatus,
  requestPlanChange,
  type SubscriptionPlan,
} from '@/lib/subscriptions';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const cardElementOptions = {
  style: {
    base: {
      color: '#112033',
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
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

function PaymentSettingsPageInner() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [paidPlanIds, setPaidPlanIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<{ clientSecret: string; sessionId: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansRes, status] = await Promise.all([
        fetch(`${API_URL}/subscription-plans/public`).then((r) => r.json()),
        fetchSubscriptionStatus(),
      ]);

      if (plansRes.success) {
        setPlans(plansRes.data);
      }

      setCurrentPlanId(status.currentPlanId);
      setCurrentPlan(status.subscriptionPlan);
      setPaidPlanIds(status.paidPlanIds);
      setSelectedPlan(status.currentPlanId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
    setMessage(null);
    setError(null);
    setPaymentState(null);
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const needsPayment =
    selectedPlan !== null &&
    selectedPlan !== currentPlanId &&
    selectedPlanData &&
    Number(selectedPlanData.price) > 0 &&
    !paidPlanIds.includes(selectedPlan);

  const handleConfirmChange = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const result = await requestPlanChange(selectedPlan);

      if (result.action === 'checkout' && result.clientSecret) {
        setPaymentState({
          clientSecret: result.clientSecret,
          sessionId: result.sessionId || '',
        });
        return;
      }

      setMessage(result.message || 'Plan updated successfully.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Plan change failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements || !paymentState) return;
    setPaying(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card input element not found');

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        paymentState.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        router.push(`/dashboard/payment-settings/success?session_id=${paymentIntent.id}`);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Payment & Subscription</h1>
        <p className="text-slate-500 font-medium">
          One-time subscription purchase. Plans are assigned after successful card payment.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Current Plan</p>
            <h3 className="text-3xl font-black tracking-tight mb-2">{currentPlan?.name || 'No plan assigned'}</h3>
            <p className="text-indigo-100 text-sm font-medium">{currentPlan?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black">
              ${Number(currentPlan?.price || 0).toFixed(2)}
            </div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide">one-time</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment via Stripe</h2>
        </div>
        <div className="p-8 text-sm text-slate-600 leading-relaxed">
          Subscription payments are processed securely by Stripe as a <strong>one-time purchase</strong>.
          If you have already paid for a plan, you can switch back to it without paying again.
          Selecting a new paid plan will allow you to complete payment using secure inline Card fields.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Change Subscription Plan</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isCurrent = plan.id === currentPlanId;
              const alreadyPaid = paidPlanIds.includes(plan.id);
              return (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`relative rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Current
                    </div>
                  )}
                  {alreadyPaid && !isCurrent && (
                    <div className="absolute -top-3 right-6 bg-blue-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Paid
                    </div>
                  )}
                  {plan.is_popular && (
                    <div className="absolute -top-3 right-6 bg-amber-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{plan.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      ${Number(plan.price).toFixed(2)}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mt-1">one-time</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {(plan.product_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Products:</strong> Up to {plan.product_limit}</span>
                      </li>
                    )}
                    {(plan.sales_person_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Sales staff:</strong> Up to {plan.sales_person_limit}</span>
                      </li>
                    )}
                  </ul>
                  <div className="flex items-center justify-center">
                    {isSelected ? (
                      <div className="flex items-center gap-2 text-indigo-700 font-black text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Selected
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm font-semibold">Select Plan</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedPlan !== null && selectedPlan !== currentPlanId && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-2 h-fit">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-amber-900 font-black text-sm uppercase tracking-tight mb-2">
                  {needsPayment ? 'Payment Required' : 'Ready to Change Plan'}
                </h4>
                <p className="text-amber-700 text-sm font-medium leading-relaxed mb-4">
                  {needsPayment
                    ? `Please enter your credit card information below to pay $${Number(selectedPlanData?.price || 0).toFixed(2)} for the ${selectedPlanData?.name} plan.`
                    : paidPlanIds.includes(selectedPlan!)
                      ? 'You have already paid for this plan. Confirm to switch without additional payment.'
                      : 'This is a free plan. Confirm to assign it immediately.'}
                </p>

                {needsPayment && paymentState && (
                  <div className="mt-4 border-t border-amber-200 pt-4 space-y-4">
                    <label className="block text-sm font-semibold text-slate-800">Card Information</label>
                    <div className="w-full max-w-md rounded-xl border border-gray-300 px-4 py-3 bg-white focus-within:border-indigo-600 transition-colors">
                      <CardElement options={cardElementOptions} />
                    </div>
                    <button
                      onClick={handleStripePayment}
                      disabled={paying || !stripe}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-200 shadow-lg"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Paying...
                        </>
                      ) : (
                        <>
                          <span>Securely Pay ${Number(selectedPlanData?.price || 0).toFixed(2)}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {(!needsPayment || !paymentState) && (
                  <button
                    onClick={handleConfirmChange}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-200 shadow-lg shadow-indigo-200"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {needsPayment ? 'Initiate Payment' : 'Confirm Plan Change'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSettingsPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentSettingsPageInner />
    </Elements>
  );
}
