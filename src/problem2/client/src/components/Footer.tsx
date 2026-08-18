import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Copyright */}
        <div className="text-xs text-slate-400 font-medium">
          © Copyright 2026, <span className="text-slate-200 font-semibold">Minh Hieu Nguyen aka Calvin</span>. All rights reserved.
        </div>

        {/* Right: Social Media Icons with empty href */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition"
            title="X (Twitter)"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition"
            title="Gmail"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
};
