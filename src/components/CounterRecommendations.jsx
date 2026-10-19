import React, { useState, useMemo } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle, Swords, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function CounterRecommendations({
  counterResults,
  isLoading,
  enemyHeroes = [],
  onSelectHeroForGuide,
  situationalRules = [],
}) {
  const [roleFilter, setRoleFilter] = useState('all');

  const { topCounters = [], worstMatchups = [] } = counterResults || {};

  const filteredCounters = useMemo(() => {
    if (roleFilter === 'all') return topCounters;
    return topCounters.filter(({ hero }) => {
      if (roleFilter === 'Carry') return hero.roles?.includes('Carry');
      if (roleFilter === 'Mid') return hero.roles?.includes('Nuker') || hero.roles?.includes('Carry');
      if (roleFilter === 'Offlane') return hero.roles?.includes('Initiator') || hero.roles?.includes('Durable');
      if (roleFilter === 'Support') return hero.roles?.includes('Support');
      return true;
    });
  }, [topCounters, roleFilter]);

  const getAttrColor = (attr) => {
    switch (attr) {
      case 'str': return 'text-red-400 bg-red-950/60 border-red-500/30';
      case 'agi': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'int': return 'text-sky-400 bg-sky-950/60 border-sky-500/30';
      case 'all': return 'text-purple-400 bg-purple-950/60 border-purple-500/30';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  if (enemyHeroes.length === 0) {
    return (
      <div className="w-full bg-dota-dark-900/60 rounded-2xl border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-dota-dark-800 border border-white/10 flex items-center justify-center text-dota-gold shadow-glow-gold">
          <Swords className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">
            Belum Ada Hero Lawan yang Dipilih
          </h3>
          <p className="text-sm text-slate-400 font-outfit">
            Klik slot hero lawan di atas atau gunakan tombol <strong>"Acak Lawan"</strong> untuk langsung melihat rekomendasi hero counter pick & item situasional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Column: Top Counter Picks (2 cols on lg) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        
        {/* Panel Header & Role Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-dota-dark-900/90 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                REKOMENDASI COUNTER PICK TERBAIK
              </h3>
              <p className="text-xs text-slate-400 font-outfit">
                Berdasarkan kalkulasi head-to-head matchup OpenDota API
              </p>
            </div>
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar shrink-0">
            {['all', 'Carry', 'Mid', 'Offlane', 'Support'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`btn btn-xs sm:btn-sm font-outfit transition-all shrink-0 ${
                  roleFilter === role
                    ? 'btn-accent text-dota-dark-950 font-bold'
                    : 'btn-ghost text-slate-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Semua Role' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Hero Cards List */}
        {isLoading ? (
          <div className="p-12 text-center bg-dota-dark-900/60 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-lg text-dota-gold"></span>
            <p className="text-sm font-outfit text-slate-300">
              Menghitung ribuan riwayat matchup OpenDota...
            </p>
          </div>
        ) : filteredCounters.length === 0 ? (
          <div className="p-8 text-center bg-dota-dark-900/60 rounded-2xl border border-white/10 text-slate-400">
            Tidak ada rekomendasi hero untuk filter role ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredCounters.map(({ hero, avgAdvantage, matchupsVsEnemies }, index) => {
              const isPositive = avgAdvantage >= 0;
              return (
                <div
                  key={hero.id}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-dota-dark-850 border border-white/10 hover:border-dota-gold/50 hover:shadow-glow-gold transition-all duration-200"
                >
                  {/* Top: Rank badge + Advantage */}
                  <div className="flex items-center justify-between px-3 py-2 bg-dota-dark-900 border-b border-white/5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{index + 1} COUNTER
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        isPositive
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isPositive ? `+${avgAdvantage}%` : `${avgAdvantage}%`} Advantage
                    </span>
                  </div>

                  {/* Body: Avatar + Details */}
                  <div className="p-3 sm:p-4 flex gap-3.5">
                    <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-lg overflow-hidden shrink-0 border border-white/10 bg-dota-dark-950">
                      <img
                        src={hero.img_url}
                        alt={hero.localized_name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-outfit font-bold text-sm sm:text-base text-white truncate">
                          {hero.localized_name}
                        </h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getAttrColor(hero.primary_attr)}`}>
                          {hero.primary_attr.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {hero.roles?.slice(0, 3).join(' • ')}
                      </p>

                      {/* Best specific matchups */}
                      {matchupsVsEnemies?.[0] && (
                        <div className="mt-2 text-[11px] font-outfit text-emerald-400 flex items-center gap-1 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            Kuat vs <strong>{matchupsVsEnemies[0].enemyName}</strong> ({matchupsVsEnemies[0].winrate}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Button: Select & View Item Guide */}
                  <div className="px-3 pb-3 pt-1">
                    <button
                      onClick={() => onSelectHeroForGuide(hero)}
                      className="btn btn-sm btn-block btn-outline border-white/10 hover:border-dota-gold hover:bg-dota-gold hover:text-dota-dark-950 font-outfit text-xs font-semibold gap-1.5 transition-all"
                    >
                      <span>Pakai Hero & Lihat Panduan Item</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar: Tactical Threat Insights & Heroes to Avoid (1 col on lg) */}
      <div className="flex flex-col gap-4">
        
        {/* Tactical Situational Threats */}
        <div className="p-4 sm:p-5 bg-dota-dark-900/90 rounded-2xl border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-dota-gold border-b border-white/10 pb-3">
            <Zap className="w-5 h-5" />
            <h3 className="font-cinzel font-bold text-base text-white">
              ANALISIS ANCAMAN LAWAN
            </h3>
          </div>

          {situationalRules.length === 0 ? (
            <p className="text-xs text-slate-400 font-outfit py-2">
              Tidak ada ancaman spesifik ekstrem (evasion/passives) yang terdeteksi dari hero lawan saat ini.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {situationalRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-xl bg-dota-dark-850 border border-white/5 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-outfit font-bold text-xs text-amber-400">
                      {rule.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rule.triggeringEnemies.join(', ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-outfit">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Heroes to Avoid (Worst Matchups) */}
        <div className="p-4 sm:p-5 bg-dota-dark-900/90 rounded-2xl border border-red-500/20 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-400 border-b border-white/10 pb-3">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="font-cinzel font-bold text-base text-white">
                HERO YANG HARUS DIHINDARI
              </h3>
              <p className="text-[11px] text-slate-400 font-outfit">
                Paling rentan di-counter oleh lineup lawan ini
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {worstMatchups.slice(0, 5).map(({ hero, avgAdvantage }) => (
              <div
                key={hero.id}
                className="flex items-center justify-between p-2 rounded-lg bg-dota-dark-850/60 border border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={hero.icon_url || hero.img_url}
                    alt={hero.localized_name}
                    className="w-8 h-8 rounded object-cover shrink-0 border border-white/10"
                  />
                  <div className="truncate">
                    <span className="font-outfit font-semibold text-xs text-white truncate block">
                      {hero.localized_name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {hero.roles?.[0]}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 shrink-0">
                  {avgAdvantage}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
