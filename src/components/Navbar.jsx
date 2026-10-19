import React from 'react';
import { Shield, Swords, Backpack, BarChart3, ChevronDown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, skillBracket, setSkillBracket }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-dota-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        
        {/* Desktop Single Row / Mobile Top Row */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Patch Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-dota-gold/20 to-dota-red/20 border border-dota-gold/40 shadow-glow-gold">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-dota-gold" />
              <div className="absolute inset-0 rounded-xl bg-dota-gold/10 animate-pulse-subtle"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-cinzel font-black tracking-wider text-lg sm:text-2xl text-white">
                  AEGIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-dota-gold via-yellow-300 to-amber-500">DRAFT</span>
                </span>
                <span className="badge badge-warning badge-xs font-mono font-bold tracking-widest text-[9px] sm:text-[10px] px-1 py-0.5">
                  7.37d
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-outfit text-slate-400 hidden md:block">
                Counter-Picker & Smart Item Guide (Core vs Situational)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile/tablet < lg) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('counter')}
              className={`btn btn-sm gap-2 font-outfit transition-all duration-200 ${
                activeTab === 'counter'
                  ? 'btn-primary text-dota-dark-950 font-bold shadow-glow-gold'
                  : 'btn-ghost text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Counter-Picker</span>
            </button>

            <button
              onClick={() => setActiveTab('items')}
              className={`btn btn-sm gap-2 font-outfit transition-all duration-200 ${
                activeTab === 'items'
                  ? 'btn-primary text-dota-dark-950 font-bold shadow-glow-gold'
                  : 'btn-ghost text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Backpack className="w-4 h-4" />
              <span>Panduan Item (Core/Situasional)</span>
            </button>

            <button
              onClick={() => setActiveTab('meta')}
              className={`btn btn-sm gap-2 font-outfit transition-all duration-200 ${
                activeTab === 'meta'
                  ? 'btn-primary text-dota-dark-950 font-bold shadow-glow-gold'
                  : 'btn-ghost text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Meta Tier List</span>
            </button>
          </nav>

          {/* Skill Bracket Selector (Responsive for both Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Rank:</span>
            <div className="relative">
              <select
                value={skillBracket}
                onChange={(e) => setSkillBracket(e.target.value)}
                className="select select-bordered select-xs sm:select-sm bg-dota-dark-850 text-slate-200 border-white/10 focus:border-dota-gold font-outfit pr-7 text-[11px] sm:text-xs"
              >
                <option value="all">🌐 All Brackets</option>
                <option value="herald_archon">🥉 Herald - Archon</option>
                <option value="legend_ancient">🥈 Legend - Ancient</option>
                <option value="divine_immortal">🥇 Divine - Immortal</option>
                <option value="pro">🏆 Pro Circuit</option>
              </select>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Bar (Visible on mobile/tablet < lg) */}
        <nav className="flex lg:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-white/5">
          <button
            onClick={() => setActiveTab('counter')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-outfit text-xs transition-all ${
              activeTab === 'counter'
                ? 'bg-dota-gold text-dota-dark-950 font-bold shadow-glow-gold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="truncate">Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-outfit text-xs transition-all ${
              activeTab === 'items'
                ? 'bg-dota-gold text-dota-dark-950 font-bold shadow-glow-gold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span className="truncate">Item Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-outfit text-xs transition-all ${
              activeTab === 'meta'
                ? 'bg-dota-gold text-dota-dark-950 font-bold shadow-glow-gold'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="truncate">Tier List</span>
          </button>
        </nav>

      </div>
    </header>
  );
}
