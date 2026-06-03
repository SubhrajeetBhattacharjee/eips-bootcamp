'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { CreditCard, CheckCircle2, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams?.get('moduleId');

  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id || !moduleId) return;

    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/bootcamp/modules?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const target = data.find((m: any) => m.id === moduleId);
          if (target) {
            setModuleData(target);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [user?.id, moduleId]);

  const handleCheckout = async () => {
    if (!user?.id || !moduleId) return;
    setProcessing(true);
    
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch(`/api/bootcamp/modules/${moduleId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert('Failed to subscribe. You might already be subscribed.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred during checkout.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      </DashboardShell>
    );
  }

  if (!moduleData) {
    return (
      <DashboardShell>
        <div className="p-8 text-center">Module not found.</div>
      </DashboardShell>
    );
  }

  if (success) {
    return (
      <DashboardShell>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-zinc-400 max-w-md text-center mb-8">
            You have successfully subscribed to <strong>{moduleData.title}</strong>. You can now access all lessons and resources.
          </p>
          <button
            onClick={() => router.push(`/dashboard/my-modules?moduleId=${moduleId}`)}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] transform hover:scale-[1.02]"
          >
            Go to My Modules
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-8">
          <ShoppingCart size={16} />
          SECURE CHECKOUT
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            {moduleData.thumbnailUrl && (
              <div className="w-full h-40 mb-6 rounded-xl overflow-hidden bg-black border border-white/5">
                <img src={moduleData.thumbnailUrl} alt={moduleData.title} className="w-full h-full object-cover opacity-80" />
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">{moduleData.title}</h3>
              <p className="text-sm text-zinc-400">{moduleData.description}</p>
            </div>
            
            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Category</span>
                <span className="text-white">{moduleData.category || 'General'}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Lessons</span>
                <span className="text-white">{moduleData.lessons}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Price</span>
                <span className="text-white font-medium">${moduleData.price || 0}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-6 pt-6 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-black text-emerald-400">${moduleData.price || 0}</span>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
            
            {(!moduleData.price || moduleData.price === 0) ? (
              <>
                <p className="text-zinc-400 mb-6 text-sm">
                  This module is completely free! You don't need a credit card to subscribe.
                </p>
                <div className="mt-auto">
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe for Free'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 mb-6">
                  <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center">
                    <CreditCard className="text-zinc-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Credit Card ending in ****</p>
                    <p className="text-xs text-zinc-500">Test mode</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xs text-zinc-500 text-center mb-4">
                    This is a simulated checkout. No real charges will be made.
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${moduleData.price}`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
