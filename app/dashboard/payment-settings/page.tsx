"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Loader2, ShieldCheck, Calendar, ArrowRight, Check } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  // Mock subscription data
  const mockSubscription = {
    planId: 2,
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };

  // Mock card info
  const mockCardInfo = {
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2028',
    cardholderName: 'John Doe',
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/subscription-plans/public`);
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
        setSelectedPlan(mockSubscription.planId);
        setCurrentPlan(data.data.find((p: any) => p.id === mockSubscription.planId));
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handleConfirmChange = () => {
    alert('Subscription change UI only - backend implementation not done yet!');
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
        <p className="text-slate-500 font-medium">Manage your subscription plan and payment methods.</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Current Plan</p>
            <h3 className="text-3xl font-black tracking-tight mb-2">{currentPlan?.name}</h3>
            <p className="text-indigo-100 text-sm font-medium">{currentPlan?.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-200" />
                <span className="text-sm font-semibold">Next billing: {mockSubscription.nextBillingDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black">
              ${Number(currentPlan?.price || 0).toFixed(2)}
            </div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide">per period</p>
          </div>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment Method</h2>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-black uppercase tracking-wide transition-colors">
            Update Card
          </button>
        </div>
        <div className="p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white max-w-md shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cardholder</span>
                <span className="text-lg font-semibold tracking-wide">{mockCardInfo.cardholderName}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Expires</span>
                <div className="text-lg font-semibold">{mockCardInfo.expiryMonth}/{mockCardInfo.expiryYear.slice(-2)}</div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Card Number</span>
                <span className="text-2xl font-mono tracking-[0.3em]">•••• •••• •••• {mockCardInfo.last4}</span>
              </div>
              <div className="text-3xl font-black italic">
                {mockCardInfo.brand}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Section */}
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
              const isCurrent = plan.id === mockSubscription.planId;
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
                  </div>
                  <ul className="space-y-3 mb-6">
                    {(plan.customer_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Customers:</strong> Up to {plan.customer_limit}</span>
                      </li>
                    )}
                    {(plan.product_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Products:</strong> Up to {plan.product_limit}</span>
                      </li>
                    )}
                    {(plan.van_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Vans:</strong> Up to {plan.van_limit}</span>
                      </li>
                    )}
                    {(plan.warehouse_limit ?? 0) > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><strong>Warehouses:</strong> Up to {plan.warehouse_limit}</span>
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
          {selectedPlan !== mockSubscription.planId && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-start gap-4 mb-6">
              <div className="bg-amber-100 rounded-full p-2 h-fit">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-amber-900 font-black text-sm uppercase tracking-tight mb-2">Ready to Change Plans</h4>
                <p className="text-amber-700 text-sm font-medium leading-relaxed mb-4">
                  You've selected a new plan. Review your choice and confirm to proceed.
                </p>
                <button
                  onClick={handleConfirmChange}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98]"
                >
                  Confirm Plan Change
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
