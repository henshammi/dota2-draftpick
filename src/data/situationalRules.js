// Situational item recommendations based on enemy hero traits and threats

export const SITUATIONAL_RULES = [
  {
    id: 'evasion',
    name: 'Counter Evasion & Blind',
    description: 'Musuh memiliki Evasion alami atau membeli item Evasion (Butterfly, Radiance, Solar Crest).',
    enemyHeroes: ['Phantom Assassin', 'Windranger', 'Brewmaster', 'Riki', 'Tinker', 'Keeper of the Light', 'Arc Warden'],
    recommendedItems: [
      {
        itemKey: 'monkey_king_bar',
        name: 'Monkey King Bar',
        cost: 4975,
        img: '/apps/dota2/images/dota_react/items/monkey_king_bar.png',
        reason: 'Memberikan Pierce True Strike 80% dan bonus magic damage untuk menembus Evasion / Windrun / Blur.'
      },
      {
        itemKey: 'bloodthorn',
        name: 'Bloodthorn',
        cost: 6825,
        img: '/apps/dota2/images/dota_react/items/bloodthorn.png',
        reason: 'Semua serangan ke target yang terkena Silence akan 100% True Strike dan menghasilkan bonus damage.'
      }
    ]
  },
  {
    id: 'passives',
    name: 'Break Passive Abilities',
    description: 'Musuh sangat bergantung pada skill pasif mematikan / tanky.',
    enemyHeroes: ['Bristleback', 'Spectre', 'Huskar', 'Phantom Assassin', 'Timbersaw', 'Viper', 'Abaddon', 'Tidehunter', 'Dragon Knight', 'Mars'],
    recommendedItems: [
      {
        itemKey: 'silver_edge',
        name: 'Silver Edge',
        cost: 5450,
        img: '/apps/dota2/images/dota_react/items/silver_edge.png',
        reason: 'Serangan dari invis mengaplikasikan Break selama 5 detik, menonaktifkan pasif musuh (misal damage reduction Bristleback/Spectre).'
      }
    ]
  },
  {
    id: 'heavy_magic',
    name: 'Magic Immunity & Magic Resistance',
    description: 'Musuh memiliki burst magic damage atau disable magic beruntun.',
    enemyHeroes: ['Lion', 'Lina', 'Skywrath Mage', 'Zeus', 'Storm Spirit', 'Invoker', 'Tinker', 'Leshrac', 'Pugna', 'Jakiro', 'Queen of Pain'],
    recommendedItems: [
      {
        itemKey: 'black_king_bar',
        name: 'Black King Bar (BKB)',
        cost: 4050,
        img: '/apps/dota2/images/dota_react/items/black_king_bar.png',
        reason: 'Debuff Immunity dan 50% Magic Resistance. Wajib untuk bertahan dari rotasi skill dan stun magic musuh.'
      },
      {
        itemKey: 'pipe',
        name: 'Pipe of Insight',
        cost: 3725,
        img: '/apps/dota2/images/dota_react/items/pipe.png',
        reason: 'Memberikan magic barrier 450 HP untuk seluruh tim. Sangat efektif melawan AOE magic spam musuh.'
      },
      {
        itemKey: 'glimmer_cape',
        name: 'Glimmer Cape',
        cost: 2150,
        img: '/apps/dota2/images/dota_react/items/glimmer_cape.png',
        reason: 'Invisibilitas + barrier penyerap magic damage 300 HP. Pilihan situasional terbaik untuk support.'
      },
      {
        itemKey: 'mage_slayer',
        name: 'Mage Slayer',
        cost: 2625,
        img: '/apps/dota2/images/dota_react/items/mage_slayer.png',
        reason: 'Mengurangi spell damage musuh sebesar 40% saat diserang dan memberikan magic resistance pasif.'
      }
    ]
  },
  {
    id: 'high_healing',
    name: 'Anti-Heal & HP Regen Reduction',
    description: 'Musuh memiliki lifesteal masif, regenerasi instan, atau heal tebal.',
    enemyHeroes: ['Alchemist', 'Morphling', 'Slark', 'Necrophos', 'Huskar', 'Dazzle', 'Omniknight', 'Witch Doctor', 'Io', 'Lifestealer', 'Pudge', 'Abaddon'],
    recommendedItems: [
      {
        itemKey: 'spirit_vessel',
        name: 'Spirit Vessel',
        cost: 2790,
        img: '/apps/dota2/images/dota_react/items/spirit_vessel.png',
        reason: 'Mengurangi regenerasi dan heal musuh hingga 45% serta memberikan damage persentase HP musuh.'
      },
      {
        itemKey: 'shivas_guard',
        name: 'Shiva\'s Guard',
        cost: 4825,
        img: '/apps/dota2/images/dota_react/items/shivas_guard.png',
        reason: 'Aura pasif mengurangi regenerasi HP musuh sebesar 25%, plus blast slow dan damage amplification.'
      },
      {
        itemKey: 'skadi',
        name: 'Eye of Skadi',
        cost: 5300,
        img: '/apps/dota2/images/dota_react/items/skadi.png',
        reason: 'Serangan mengurangi attack speed, movement speed, dan efektivitas heal/regen musuh hingga 40%.'
      }
    ]
  },
  {
    id: 'single_target_lockdown',
    name: 'Spell Block & Spell Reflection',
    description: 'Musuh memiliki skill targeted mematikan (Duel, Doom, Roar, Fiend\'s Grip, Laguna Blade).',
    enemyHeroes: ['Legion Commander', 'Doom', 'Beastmaster', 'Bane', 'Batrider', 'Spirit Breaker', 'Bloodseeker', 'Lina', 'Vengeful Spirit'],
    recommendedItems: [
      {
        itemKey: 'sphere',
        name: 'Linken\'s Sphere',
        cost: 4800,
        img: '/apps/dota2/images/dota_react/items/sphere.png',
        reason: 'Secara otomatis memblokir satu target spell berbahaya musuh setiap 14 detik.'
      },
      {
        itemKey: 'lotus_orb',
        name: 'Lotus Orb',
        cost: 3850,
        img: '/apps/dota2/images/dota_react/items/lotus_orb.png',
        reason: 'Menghilangkan debuff (basic dispel) dan memantulkan kembali targeted spell ke arah musuh.'
      }
    ]
  },
  {
    id: 'illusions_summons',
    name: 'AOE & Illusion Clear',
    description: 'Musuh mengandalkan pasukan ilusi, kloning, atau unit summon tebal.',
    enemyHeroes: ['Phantom Lancer', 'Naga Siren', 'Chaos Knight', 'Terrorblade', 'Meepo', 'Broodmother', 'Chen', 'Beastmaster', 'Enigma', 'Nature\'s Prophet'],
    recommendedItems: [
      {
        itemKey: 'mjollnir',
        name: 'Mjollnir',
        cost: 5500,
        img: '/apps/dota2/images/dota_react/items/mjollnir.png',
        reason: 'Chain lightning procs cepat membersihkan kawanan ilusi, ditambah Static Shield aktif saat diserang banyak unit.'
      },
      {
        itemKey: 'bfury',
        name: 'Battle Fury',
        cost: 4100,
        img: '/apps/dota2/images/dota_react/items/bfury.png',
        reason: 'Cleave damage fisik 70% untuk hero melee guna menyapu ilusi Phantom Lancer / Naga.'
      },
      {
        itemKey: 'radiance',
        name: 'Radiance',
        cost: 4700,
        img: '/apps/dota2/images/dota_react/items/radiance.png',
        reason: 'Burn damage area berkelanjutan dan memberikan 15% miss chance ke seluruh ilusi/musuh sekitar.'
      },
      {
        itemKey: 'shivas_guard',
        name: 'Shiva\'s Guard',
        cost: 4825,
        img: '/apps/dota2/images/dota_react/items/shivas_guard.png',
        reason: 'AOE Arctic Blast 200 damage + slow berat yang langsung memperlihatkan hero asli di antara ilusi.'
      }
    ]
  },
  {
    id: 'slippery_mobility',
    name: 'Lockdown & Instant Disable',
    description: 'Musuh sangat licin dengan blink, invis, atau mobilitas tinggi.',
    enemyHeroes: ['Anti-Mage', 'Storm Spirit', 'Ember Spirit', 'Void Spirit', 'Weaver', 'Slark', 'Puck', 'Queen of Pain', 'Riki', 'Bounty Hunter', 'Clinkz'],
    recommendedItems: [
      {
        itemKey: 'sheepstick',
        name: 'Scythe of Vyse (Hex)',
        cost: 5500,
        img: '/apps/dota2/images/dota_react/items/sheepstick.png',
        reason: 'Instant hex disable instan 2.8 detik tanpa projectile. Musuh tidak sempat Blink, BKB, atau kabur.'
      },
      {
        itemKey: 'orchid',
        name: 'Orchid Malevolence',
        cost: 3475,
        img: '/apps/dota2/images/dota_react/items/orchid.png',
        reason: 'Silence instan 5 detik untuk mengunci caster licin sebelum mereka sempat menggunakan skill escape.'
      },
      {
        itemKey: 'abyssal_blade',
        name: 'Abyssal Blade',
        cost: 6250,
        img: '/apps/dota2/images/dota_react/items/abyssal_blade.png',
        reason: 'Targeted stun 2 detik yang menembus BKB (Debuff Immunity Piercing) untuk hero melee.'
      },
      {
        itemKey: 'nullifier',
        name: 'Nullifier',
        cost: 4375,
        img: '/apps/dota2/images/dota_react/items/nullifier.png',
        reason: 'Terus-menerus mendispel item escape musuh (Ghost Scepter, Glimmer, Force Staff, Eul\'s, Aeon Disk).'
      }
    ]
  },
  {
    id: 'heavy_physical_burst',
    name: 'Physical Armor & Save',
    description: 'Musuh memiliki damage fisik tinggi dan one-shot burst.',
    enemyHeroes: ['Phantom Assassin', 'Sven', 'Ursa', 'Templar Assassin', 'Drow Ranger', 'Sniper', 'Juggernaut', 'Clinkz'],
    recommendedItems: [
      {
        itemKey: 'ghost',
        name: 'Ghost Scepter',
        cost: 1500,
        img: '/apps/dota2/images/dota_react/items/ghost.png',
        reason: 'Menjadi kebal terhadap semua serangan fisik selama 4 detik. Penyelamat utama support dari carry fisik.'
      },
      {
        itemKey: 'blade_mail',
        name: 'Blade Mail',
        cost: 2100,
        img: '/apps/dota2/images/dota_react/items/blade_mail.png',
        reason: 'Memantulkan 80% damage kembali ke musuh. Sangat efektif memaksa carry musuh berhenti memukul.'
      },
      {
        itemKey: 'heavens_halberd',
        name: 'Heaven\'s Halberd',
        cost: 3550,
        img: '/apps/dota2/images/dota_react/items/heavens_halberd.png',
        reason: 'Disarm carry musuh selama 3 detik (melee) / 5 detik (ranged). Tidak bisa didispel bahkan dengan BKB!'
      },
      {
        itemKey: 'assault',
        name: 'Assault Cuirass',
        cost: 5125,
        img: '/apps/dota2/images/dota_react/items/assault.png',
        reason: 'Aura +5 Armor untuk teman dan -5 Armor untuk musuh, ditambah +30 attack speed.'
      }
    ]
  }
];

// Helper to evaluate which situational items are relevant against an enemy team lineup
export function evaluateSituationalItems(enemyHeroesList = []) {
  if (!enemyHeroesList || enemyHeroesList.length === 0) return [];

  const matchedRules = [];
  const enemyNames = enemyHeroesList.map(h => (typeof h === 'string' ? h : h.localized_name));

  for (const rule of SITUATIONAL_RULES) {
    const triggeringEnemies = enemyNames.filter(name => rule.enemyHeroes.includes(name));
    if (triggeringEnemies.length > 0) {
      matchedRules.push({
        ...rule,
        triggeringEnemies,
      });
    }
  }

  return matchedRules;
}
