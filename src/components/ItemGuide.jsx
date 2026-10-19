import React, { useState, useEffect, useMemo } from 'react';
import {
  Backpack,
  Sparkles,
  ShieldAlert,
  Coins,
  Flame,
  Clock,
  CheckCircle2,
  HelpCircle,
  X,
  Plus
} from 'lucide-react';
import { getHeroItemPopularity, getItemConstants, getFullImgUrl } from '../services/opendota';
import { SITUATIONAL_RULES } from '../data/situationalRules';

export default function ItemGuide({
  selectedHero,
  onOpenHeroModal,
  enemyHeroes = [],
}) {
  const [itemPopularity, setItemPopularity] = useState(null);
  const [itemsBundle, setItemsBundle] = useState({ itemsByName: {}, itemsById: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState(null);
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'situational', 'core', 'early', 'late'

  // Fetch item popularity & constants when selectedHero changes
  useEffect(() => {
    if (!selectedHero) return;

    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getHeroItemPopularity(selectedHero.id),
      getItemConstants(),
    ])
      .then(([popularity, constantsBundle]) => {
        if (!isMounted) return;
        setItemPopularity(popularity);
        setItemsBundle(constantsBundle || { itemsByName: {}, itemsById: {} });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching item guide data:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedHero]);

  // Helper to format item object from numeric ID or string key
  const resolveItem = (idOrKey, count = null) => {
    const { itemsByName = {}, itemsById = {} } = itemsBundle;
    const meta =
      itemsById[idOrKey] ||
      itemsByName[idOrKey] ||
      itemsByName[String(idOrKey).replace('item_', '')] ||
      {};

    const key = meta.key || String(idOrKey);
    const dname =
      meta.dname ||
      key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const cost = meta.cost || 0;
    const img = meta.img
      ? getFullImgUrl(meta.img)
      : `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${key}.png`;

    return {
      id: meta.id || idOrKey,
      key,
      name: dname,
      cost,
      img,
      notes: meta.notes || '',
      lore: meta.lore || '',
      attrib: meta.attrib || [],
      abilities: meta.abilities || [],
      count: count,
      meta,
    };
  };

  // Check if an item is a finished/upgraded item (not a raw component like Broadsword, Recipe, or Secret Shop booster)
  const isFinishedItem = (key, meta) => {
    if (!meta) return false;
    if (meta.qual === 'recipe' || key?.startsWith('recipe_')) return false;
    if (key === 'blink' || key?.includes('blink')) return true;
    if (key === 'hand_of_midas' || key?.includes('travel_boots')) return true;
    if (meta.created === true) return true;
    if (meta.qual === 'component' || meta.qual === 'secret_shop') return false;
    return false;
  };

  // Check if an item is a finished early-game staple (Boots, Wand, Bracer/Wraith/Null, Urn, etc.)
  const isEarlyFinished = (key, meta) => {
    if (!meta) return false;
    if (meta.qual === 'recipe' || key?.startsWith('recipe_')) return false;
    if (meta.created === true) return true;
    if (
      key.includes('boots') ||
      key.includes('wand') ||
      key.includes('ring') ||
      key.includes('bracer') ||
      key.includes('wraith') ||
      key.includes('null') ||
      key.includes('orb') ||
      key.includes('urn') ||
      key.includes('corrosion') ||
      key.includes('falcon')
    ) {
      return true;
    }
    return false;
  };

  // Extract Core Items (Top finished mid/late items with high frequency & cost >= 1800)
  const coreItems = useMemo(() => {
    if (!itemPopularity) return [];
    const mid = itemPopularity.mid_game_items || {};
    const late = itemPopularity.late_game_items || {};

    const combined = { ...mid };
    Object.entries(late).forEach(([id, cnt]) => {
      combined[id] = (combined[id] || 0) + cnt;
    });

    return Object.entries(combined)
      .map(([id, cnt]) => resolveItem(id, cnt))
      .filter((x) => isFinishedItem(x.key, x.meta) && x.cost >= 1800)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [itemPopularity, itemsBundle]);

  // Extract Starting Items (From start_game_items, cost <= 700)
  const startingItems = useMemo(() => {
    if (!itemPopularity) return [];
    const start = itemPopularity.start_game_items || {};

    return Object.entries(start)
      .map(([id, cnt]) => resolveItem(id, cnt))
      .filter((x) => !x.key.startsWith('recipe_') && x.cost > 0 && x.cost <= 700)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [itemPopularity, itemsBundle]);

  // Extract Early Game Items (From early_game_items, cost 400 - 2600)
  const earlyItems = useMemo(() => {
    if (!itemPopularity) return [];
    const early = itemPopularity.early_game_items || {};

    return Object.entries(early)
      .map(([id, cnt]) => resolveItem(id, cnt))
      .filter((x) => !x.key.startsWith('recipe_') && x.cost >= 400 && x.cost <= 2600)
      .sort((a, b) => {
        const aFin = isEarlyFinished(a.key, a.meta) ? 1 : 0;
        const bFin = isEarlyFinished(b.key, b.meta) ? 1 : 0;
        if (bFin !== aFin) return bFin - aFin;
        return b.count - a.count;
      })
      .slice(0, 6);
  }, [itemPopularity, itemsBundle]);

  // Extract Late Game & Luxury Items (From late_game_items, cost >= 3500 and distinct from core)
  const lateItems = useMemo(() => {
    if (!itemPopularity) return [];
    const late = itemPopularity.late_game_items || {};
    const coreKeys = new Set(coreItems.map((c) => c.key));

    return Object.entries(late)
      .map(([id, cnt]) => resolveItem(id, cnt))
      .filter(
        (x) =>
          isFinishedItem(x.key, x.meta) &&
          x.cost >= 3500 &&
          !coreKeys.has(x.key)
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [itemPopularity, itemsBundle, coreItems]);

  // Compute situational items triggered by current enemy heroes
  const enemyNames = enemyHeroes.map((h) => h.localized_name);
  const triggeredSituationalRules = SITUATIONAL_RULES.map((rule) => {
    const triggering = enemyNames.filter((name) =>
      rule.enemyHeroes.includes(name)
    );
    return {
      ...rule,
      triggeringEnemies: triggering,
      isTriggered: triggering.length > 0,
    };
  }).filter((rule) => rule.isTriggered || enemyHeroes.length === 0);

  if (!selectedHero) {
    return (
      <div className="w-full bg-dota-dark-900/60 rounded-2xl border border-white/10 p-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-dota-dark-800 border border-white/10 flex items-center justify-center text-dota-gold shadow-glow-gold">
          <Backpack className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">
            Pilih Hero Anda Terlebih Dahulu
          </h3>
          <p className="text-sm text-slate-400 font-outfit mb-4">
            Pilih hero yang ingin Anda mainkan untuk melihat rekomendasi item Core dan Situasional melawan musuh.
          </p>
          <button
            onClick={onOpenHeroModal}
            className="btn btn-primary text-dota-dark-950 font-bold font-outfit gap-2 shadow-glow-gold"
          >
            Pilih Hero Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-dota-dark-900 border border-white/10 shadow-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative w-24 sm:w-28 aspect-[16/9] rounded-xl overflow-hidden border-2 border-dota-gold/50 shadow-glow-gold shrink-0 bg-dota-dark-950">
            <img
              src={selectedHero.img_url}
              alt={selectedHero.localized_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {selectedHero.localized_name}
              </h2>
              <span className="badge badge-warning badge-sm font-bold uppercase">
                {selectedHero.primary_attr}
              </span>
              <span className="badge badge-outline badge-sm text-emerald-400 border-emerald-500/30">
                Winrate: {selectedHero.overall_winrate}%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
              {selectedHero.roles?.join(' • ')} — {selectedHero.attack_type}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-2">
              <span>Armor: <strong className="text-white">{selectedHero.base_armor}</strong></span>
              <span>•</span>
              <span>Speed: <strong className="text-white">{selectedHero.move_speed}</strong></span>
              <span>•</span>
              <span>Range: <strong className="text-white">{selectedHero.attack_range}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenHeroModal}
          className="btn btn-sm btn-outline border-white/20 hover:border-dota-gold hover:bg-dota-gold hover:text-dota-dark-950 font-outfit text-xs"
        >
          Ganti Hero
        </button>
      </div>

      {/* Filter / Category Selector Bar */}
      <div className="flex items-center justify-between gap-2 p-3 bg-dota-dark-900/80 rounded-xl border border-white/10 overflow-x-auto">
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            onClick={() => setActiveSection('all')}
            className={`btn btn-xs sm:btn-sm font-outfit ${
              activeSection === 'all'
                ? 'btn-primary font-bold text-dota-dark-950'
                : 'btn-ghost text-slate-300'
            }`}
          >
            Semua Kategori
          </button>
          <button
            onClick={() => setActiveSection('situational')}
            className={`btn btn-xs sm:btn-sm font-outfit gap-1 ${
              activeSection === 'situational'
                ? 'btn-error font-bold text-white'
                : 'btn-ghost text-red-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Situasional vs Musuh</span>
          </button>
          <button
            onClick={() => setActiveSection('core')}
            className={`btn btn-xs sm:btn-sm font-outfit gap-1 ${
              activeSection === 'core'
                ? 'btn-warning font-bold text-dota-dark-950'
                : 'btn-ghost text-amber-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Items</span>
          </button>
          <button
            onClick={() => setActiveSection('early')}
            className={`btn btn-xs sm:btn-sm font-outfit ${
              activeSection === 'early'
                ? 'btn-accent font-bold text-dota-dark-950'
                : 'btn-ghost text-emerald-400'
            }`}
          >
            Starting & Early
          </button>
          <button
            onClick={() => setActiveSection('late')}
            className={`btn btn-xs sm:btn-sm font-outfit ${
              activeSection === 'late'
                ? 'btn-info font-bold text-dota-dark-950'
                : 'btn-ghost text-sky-400'
            }`}
          >
            Late Game & Luxury
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline font-outfit">
          *Klik item untuk detail stats & efek
        </span>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-16 text-center bg-dota-dark-900/60 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-dota-gold"></span>
          <p className="text-sm font-outfit text-slate-300">
            Mengambil data statistik item OpenDota API untuk {selectedHero.localized_name}...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* ========================================= */}
          {/* 1. CORE ITEMS (ITEM UTAMA / WAJIB HERO)   */}
          {/* ========================================= */}
          {(activeSection === 'all' || activeSection === 'core') && (
            <div className="p-5 sm:p-6 bg-dota-dark-900/90 rounded-2xl border border-dota-gold/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-dota-gold/15 border border-dota-gold/40 text-dota-gold shadow-glow-gold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                        CORE ITEMS (ITEM WAJIB / INTI)
                      </h3>
                      <span className="badge badge-warning badge-sm font-bold">
                        Wajib Dibuat
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-outfit">
                      Item utama yang paling sering dibeli dan memberikan lonjakan kekuatan (power spike) terbesar untuk {selectedHero.localized_name}.
                    </p>
                  </div>
                </div>
              </div>

              {coreItems.length === 0 ? (
                <p className="text-slate-400 text-sm">Data item core tidak tersedia.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                  {coreItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setActiveItemModal(item)}
                      className="group flex flex-col rounded-xl overflow-hidden bg-dota-dark-850 border border-white/10 hover:border-dota-gold hover:shadow-glow-gold hover:-translate-y-1 transition-all duration-200 cursor-pointer p-3"
                    >
                      <div className="relative aspect-[16/11] w-full rounded-lg overflow-hidden bg-dota-dark-950 border border-white/10 mb-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-outfit font-bold text-xs sm:text-sm text-white group-hover:text-dota-gold truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-dota-gold font-mono mt-1 font-semibold">
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-dota-gold" />
                          {item.cost || '—'}
                        </span>
                        {item.count && (
                          <span className="text-[10px] text-slate-400 font-sans">
                            {item.count} games
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================= */}
          {/* 2. SITUATIONAL COUNTER ITEMS SECTION      */}
          {/* ========================================= */}
          {(activeSection === 'all' || activeSection === 'situational') && (
            <div className="p-5 sm:p-6 bg-dota-dark-900/90 rounded-2xl border border-red-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 shadow-glow-red">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                        ITEM SITUASIONAL (COUNTER MUSUH)
                      </h3>
                      {enemyHeroes.length > 0 && (
                        <span className="badge badge-error badge-sm font-bold">
                          {triggeredSituationalRules.filter((r) => r.isTriggered).length} Ancaman Terdeteksi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-outfit">
                      Item yang dibeli sesuai kondisi dan komposisi musuh (misal: butuh MKB lawan Evasion, Silver Edge lawan Pasif tebal, BKB lawan Magic).
                    </p>
                  </div>
                </div>
              </div>

              {enemyHeroes.length === 0 && (
                <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 font-outfit flex items-center justify-between gap-2">
                  <span>
                    💡 <strong>Tips:</strong> Pilih hero lawan di tab <strong>Counter-Picker</strong> untuk mengaktifkan deteksi ancaman otomatis. Di bawah ini ditampilkan katalog item situasional Dota 2:
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggeredSituationalRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border ${
                      rule.isTriggered
                        ? 'bg-dota-dark-850/95 border-red-500/40 shadow-lg shadow-red-950/30'
                        : 'bg-dota-dark-850/50 border-white/5 opacity-85'
                    } flex flex-col justify-between gap-3`}
                  >
                    <div>
                      {/* Threat Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-outfit font-bold text-sm text-red-400">
                          {rule.name}
                        </span>
                        {rule.isTriggered ? (
                          <span className="badge badge-error badge-xs font-mono font-bold">
                            Triggered: {rule.triggeringEnemies.join(', ')}
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-xs text-slate-400">
                            Situasional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-outfit mb-3">
                        {rule.description}
                      </p>

                      {/* Recommended Items */}
                      <div className="flex flex-col gap-2">
                        {rule.recommendedItems.map((item) => {
                          const resolved = resolveItem(item.itemKey);
                          return (
                            <div
                              key={item.itemKey}
                              onClick={() => setActiveItemModal(resolved)}
                              className="group flex items-start gap-3 p-2.5 rounded-lg bg-dota-dark-900 border border-white/5 hover:border-dota-gold/50 cursor-pointer transition-all"
                            >
                              <img
                                src={resolved.img}
                                alt={resolved.name}
                                className="w-12 h-9 rounded object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-outfit font-bold text-xs sm:text-sm text-white group-hover:text-dota-gold truncate">
                                    {resolved.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-dota-gold flex items-center gap-1 font-semibold shrink-0">
                                    <Coins className="w-3 h-3 text-dota-gold" />
                                    {resolved.cost || item.cost}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-outfit mt-0.5 line-clamp-2">
                                  {item.reason}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* 3. STARTING & EARLY GAME ITEMS            */}
          {/* ========================================= */}
          {(activeSection === 'all' || activeSection === 'early') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Starting Items */}
              <div className="p-5 bg-dota-dark-900/90 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-cinzel font-bold text-base text-white">
                      Starting Items (0:00 - 3:00)
                    </h4>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    Laning Phase
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {startingItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setActiveItemModal(item)}
                      className="p-2.5 rounded-lg bg-dota-dark-850 border border-white/5 hover:border-emerald-400/50 cursor-pointer transition-all"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full aspect-[16/11] rounded object-cover border border-white/10 mb-1"
                      />
                      <span className="font-outfit font-semibold text-xs text-slate-200 truncate block">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Coins className="w-2.5 h-2.5" />
                        {item.cost} Gold
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Early Game Items */}
              <div className="p-5 bg-dota-dark-900/90 rounded-2xl border border-sky-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <h4 className="font-cinzel font-bold text-base text-white">
                      Early Game Items (3:00 - 15:00)
                    </h4>
                  </div>
                  <span className="text-[11px] text-sky-400 font-mono font-semibold">
                    Boots & Core Stats
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {earlyItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setActiveItemModal(item)}
                      className="p-2.5 rounded-lg bg-dota-dark-850 border border-white/5 hover:border-sky-400/50 cursor-pointer transition-all"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full aspect-[16/11] rounded object-cover border border-white/10 mb-1"
                      />
                      <span className="font-outfit font-semibold text-xs text-slate-200 truncate block">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-sky-400 flex items-center gap-1 mt-0.5">
                        <Coins className="w-2.5 h-2.5" />
                        {item.cost} Gold
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* 4. LATE GAME & LUXURY EXTENSION           */}
          {/* ========================================= */}
          {(activeSection === 'all' || activeSection === 'late') && (
            <div className="p-5 sm:p-6 bg-dota-dark-900/90 rounded-2xl border border-purple-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="font-cinzel font-bold text-base text-white">
                    Late Game & Luxury Extension (30:00+ min)
                  </h4>
                </div>
                <span className="text-[11px] text-purple-400 font-mono font-semibold">
                  6-Slot End Game
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {lateItems.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setActiveItemModal(item)}
                    className="p-2.5 rounded-xl bg-dota-dark-850 border border-white/5 hover:border-purple-400/50 cursor-pointer transition-all"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full aspect-[16/11] rounded-lg object-cover border border-white/10 mb-1.5"
                    />
                    <span className="font-outfit font-bold text-xs text-white truncate block">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-mono text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Coins className="w-2.5 h-2.5" />
                      {item.cost} Gold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Item Details Popover / Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setActiveItemModal(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-dota-dark-900 border border-dota-gold/40 rounded-2xl shadow-2xl p-5 sm:p-6 z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <img
                src={activeItemModal.img}
                alt={activeItemModal.name}
                className="w-20 h-14 rounded-lg object-cover border-2 border-dota-gold/40 shadow-glow-gold shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {activeItemModal.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-dota-gold font-mono font-bold mt-1">
                  <Coins className="w-4 h-4 text-dota-gold" />
                  <span>Cost: {activeItemModal.cost} Gold</span>
                </div>
              </div>
              <button
                onClick={() => setActiveItemModal(null)}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Attributes */}
            {activeItemModal.attrib && activeItemModal.attrib.length > 0 && (
              <div className="p-3 rounded-lg bg-dota-dark-850 border border-white/5 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                  Bonus Attributes:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-outfit text-slate-200">
                  {activeItemModal.attrib.map((attr, idx) => (
                    <span
                      key={idx}
                      className="bg-dota-dark-950 px-2 py-0.5 rounded border border-white/5"
                    >
                      +{attr.value} {attr.key.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Abilities / Effects */}
            {activeItemModal.abilities && activeItemModal.abilities.length > 0 && (
              <div className="flex flex-col gap-2">
                {activeItemModal.abilities.map((ab, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-dota-dark-850 border border-white/5"
                  >
                    <span className="font-outfit font-bold text-xs text-dota-gold">
                      {ab.type?.toUpperCase()}: {ab.title}
                    </span>
                    <p className="text-xs text-slate-300 font-outfit mt-1 whitespace-pre-line">
                      {ab.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Lore */}
            {activeItemModal.lore && (
              <p className="text-xs text-slate-400 italic font-serif border-t border-white/5 pt-3">
                "{activeItemModal.lore}"
              </p>
            )}

            <button
              onClick={() => setActiveItemModal(null)}
              className="btn btn-sm btn-primary text-dota-dark-950 font-bold font-outfit self-end"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
