import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { SwapForm } from './components/SwapForm';
import { Footer } from './components/Footer';
import { SuccessModal } from './components/SuccessModal';
import { useSwapStore } from './store/useSwapStore';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const { initSocket } = useSwapStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Background Radial Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-7xl w-full mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant & Secure Liquidity Swaps</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 mb-3">
            Swap Tokens with <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Zero Friction</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Real-time market rates powered by WebSocket streaming, dynamic fee tiers, and instant local settlement.
          </p>
        </div>

        {/* Swap Form Component */}
        <SwapForm />

        {/* Value Proposition Badges */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-200">Real-Time Streaming</h4>
              <p className="text-[11px] text-slate-400">1s price updates</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-200">Tiered Fee Policy</h4>
              <p className="text-[11px] text-slate-400">Down to 0.02% fees</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-200">Non-Custodial</h4>
              <p className="text-[11px] text-slate-400">Local memory storage</p>
            </div>
          </div>
        </div>

      </main>

      {/* Success Modal */}
      <SuccessModal />

      {/* Footer */}
      <Footer />

    </div>
  );
};
