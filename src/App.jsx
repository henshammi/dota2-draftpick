import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EnemyDraftPicker from './components/EnemyDraftPicker';
import CounterRecommendations from './components/CounterRecommendations';
import ItemGuide from './components/ItemGuide';
import MetaTierList from './components/MetaTierList';
import HeroSelectModal from './components/HeroSelectModal';
import { getHeroStats, calculateCounterPicks } from './services/opendota';
import { evaluateSituationalItems } from './data/situationalRules';

export default function App() {
  const [allHeroes, setAllHeroes] = useState([]);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
  
  // 5 fixed slots for enemy heroes (null means empty slot)
  const [enemyHeroes, setEnemyHeroes] = useState([null, null, null, null, null]);
  
  const [selectedPlayerHero, setSelectedPlayerHero] = useState(null);
  const [activeTab, setActiveTab] = useState('counter'); // 'counter', 'items', 'meta'
  const [skillBracket, setSkillBracket] = useState('divine_immortal');

  // Counter calculation state
  const [counterResults, setCounterResults] = useState({ topCounters: [], worstMatchups: [] });
  const [isCalculatingCounters, setIsCalculatingCounters] = useState(false);
  const [situationalThreats, setSituationalThreats] = useState([]);

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: 'enemy', // 'enemy' or 'player'
    slotIndex: null,
  });

  // Active (non-null) enemy heroes
  const activeEnemies = enemyHeroes.filter(Boolean);

  // Load all Dota 2 heroes from OpenDota on initial mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingHeroes(true);

    getHeroStats()
      .then((heroes) => {
        if (!isMounted) return;
        setAllHeroes(heroes);
        // Default selected hero (e.g. Anti-Mage, id 1, or first hero)
        const defaultHero = heroes.find((h) => h.localized_name === 'Anti-Mage') || heroes[0];
        setSelectedPlayerHero(defaultHero);
        setIsLoadingHeroes(false);
      })
      .catch((err) => {
        console.error('Failed to load Dota heroes:', err);
        if (isMounted) setIsLoadingHeroes(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Recalculate counter picks & situational threats whenever active enemies change
  useEffect(() => {
    if (allHeroes.length === 0) return;
    const currentActive = enemyHeroes.filter(Boolean);

    if (currentActive.length === 0) {
      setCounterResults({ topCounters: [], worstMatchups: [] });
      setSituationalThreats([]);
      setIsCalculatingCounters(false);
      return;
    }

    let isMounted = true;
    setIsCalculatingCounters(true);

    // Evaluate situational threat items
    const threats = evaluateSituationalItems(currentActive);
    setSituationalThreats(threats);

    // Calculate algorithmic counter picks
    calculateCounterPicks(currentActive, allHeroes)
      .then((results) => {
        if (!isMounted) return;
        setCounterResults(results);
        setIsCalculatingCounters(false);
      })
      .catch((err) => {
        console.error('Error calculating counter picks:', err);
        if (isMounted) setIsCalculatingCounters(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enemyHeroes, allHeroes]);

  // Open modal to pick an enemy hero for a specific slot
  const handleOpenEnemyModal = (slotIndex) => {
    setModalConfig({
      isOpen: true,
      mode: 'enemy',
      slotIndex: slotIndex !== undefined ? slotIndex : null,
    });
  };

  // Open modal to change player hero for item guide
  const handleOpenPlayerHeroModal = () => {
    setModalConfig({
      isOpen: true,
      mode: 'player',
      slotIndex: null,
    });
  };

  // Modal hero select callback
  const handleSelectHeroFromModal = (hero) => {
    if (modalConfig.mode === 'enemy') {
      const updated = [...enemyHeroes];
      if (modalConfig.slotIndex !== null && modalConfig.slotIndex >= 0 && modalConfig.slotIndex < 5) {
        updated[modalConfig.slotIndex] = hero;
      } else {
        // Find the first empty slot
        const emptyIdx = updated.findIndex((slot) => slot === null);
        if (emptyIdx !== -1) {
          updated[emptyIdx] = hero;
        } else {
          updated[0] = hero;
        }
      }
      setEnemyHeroes(updated);
    } else {
      setSelectedPlayerHero(hero);
    }
  };

  // Remove enemy from a specific draft slot (sets it to null)
  const handleRemoveEnemy = (slotIndex) => {
    const updated = [...enemyHeroes];
    if (slotIndex >= 0 && slotIndex < 5) {
      updated[slotIndex] = null;
      setEnemyHeroes(updated);
    }
  };

  // Clear all 5 enemy draft slots
  const handleClearEnemies = () => {
    setEnemyHeroes([null, null, null, null, null]);
  };

  // Randomize 5 popular enemy heroes for quick simulation
  const handleRandomEnemies = () => {
    if (allHeroes.length === 0) return;

    // Pick 5 distinct diverse heroes (e.g. PA, Bristleback, Lion, Invoker, Axe)
    const candidates = [
      'Phantom Assassin',
      'Bristleback',
      'Lion',
      'Invoker',
      'Axe',
      'Pudge',
      'Slark',
      'Sniper',
      'Zeus',
      'Legion Commander',
      'Windranger',
      'Storm Spirit',
    ];

    const pool = allHeroes.filter((h) => candidates.includes(h.localized_name));
    const shuffled = [...(pool.length >= 5 ? pool : allHeroes)].sort(() => 0.5 - Math.random());
    const fiveHeroes = shuffled.slice(0, 5);

    setEnemyHeroes([
      fiveHeroes[0] || null,
      fiveHeroes[1] || null,
      fiveHeroes[2] || null,
      fiveHeroes[3] || null,
      fiveHeroes[4] || null,
    ]);
  };

  // Pick a recommended counter hero and view item guide
  const handleSelectHeroForGuide = (hero) => {
    setSelectedPlayerHero(hero);
    setActiveTab('items');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excludedHeroIds = modalConfig.mode === 'enemy' ? activeEnemies.map((h) => h.id) : [];

  return (
    <div className="min-h-screen dota-bg-gradient flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        skillBracket={skillBracket}
        setSkillBracket={setSkillBracket}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        
        {/* TAB 1: COUNTER-PICKER & DRAFT STRATEGIST */}
        {activeTab === 'counter' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <EnemyDraftPicker
              enemyHeroes={enemyHeroes}
              onAddEnemy={handleOpenEnemyModal}
              onRemoveEnemy={handleRemoveEnemy}
              onClearEnemies={handleClearEnemies}
              onRandomEnemies={handleRandomEnemies}
            />

            <CounterRecommendations
              counterResults={counterResults}
              isLoading={isCalculatingCounters}
              enemyHeroes={activeEnemies}
              onSelectHeroForGuide={handleSelectHeroForGuide}
              situationalRules={situationalThreats}
            />
          </div>
        )}

        {/* TAB 2: PANDUAN ITEM (CORE VS SITUASIONAL) */}
        {activeTab === 'items' && (
          <div className="animate-fadeIn">
            <ItemGuide
              selectedHero={selectedPlayerHero}
              onOpenHeroModal={handleOpenPlayerHeroModal}
              enemyHeroes={activeEnemies}
            />
          </div>
        )}

        {/* TAB 3: META TIER LIST */}
        {activeTab === 'meta' && (
          <div className="animate-fadeIn">
            <MetaTierList
              allHeroes={allHeroes}
              onSelectHeroForGuide={handleSelectHeroForGuide}
              skillBracket={skillBracket}
            />
          </div>
        )}

      </main>

      {/* Hero Selection Modal */}
      <HeroSelectModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSelectHero={handleSelectHeroFromModal}
        allHeroes={allHeroes}
        excludedHeroIds={excludedHeroIds}
        title={modalConfig.mode === 'enemy' ? 'Pilih Hero Lawan (Dire / Opponent)' : 'Pilih Hero Anda'}
        subtitle={
          modalConfig.mode === 'enemy'
            ? 'Hero ini akan ditempatkan di slot tim lawan untuk menghitung counter pick & item situasional'
            : 'Pilih hero yang ingin Anda mainkan untuk melihat panduan item Core & Situasional'
        }
      />

      {/* Footer */}
      <footer className="w-full bg-dota-dark-950 border-t border-white/5 py-6 mt-12 text-center text-xs text-slate-500 font-outfit">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-slate-300">AEGIS DRAFT</span>
            <span>•</span>
            <span>Dota 2 Counter-Picker & Smart Item Guide</span>
          </div>
          <div>
            Data bersumber langsung dari <a href="https://docs.opendota.com/" target="_blank" rel="noopener noreferrer" className="text-dota-gold hover:underline">OpenDota API</a> & Valve Corporation CDN.
          </div>
        </div>
      </footer>

    </div>
  );
}
