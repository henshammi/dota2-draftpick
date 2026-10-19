import React from 'react';
import { Plus, X, Shuffle, RotateCcw, Flame } from 'lucide-react';

export default function EnemyDraftPicker({
  enemyHeroes = [null, null, null, null, null],
  onAddEnemy,
  onRemoveEnemy,
  onClearEnemies,
  onRandomEnemies,
}) {
  const activeHeroes = (enemyHeroes || []).filter(Boolean);

  const getAttrBorder = (attr) => {
    switch (attr) {
      case 'str': return 'border-red-500/50 shadow-glow-red';
      case 'agi': return 'border-emerald-500/50 shadow-glow-green';
      case 'int': return 'border-sky-500/50 shadow-glow-cyan';
      case 'all': return 'border-purple-500/50';
      default: return 'border-white/10';
    }
  };

  const getAttrBadge = (attr) => {
    switch (attr) {
      case 'str': return { text: 'STR', color: 'bg-red-950 text-red-400 border-red-500/30' };
      case 'agi': return { text: 'AGI', color: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' };
      case 'int': return { text: 'INT', color: 'bg-sky-950 text-sky-400 border-sky-500/30' };
      case 'all': return { text: 'UNI', color: 'bg-purple-950 text-purple-400 border-purple-500/30' };
      default: return { text: attr, color: 'bg-slate-900 text-slate-400 border-slate-700' };
    }
  };

  // Fixed 5 slots
  const slots = [0, 1, 2, 3, 4];

  return (
    <div className="w-full bg-dota-dark-900/90 rounded-2xl border border-red-500/20 p-3.5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow for Dire theme */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Draft Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 shadow-glow-red shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cinzel font-bold text-sm sm:text-lg text-white tracking-wide">
                KOMPOSISI HERO LAWAN (DIRE)
              </h2>
              <span className="badge badge-error badge-xs sm:badge-sm font-outfit font-semibold">
                {activeHeroes.length} / 5
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-outfit">
              Pilih hero musuh untuk menghitung rekomendasi counter pick & item situasional.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRandomEnemies}
            className="btn btn-xs sm:btn-sm btn-outline border-white/10 hover:border-dota-gold hover:bg-dota-gold/10 hover:text-dota-gold text-slate-300 font-outfit gap-1.5 flex-1 sm:flex-none"
            title="Pilih 5 hero lawan secara acak untuk simulasi cepat"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Lawan</span>
          </button>
          <button
            type="button"
            onClick={onClearEnemies}
            disabled={activeHeroes.length === 0}
            className="btn btn-xs sm:btn-sm btn-ghost text-red-400 hover:bg-red-950/40 font-outfit gap-1.5 disabled:opacity-40"
            title="Kosongkan semua slot lawan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 5 Slots: Mobile Swipeable Track + Desktop 5-Column Grid */}
      <div className="flex md:grid md:grid-cols-5 gap-2.5 sm:gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar snap-x">
        {slots.map((idx) => {
          const hero = enemyHeroes[idx];

          if (hero) {
            const badge = getAttrBadge(hero.primary_attr);
            return (
              <div
                key={`draft-slot-${idx}`}
                className={`relative group rounded-xl overflow-hidden bg-dota-dark-850 border ${getAttrBorder(
                  hero.primary_attr
                )} flex flex-col transition-all duration-200 hover:-translate-y-1 w-[130px] sm:w-[150px] md:w-auto shrink-0 snap-start`}
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveEnemy(idx);
                  }}
                  className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  title="Hapus hero dari slot ini"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Hero Portrait - click to change */}
                <div
                  onClick={() => onAddEnemy(idx)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-dota-dark-950 cursor-pointer"
                  title="Klik untuk mengganti hero di slot ini"
                >
                  <img
                    src={hero.img_url}
                    alt={hero.localized_name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute bottom-1 left-1 text-[9px] font-bold px-1 py-0.2 rounded border ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </div>

                {/* Info */}
                <div
                  onClick={() => onAddEnemy(idx)}
                  className="p-2 flex-1 flex flex-col justify-between cursor-pointer"
                  title="Klik untuk mengganti hero di slot ini"
                >
                  <div>
                    <h3 className="font-outfit font-bold text-xs sm:text-sm text-white group-hover:text-dota-gold truncate transition-colors">
                      {hero.localized_name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                      {hero.roles?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-red-400/80 font-mono mt-1 font-semibold flex items-center justify-between">
                    <span>Slot #{idx + 1}</span>
                    <span className="text-[9px] text-slate-500 font-sans group-hover:text-slate-300">Ganti</span>
                  </div>
                </div>
              </div>
            );
          }

          // Empty Slot
          return (
            <button
              key={`draft-slot-${idx}`}
              type="button"
              onClick={() => onAddEnemy(idx)}
              className="relative aspect-[16/12] md:aspect-auto md:h-36 rounded-xl border-2 border-dashed border-white/10 hover:border-red-500/60 bg-dota-dark-850/40 hover:bg-red-950/20 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 text-center transition-all duration-200 group cursor-pointer w-[130px] sm:w-[150px] md:w-auto shrink-0 snap-start"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 group-hover:bg-red-500/20 group-hover:border-red-500/40 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-red-400 transition-colors">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-semibold text-xs text-slate-300 group-hover:text-white">
                  + Pilih Hero
                </span>
                <span className="text-[10px] text-slate-500 font-outfit">
                  Slot #{idx + 1}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
