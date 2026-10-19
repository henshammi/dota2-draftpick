import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Swords } from 'lucide-react';

export default function HeroSelectModal({
  isOpen,
  onClose,
  onSelectHero,
  allHeroes = [],
  excludedHeroIds = [],
  title = "Pilih Hero",
  subtitle = "Pilih hero dari daftar 127 hero Dota 2"
}) {
  const [search, setSearch] = useState('');
  const [selectedAttr, setSelectedAttr] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedAttr('all');
      setSelectedRole('all');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const excludedSet = useMemo(() => new Set(excludedHeroIds), [excludedHeroIds]);

  const filteredHeroes = useMemo(() => {
    return allHeroes.filter((hero) => {
      if (excludedSet.has(hero.id)) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = hero.localized_name.toLowerCase().includes(query);
        const matchesRole = hero.roles?.some(r => r.toLowerCase().includes(query));
        if (!matchesName && !matchesRole) return false;
      }

      if (selectedAttr !== 'all') {
        if (selectedAttr === 'uni' && hero.primary_attr !== 'all') return false;
        if (selectedAttr !== 'uni' && hero.primary_attr !== selectedAttr) return false;
      }

      if (selectedRole !== 'all') {
        if (!hero.roles?.includes(selectedRole)) return false;
      }

      return true;
    });
  }, [allHeroes, excludedSet, search, selectedAttr, selectedRole]);

  if (!isOpen) return null;

  const getAttrColor = (attr) => {
    switch (attr) {
      case 'str': return 'text-red-400 bg-red-950/60 border-red-500/40';
      case 'agi': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'int': return 'text-sky-400 bg-sky-950/60 border-sky-500/40';
      case 'all': return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const getAttrLabel = (attr) => {
    switch (attr) {
      case 'str': return 'Strength';
      case 'agi': return 'Agility';
      case 'int': return 'Intelligence';
      case 'all': return 'Universal';
      default: return attr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-dota-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-dota-dark-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-dota-gold/10 border border-dota-gold/30 text-dota-gold">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">{title}</h3>
              <p className="text-xs text-slate-400 font-outfit">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-dota-dark-800/80 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari hero atau role (misal: Axe, Carry, Disabler)..."
              className="input input-sm sm:input-md w-full pl-9 bg-dota-dark-950 border-white/10 focus:border-dota-gold text-slate-200 placeholder:text-slate-500 rounded-lg text-xs sm:text-sm"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Attribute Pills (Horizontal swipeable on mobile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedAttr('all')}
              className={`btn btn-xs sm:btn-sm font-outfit shrink-0 ${
                selectedAttr === 'all' ? 'btn-primary font-bold' : 'btn-ghost text-slate-300'
              }`}
            >
              Semua Attr
            </button>
            <button
              onClick={() => setSelectedAttr('str')}
              className={`btn btn-xs sm:btn-sm border shrink-0 ${
                selectedAttr === 'str'
                  ? 'bg-red-500 text-white font-bold border-red-400'
                  : 'btn-ghost text-red-400 border-red-500/20 hover:bg-red-950/40'
              }`}
            >
              STR
            </button>
            <button
              onClick={() => setSelectedAttr('agi')}
              className={`btn btn-xs sm:btn-sm border shrink-0 ${
                selectedAttr === 'agi'
                  ? 'bg-emerald-500 text-white font-bold border-emerald-400'
                  : 'btn-ghost text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/40'
              }`}
            >
              AGI
            </button>
            <button
              onClick={() => setSelectedAttr('int')}
              className={`btn btn-xs sm:btn-sm border shrink-0 ${
                selectedAttr === 'int'
                  ? 'bg-sky-500 text-white font-bold border-sky-400'
                  : 'btn-ghost text-sky-400 border-sky-500/20 hover:bg-sky-950/40'
              }`}
            >
              INT
            </button>
            <button
              onClick={() => setSelectedAttr('uni')}
              className={`btn btn-xs sm:btn-sm border shrink-0 ${
                selectedAttr === 'uni'
                  ? 'bg-purple-500 text-white font-bold border-purple-400'
                  : 'btn-ghost text-purple-400 border-purple-500/20 hover:bg-purple-950/40'
              }`}
            >
              UNI
            </button>
          </div>
        </div>

        {/* Hero Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredHeroes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-outfit">Tidak ada hero yang sesuai dengan pencarian "{search}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredHeroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => {
                    onSelectHero(hero);
                    onClose();
                  }}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-dota-dark-850 border border-white/5 hover:border-dota-gold/60 hover:shadow-glow-gold hover:-translate-y-1 transition-all duration-200 text-left"
                >
                  {/* Hero Portrait */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-dota-dark-950">
                    <img
                      src={hero.img_url}
                      alt={hero.localized_name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Attribute badge overlay */}
                    <span className={`absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded border ${getAttrColor(hero.primary_attr)}`}>
                      {getAttrLabel(hero.primary_attr).slice(0, 3).toUpperCase()}
                    </span>
                  </div>

                  {/* Hero Info */}
                  <div className="p-2.5">
                    <h4 className="font-outfit font-bold text-sm text-white group-hover:text-dota-gold transition-colors truncate">
                      {hero.localized_name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-outfit">
                      <span className="truncate">{hero.roles?.[0] || 'Hero'}</span>
                      <span className="text-emerald-400 font-semibold">{hero.overall_winrate}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-dota-dark-950 border-t border-white/10 text-center text-xs text-slate-500 font-outfit">
          Menampilkan <span className="text-slate-300 font-bold">{filteredHeroes.length}</span> hero Dota 2
        </div>

      </div>
    </div>
  );
}
