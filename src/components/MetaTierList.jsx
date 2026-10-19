import React, { useState, useMemo } from 'react';
import { Search, Crown, ArrowRight, Shield } from 'lucide-react';

export default function MetaTierList({ allHeroes = [], onSelectHeroForGuide, skillBracket = 'all' }) {
  const [search, setSearch] = useState('');
  const [selectedAttr, setSelectedAttr] = useState('all');

  // Calculate bracket-specific winrate and classify into tiers
  const heroesWithScore = useMemo(() => {
    return allHeroes.map((hero) => {
      let winrate = parseFloat(hero.overall_winrate) || 50.0;
      let picks = hero.pub_pick || 0;

      // Calculate bracket-specific stats if available
      if (skillBracket === 'herald_archon') {
        const p = (hero['1_pick'] || 0) + (hero['2_pick'] || 0) + (hero['3_pick'] || 0) + (hero['4_pick'] || 0);
        const w = (hero['1_win'] || 0) + (hero['2_win'] || 0) + (hero['3_win'] || 0) + (hero['4_win'] || 0);
        if (p > 0) winrate = parseFloat(((w / p) * 100).toFixed(1));
        picks = p;
      } else if (skillBracket === 'legend_ancient') {
        const p = (hero['5_pick'] || 0) + (hero['6_pick'] || 0);
        const w = (hero['5_win'] || 0) + (hero['6_win'] || 0);
        if (p > 0) winrate = parseFloat(((w / p) * 100).toFixed(1));
        picks = p;
      } else if (skillBracket === 'divine_immortal') {
        const p = (hero['7_pick'] || 0) + (hero['8_pick'] || 0);
        const w = (hero['7_win'] || 0) + (hero['8_win'] || 0);
        if (p > 0) winrate = parseFloat(((w / p) * 100).toFixed(1));
        picks = p;
      } else if (skillBracket === 'pro') {
        const p = hero.pro_pick || 0;
        const w = hero.pro_win || 0;
        if (p > 0) winrate = parseFloat(((w / p) * 100).toFixed(1));
        picks = p;
      }

      // Assign Tier based on winrate
      let tier = 'B';
      if (winrate >= 53.0) tier = 'S+';
      else if (winrate >= 51.5) tier = 'S';
      else if (winrate >= 50.0) tier = 'A';
      else if (winrate >= 48.0) tier = 'B';
      else tier = 'C';

      return {
        ...hero,
        bracketWinrate: winrate,
        bracketPicks: picks,
        tier,
      };
    });
  }, [allHeroes, skillBracket]);

  const filteredHeroes = useMemo(() => {
    return heroesWithScore.filter((h) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!h.localized_name.toLowerCase().includes(q)) return false;
      }
      if (selectedAttr !== 'all') {
        if (selectedAttr === 'uni' && h.primary_attr !== 'all') return false;
        if (selectedAttr !== 'uni' && h.primary_attr !== selectedAttr) return false;
      }
      return true;
    });
  }, [heroesWithScore, search, selectedAttr]);

  const tiers = [
    { key: 'S+', title: 'S+ TIER (META OVERLORDS)', color: 'border-amber-400 bg-amber-950/30 text-amber-300', glow: 'shadow-glow-gold' },
    { key: 'S', title: 'S TIER (VERY STRONG PICKS)', color: 'border-purple-400 bg-purple-950/30 text-purple-300', glow: '' },
    { key: 'A', title: 'A TIER (SOLID & BALANCED)', color: 'border-sky-400 bg-sky-950/30 text-sky-300', glow: '' },
    { key: 'B', title: 'B TIER (SITUATIONAL / POCKET)', color: 'border-emerald-400 bg-emerald-950/30 text-emerald-300', glow: '' },
    { key: 'C', title: 'C TIER (OFF-META / UNDERPERFORMING)', color: 'border-slate-600 bg-slate-900/40 text-slate-400', glow: '' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Intro & Filters */}
      <div className="p-5 bg-dota-dark-900/90 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-dota-gold/10 border border-dota-gold/30 text-dota-gold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
              DOTA 2 HERO META TIER LIST
            </h2>
            <p className="text-xs text-slate-400 font-outfit">
              Dihitung berdasarkan winrate OpenDota pada bracket yang dipilih.
            </p>
          </div>
        </div>

        {/* Search & Attr Filter */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari hero..."
              className="input input-sm w-full pl-9 bg-dota-dark-950 border-white/10 text-slate-200 text-xs"
            />
          </div>

          <div className="join">
            <button
              onClick={() => setSelectedAttr('all')}
              className={`join-item btn btn-xs ${selectedAttr === 'all' ? 'btn-primary text-dota-dark-950' : 'btn-ghost'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedAttr('str')}
              className={`join-item btn btn-xs ${selectedAttr === 'str' ? 'btn-error' : 'btn-ghost text-red-400'}`}
            >
              STR
            </button>
            <button
              onClick={() => setSelectedAttr('agi')}
              className={`join-item btn btn-xs ${selectedAttr === 'agi' ? 'btn-success' : 'btn-ghost text-emerald-400'}`}
            >
              AGI
            </button>
            <button
              onClick={() => setSelectedAttr('int')}
              className={`join-item btn btn-xs ${selectedAttr === 'int' ? 'btn-info' : 'btn-ghost text-sky-400'}`}
            >
              INT
            </button>
            <button
              onClick={() => setSelectedAttr('uni')}
              className={`join-item btn btn-xs ${selectedAttr === 'uni' ? 'btn-secondary' : 'btn-ghost text-purple-400'}`}
            >
              UNI
            </button>
          </div>
        </div>
      </div>

      {/* Tier Rows */}
      <div className="flex flex-col gap-4">
        {tiers.map((tier) => {
          const heroesInTier = filteredHeroes.filter((h) => h.tier === tier.key);
          if (heroesInTier.length === 0 && search) return null;

          return (
            <div
              key={tier.key}
              className={`rounded-2xl border overflow-hidden bg-dota-dark-900/80 ${tier.color} ${tier.glow}`}
            >
              {/* Tier Header */}
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-dota-dark-950/60">
                <div className="flex items-center gap-2.5">
                  <span className="font-cinzel font-black text-xl px-2.5 py-0.5 rounded-lg bg-white/10">
                    {tier.key}
                  </span>
                  <span className="font-outfit font-bold text-sm tracking-wider">
                    {tier.title}
                  </span>
                </div>
                <span className="text-xs font-mono opacity-70">
                  {heroesInTier.length} Heroes
                </span>
              </div>

              {/* Heroes Track */}
              <div className="p-4 flex flex-wrap gap-2.5">
                {heroesInTier.map((hero) => (
                  <div
                    key={hero.id}
                    onClick={() => onSelectHeroForGuide(hero)}
                    className="group relative flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-dota-dark-850 hover:bg-dota-dark-800 border border-white/5 hover:border-dota-gold/50 cursor-pointer transition-all duration-200"
                    title={`Klik untuk melihat panduan item ${hero.localized_name}`}
                  >
                    <img
                      src={hero.icon_url || hero.img_url}
                      alt={hero.localized_name}
                      className="w-8 h-8 rounded object-cover border border-white/10 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="font-outfit font-bold text-xs text-white group-hover:text-dota-gold truncate block">
                        {hero.localized_name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {hero.bracketWinrate}% Win
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
