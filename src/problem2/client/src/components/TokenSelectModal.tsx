import React, { useState } from 'react';
import { useSwapStore } from '../store/useSwapStore';
import { Search, X, AlertTriangle, Check } from 'lucide-react';
import { TokenPrice } from '../types';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (currency: string) => void;
  selectedToken: string;
}

const TokenAvatar: React.FC<{ iconUrl: string; symbol: string }> = ({ iconUrl, symbol }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="shrink-0 w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
      {!hasError ? (
        <img
          src={iconUrl}
          alt={symbol}
          className="w-6 h-6 object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-tighter">
          {symbol.slice(0, 3)}
        </span>
      )}
    </div>
  );
};

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken
}) => {
  const { tokensList, userWallet } = useSwapStore();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTokens = tokensList.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  // Popular tokens shortcut
  const popularCurrencies = ['ETH', 'USDC', 'USDT', 'BTC', 'USD', 'ATOM', 'OSMO'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-slate-100">Select a Token</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800/60">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by token name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
            />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {popularCurrencies.map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  onSelectToken(symbol);
                  onClose();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  selectedToken === symbol
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTokens.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500/60" />
              <span>No tokens found matching "{search}"</span>
            </div>
          ) : (
            filteredTokens.map((token: TokenPrice) => {
              const userBal = userWallet.balances[token.currency] || 0;
              const isSelected = selectedToken === token.currency;

              return (
                <button
                  key={token.currency}
                  onClick={() => {
                    onSelectToken(token.currency);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all group ${
                    isSelected
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <TokenAvatar iconUrl={token.iconUrl} symbol={token.currency} />
                    <div className="text-left min-w-0 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-slate-200 text-sm truncate">{token.currency}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                      </div>
                    </div>
                  </div>

                  {/* User Balance Display */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-slate-200">
                      {userBal > 0 ? userBal.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Balance
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
