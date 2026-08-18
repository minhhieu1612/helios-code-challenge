import React, { useState } from 'react';
import { useSwapStore } from '../store/useSwapStore';
import { ArrowDownUp, AlertCircle, Loader2, Sparkles, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { TokenSelectModal } from './TokenSelectModal';

export const SwapForm: React.FC = () => {
  const {
    fromToken,
    toToken,
    fromAmount,
    setFromToken,
    setToToken,
    setFromAmount,
    swapTokens,
    tokensMap,
    userWallet,
    executeSwap,
    isSwapping
  } = useSwapStore();

  const [modalType, setModalType] = useState<'from' | 'to' | null>(null);

  // Asset price data
  const fromAsset = tokensMap[fromToken];
  const toAsset = tokensMap[toToken];

  const fromPrice = fromAsset?.price || 0;
  const toPrice = toAsset?.price || 0;

  // Check service availability
  const isFromAvailable = !!fromAsset && fromAsset.price > 0 && fromAsset.isAvailable !== false;
  const isToAvailable = !!toAsset && toAsset.price > 0 && toAsset.isAvailable !== false;
  const isServiceAvailable = isFromAvailable && isToAvailable;

  // User available balance
  const userBalance = userWallet.balances[fromToken] || 0;

  // Parse input amount
  const numericFromAmount = parseFloat(fromAmount) || 0;

  // Fee calculation tier
  const usdValue = numericFromAmount * fromPrice;
  let feeRate = 0.001; // < 100 USD -> 0.1%
  let feeLabel = '0.10%';

  if (usdValue >= 1000) {
    feeRate = 0.0002; // >= 1000 USD -> 0.02%
    feeLabel = '0.02%';
  } else if (usdValue >= 100) {
    feeRate = 0.0005; // >= 100 USD -> 0.05%
    feeLabel = '0.05%';
  }

  const feeAmountInFromToken = numericFromAmount * feeRate;
  const netFromAmount = Math.max(0, numericFromAmount - feeAmountInFromToken);

  // Exchange rate & calculated output
  const exchangeRate = fromPrice > 0 && toPrice > 0 ? fromPrice / toPrice : 0;
  const calculatedToAmount = isServiceAvailable && exchangeRate > 0 ? netFromAmount * exchangeRate : 0;

  // Validation Checks
  const isInputEmpty = fromAmount.trim() === '';
  const isInvalidNumber = isNaN(numericFromAmount) || numericFromAmount <= 0;
  const isExceedingBalance = numericFromAmount > userBalance;

  let errorMessage: string | null = null;
  if (!isServiceAvailable) {
    if (!isFromAvailable) errorMessage = `Swap service currently unavailable for ${fromToken}`;
    else if (!isToAvailable) errorMessage = `Swap service currently unavailable for ${toToken}`;
  } else if (!isInputEmpty && isInvalidNumber) {
    errorMessage = 'Please enter a valid swap amount greater than 0';
  } else if (isExceedingBalance) {
    errorMessage = `Insufficient ${fromToken} balance (Available: ${userBalance.toLocaleString()})`;
  }

  const isFormValid = isServiceAvailable && !isInputEmpty && !isInvalidNumber && !isExceedingBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSwapping) return;
    await executeSwap();
  };

  const handleMaxClick = () => {
    if (userBalance > 0) {
      setFromAmount(userBalance.toString());
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      
      {/* Swap Card Container */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl transition-all duration-300">
        
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-xl tracking-tight text-slate-100">
              Swap Tokens
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
              Slippage: <span className="text-cyan-400">0.5%</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Top Section: Pay / From Asset */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">You Pay</span>
              <div className="flex items-center gap-2">
                <span>Balance: <strong className="text-slate-200">{userBalance.toLocaleString('en-US', { maximumFractionDigits: 6 })}</strong></span>
                {userBalance > 0 && (
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold hover:bg-cyan-500/30 transition text-[10px]"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Input Amount */}
              <input
                type="number"
                step="any"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
              />

              {/* Token Selector Button */}
              <button
                type="button"
                onClick={() => setModalType('from')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 transition group shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {fromAsset?.iconUrl ? (
                    <img src={fromAsset.iconUrl} alt={fromToken} className="w-5 h-5 object-contain" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
                  ) : (
                    <span className="text-xs font-bold text-cyan-400">{fromToken.slice(0, 2)}</span>
                  )}
                </div>
                <span className="font-bold text-sm text-slate-100">{fromToken}</span>
                <span className="text-slate-400 text-xs group-hover:text-slate-200">▼</span>
              </button>
            </div>

            {/* Price in USD equivalent */}
            <div className="mt-2 text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>≈ ${(numericFromAmount * fromPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              {fromPrice > 0 && <span>1 {fromToken} = ${fromPrice.toLocaleString()}</span>}
            </div>
          </div>

          {/* Direction Switch Button */}
          <div className="relative flex justify-center -my-2 z-10">
            <button
              type="button"
              onClick={swapTokens}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 border-4 border-slate-900 shadow-xl transition-all duration-300 group hover:rotate-180"
              title="Switch Pay & Receive Tokens"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Section: Receive / To Asset */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">You Receive (Estimated)</span>
              <span>Balance: <strong className="text-slate-200">{(userWallet.balances[toToken] || 0).toLocaleString('en-US', { maximumFractionDigits: 6 })}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              {/* Output Amount */}
              <div className="w-full text-2xl sm:text-3xl font-bold font-mono text-cyan-400 truncate">
                {calculatedToAmount > 0 ? calculatedToAmount.toFixed(6) : '0.0'}
              </div>

              {/* Token Selector Button */}
              <button
                type="button"
                onClick={() => setModalType('to')}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 transition group shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {toAsset?.iconUrl ? (
                    <img src={toAsset.iconUrl} alt={toToken} className="w-5 h-5 object-contain" onError={(e) => (e.target as HTMLElement).style.display = 'none'} />
                  ) : (
                    <span className="text-xs font-bold text-cyan-400">{toToken.slice(0, 2)}</span>
                  )}
                </div>
                <span className="font-bold text-sm text-slate-100">{toToken}</span>
                <span className="text-slate-400 text-xs group-hover:text-slate-200">▼</span>
              </button>
            </div>

            {/* Price in USD equivalent */}
            <div className="mt-2 text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>≈ ${(calculatedToAmount * toPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              {toPrice > 0 && <span>1 {toToken} = ${toPrice.toLocaleString()}</span>}
            </div>
          </div>

          {/* Fee & Exchange Rate breakdown */}
          {exchangeRate > 0 && isServiceAvailable && (
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Exchange Rate</span>
                <span className="font-mono">1 {fromToken} ≈ {exchangeRate.toFixed(6)} {toToken}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400">
                  <span>Trading Fee Tier</span>
                  <span title="< $100: 0.1% | $100-$1000: 0.05% | >= $1000: 0.02%">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                  </span>
                </div>
                <span className="font-mono font-semibold text-cyan-400">{feeLabel}</span>
              </div>
            </div>
          )}

          {/* Error / Warning Alert Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSwapping}
            className={`w-full py-4 px-6 rounded-2xl font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
              isFormValid && !isSwapping
                ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 shadow-cyan-500/25 cursor-pointer active:scale-[0.99]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isSwapping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Executing Swap...</span>
              </>
            ) : !isServiceAvailable ? (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>Service Unavailable</span>
              </>
            ) : isExceedingBalance ? (
              <span>Insufficient Balance</span>
            ) : isInputEmpty ? (
              <span>Enter an Amount</span>
            ) : (
              <>
                <span>Swap {fromToken} for {toToken}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </form>
      </div>

      {/* Modal for selecting tokens */}
      <TokenSelectModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        selectedToken={modalType === 'from' ? fromToken : toToken}
        onSelectToken={(token) => {
          if (modalType === 'from') {
            if (token === toToken) swapTokens();
            else setFromToken(token);
          } else if (modalType === 'to') {
            if (token === fromToken) swapTokens();
            else setToToken(token);
          }
        }}
      />
    </div>
  );
};
