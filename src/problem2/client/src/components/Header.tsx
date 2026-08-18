import React, { useState } from 'react';
import { useSwapStore } from '../store/useSwapStore';
import { Sun, Moon, Copy, Check, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, userWallet, resetUserWallet, isConnected, tokensMap } = useSwapStore();
  const [copied, setCopied] = useState(false);

  // Calculate Total Portfolio Value in USD
  const totalUsdValue = Object.entries(userWallet.balances).reduce((acc, [symbol, amount]) => {
    const price = tokensMap[symbol]?.price || (symbol === 'USD' || symbol === 'USDT' || symbol === 'BUSD' || symbol === 'USDC' ? 1 : 0);
    return acc + amount * price;
  }, 0);

  const copyAddress = () => {
    navigator.clipboard.writeText(userWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedAddress = `${userWallet.address.slice(0, 6)}...${userWallet.address.slice(-4)}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/80 light:border-slate-200 light:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Fixed SVG Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative p-2 bg-slate-900 rounded-full border border-slate-700/80">
              <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" fill="none" stroke="currentColor" strokeWidth="8"/>
                <path d="M50,25 L75,37.5 L75,62.5 L50,75 L25,62.5 L25,37.5 Z" fill="currentColor" opacity="0.3"/>
                <circle cx="50" cy="50" r="12" fill="#00F5D4" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                SWITCHEO SWAP
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isConnected ? 'Live WebSocket 1s' : 'Polling Sync'}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Controls & User Wallet */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Base Currency Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="text-cyan-400 font-bold">$</span>
            <span>USD Base</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-all duration-200"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Reset Demo Wallet */}
          <button
            onClick={resetUserWallet}
            className="hidden md:flex p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Reset Demo Wallet & Balances"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Section (Avatar, Address & Total Balance) */}
          <div className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-lg">
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-slate-300">
                <span>{truncatedAddress}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 text-slate-400 hover:text-cyan-400 transition"
                  title="Copy Wallet Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-xs font-bold text-cyan-400 font-mono">
                ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 ring-2 ring-cyan-500/20">
              <img
                src={userWallet.avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-[10px] bg-slate-900"
              />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
