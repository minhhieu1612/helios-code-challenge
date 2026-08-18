import React from 'react';
import { useSwapStore } from '../store/useSwapStore';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';

export const SuccessModal: React.FC = () => {
  const { lastReceipt, clearLastReceipt, userWallet } = useSwapStore();

  if (!lastReceipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
        
        {/* Close Button */}
        <button
          onClick={clearLastReceipt}
          className="absolute right-4 top-4 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Check Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="font-heading text-2xl font-extrabold text-slate-100 mb-1">
          Swap Successful!
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Your transaction has been processed and confirmed on-chain.
        </p>

        {/* Swap Result Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Swapped</span>
            <span className="font-bold text-slate-100">
              {lastReceipt.fromAmount} {lastReceipt.fromToken}
            </span>
          </div>

          <div className="flex items-center justify-center py-1 text-slate-500">
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Received</span>
            <span className="font-extrabold text-emerald-400 text-base">
              +{lastReceipt.toAmount.toFixed(6)} {lastReceipt.toToken}
            </span>
          </div>

          <div className="h-px bg-slate-800 my-2"></div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Trading Fee Tier</span>
            <span className="text-cyan-400 font-semibold">{lastReceipt.feeRatePercentage}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fee Paid</span>
            <span>{lastReceipt.feeAmountInFromToken.toFixed(6)} {lastReceipt.fromToken}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estimated Value</span>
            <span>${lastReceipt.totalUsdValue} USD</span>
          </div>
        </div>

        {/* Details Footer */}
        <div className="text-left text-xs text-slate-400 space-y-1.5 mb-6 px-1">
          <div className="flex justify-between">
            <span>Tx Hash:</span>
            <span className="font-mono text-slate-300">{lastReceipt.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span>New {lastReceipt.toToken} Balance:</span>
            <span className="font-bold text-slate-200">
              {(userWallet.balances[lastReceipt.toToken] || 0).toLocaleString('en-US', { maximumFractionDigits: 6 })} {lastReceipt.toToken}
            </span>
          </div>
        </div>

        <button
          onClick={clearLastReceipt}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-heading font-extrabold text-base tracking-wide transition shadow-lg shadow-emerald-500/20"
        >
          Done
        </button>

      </div>
    </div>
  );
};
