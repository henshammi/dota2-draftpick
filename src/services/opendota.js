// Service layer for OpenDota API with caching and counter-pick calculations

const OPENDOTA_BASE = 'https://api.opendota.com/api';
const STEAM_CDN = 'https://cdn.cloudflare.steamstatic.com';

// In-memory cache for fast repeated lookups
const memoryCache = {
  heroes: null,
  items: null,
  matchups: {},
  itemPopularity: {},
};

/**
 * Get Steam CDN full URL for images
 */
export function getFullImgUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STEAM_CDN}${path}`;
}

/**
 * Fetch all Dota 2 hero stats from OpenDota (cached)
 */
export async function getHeroStats() {
  if (memoryCache.heroes) return memoryCache.heroes;

  const storageKey = 'opendota_hero_stats_v1';
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 12) { // 12 hours cache
        memoryCache.heroes = parsed.data;
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  try {
    const res = await fetch(`${OPENDOTA_BASE}/heroStats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Enrich heroes with full CDN image URLs
    const formatted = data.map(h => ({
      ...h,
      img_url: getFullImgUrl(h.img),
      icon_url: getFullImgUrl(h.icon),
      overall_winrate: h.pub_pick > 0 ? ((h.pub_win / h.pub_pick) * 100).toFixed(1) : '50.0',
    }));

    memoryCache.heroes = formatted;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now(), data: formatted }));
    } catch (_) {}

    return formatted;
  } catch (err) {
    console.error('Failed to fetch heroStats:', err);
    throw err;
  }
}

/**
 * Fetch Item constants from OpenDota (cached)
 * Returns { itemsByName, itemsById, itemIds }
 */
export async function getItemConstants() {
  if (memoryCache.items) return memoryCache.items;

  const storageKey = 'opendota_items_constants_v2';
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 24) { // 24 hours
        memoryCache.items = parsed.data;
        return parsed.data;
      }
    }
  } catch (e) {}

  try {
    const [itemsRes, idsRes] = await Promise.all([
      fetch(`${OPENDOTA_BASE}/constants/items`),
      fetch(`${OPENDOTA_BASE}/constants/item_ids`).catch(() => null),
    ]);

    if (!itemsRes.ok) throw new Error(`HTTP ${itemsRes.status}`);
    const itemsData = await itemsRes.json();
    const idsData = idsRes && idsRes.ok ? await idsRes.json() : {};

    const itemsByName = {};
    const itemsById = {};

    Object.entries(itemsData).forEach(([key, item]) => {
      const enriched = {
        ...item,
        key,
        img_url: getFullImgUrl(item.img),
      };
      itemsByName[key] = enriched;
      if (item.id !== undefined) {
        itemsById[item.id] = enriched;
      }
    });

    // Ensure item_ids fallback mapping
    Object.entries(idsData).forEach(([id, name]) => {
      if (itemsByName[name] && !itemsById[id]) {
        itemsById[id] = itemsByName[name];
      }
    });

    const bundle = {
      itemsByName,
      itemsById,
      itemIds: idsData,
    };

    memoryCache.items = bundle;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now(), data: bundle }));
    } catch (_) {}

    return bundle;
  } catch (err) {
    console.error('Failed to fetch item constants:', err);
    return { itemsByName: {}, itemsById: {}, itemIds: {} };
  }
}


/**
 * Fetch head-to-head matchups for a specific hero
 */
export async function getHeroMatchups(heroId) {
  if (!heroId) return [];
  if (memoryCache.matchups[heroId]) return memoryCache.matchups[heroId];

  const storageKey = `opendota_matchups_${heroId}_v1`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 6) { // 6 hours
        memoryCache.matchups[heroId] = parsed.data;
        return parsed.data;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`${OPENDOTA_BASE}/heroes/${heroId}/matchups`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    memoryCache.matchups[heroId] = data;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (_) {}

    return data;
  } catch (err) {
    console.error(`Failed to fetch matchups for hero ${heroId}:`, err);
    return [];
  }
}

/**
 * Fetch item popularity breakdown for a hero (starting, early, mid, late)
 */
export async function getHeroItemPopularity(heroId) {
  if (!heroId) return null;
  if (memoryCache.itemPopularity[heroId]) return memoryCache.itemPopularity[heroId];

  const storageKey = `opendota_item_popularity_${heroId}_v1`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 1000 * 60 * 60 * 6) {
        memoryCache.itemPopularity[heroId] = parsed.data;
        return parsed.data;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`${OPENDOTA_BASE}/heroes/${heroId}/itemPopularity`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    memoryCache.itemPopularity[heroId] = data;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (_) {}

    return data;
  } catch (err) {
    console.error(`Failed to fetch item popularity for hero ${heroId}:`, err);
    return null;
  }
}

/**
 * Calculate Counter-Pick recommendations against an enemy lineup
 * @param {Array} enemyHeroes - Array of selected enemy hero objects
 * @param {Array} allHeroes - Array of all 127 Dota 2 heroes
 * @param {Function} onProgress - Optional callback for loading states
 * @returns {Object} { topCounters, worstMatchups, enemyThreats }
 */
export async function calculateCounterPicks(enemyHeroes, allHeroes) {
  if (!enemyHeroes || enemyHeroes.length === 0 || !allHeroes || allHeroes.length === 0) {
    return { topCounters: [], worstMatchups: [] };
  }

  const enemyIds = new Set(enemyHeroes.map(e => e.id));
  const enemyMatchupsData = {};

  // Fetch matchup data for all selected enemy heroes in parallel
  await Promise.all(
    enemyHeroes.map(async (enemy) => {
      const matchups = await getHeroMatchups(enemy.id);
      enemyMatchupsData[enemy.id] = matchups;
    })
  );

  // Map to hold cumulative score for each potential counter hero
  const candidateScores = [];

  for (const hero of allHeroes) {
    // Cannot pick a hero already on the enemy team
    if (enemyIds.has(hero.id)) continue;

    let totalAdvantage = 0;
    let totalGames = 0;
    const matchupsVsEnemies = [];

    for (const enemy of enemyHeroes) {
      const matchupsList = enemyMatchupsData[enemy.id] || [];
      const match = matchupsList.find(m => m.hero_id === hero.id);

      if (match && match.games_played >= 10) {
        // match.wins is the number of times Enemy won against Candidate Hero.
        // Therefore, Candidate Hero's winrate vs Enemy is (games_played - wins) / games_played.
        const candidateWins = match.games_played - match.wins;
        const candidateWinrate = (candidateWins / match.games_played) * 100;
        const advantage = candidateWinrate - 50.0; // Positive = favors candidate

        totalAdvantage += advantage;
        totalGames += match.games_played;

        matchupsVsEnemies.push({
          enemyName: enemy.localized_name,
          enemyIcon: enemy.icon_url,
          winrate: candidateWinrate.toFixed(1),
          advantage: advantage.toFixed(1),
          games: match.games_played,
        });
      }
    }

    if (matchupsVsEnemies.length > 0) {
      const avgAdvantage = totalAdvantage / matchupsVsEnemies.length;
      candidateScores.push({
        hero,
        avgAdvantage: Number(avgAdvantage.toFixed(2)),
        totalGames,
        matchupsVsEnemies: matchupsVsEnemies.sort((a, b) => parseFloat(b.advantage) - parseFloat(a.advantage)),
      });
    }
  }

  // Sort candidates by highest average advantage
  candidateScores.sort((a, b) => b.avgAdvantage - a.avgAdvantage);

  const topCounters = candidateScores.slice(0, 16);
  const worstMatchups = [...candidateScores].reverse().slice(0, 8);

  return { topCounters, worstMatchups };
}
