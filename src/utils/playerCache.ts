/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: playerCache.ts
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
// Player name cache and search utilities

interface CachedPlayer {
  name: string;
  platform?: string;
  lastSearched: number;
}

const CACHE_KEY = 'bf6_player_cache_v2'; // Changed to v2 to clear old bad data
const MAX_CACHE_SIZE = 100;

export class PlayerCache {
  private static getCache(): CachedPlayer[] {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }

  private static setCache(players: CachedPlayer[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(players));
    } catch {
      // Ignore storage errors
    }
  }

  static addPlayer(name: string, platform?: string): void {
    const cache = this.getCache();

    // Remove existing entry if present
    const filtered = cache.filter(p => p.name.toLowerCase() !== name.toLowerCase());

    // Add to front with timestamp
    filtered.unshift({
      name,
      platform,
      lastSearched: Date.now(),
    });

    // Limit cache size
    if (filtered.length > MAX_CACHE_SIZE) {
      filtered.length = MAX_CACHE_SIZE;
    }

    this.setCache(filtered);
  }

  static searchPlayers(query: string, limit = 10): CachedPlayer[] {
    if (!query || query.length < 1) return [];

    const cache = this.getCache();
    const lowerQuery = query.toLowerCase();

    // Score-based matching
    const matches = cache
      .map(player => {
        const lowerName = player.name.toLowerCase();
        let score = 0;

        // Exact match
        if (lowerName === lowerQuery) {
          score = 100;
        }
        // Starts with
        else if (lowerName.startsWith(lowerQuery)) {
          score = 80;
        }
        // Contains
        else if (lowerName.includes(lowerQuery)) {
          score = 60;
        }
        // Fuzzy match (each char in order)
        else {
          let queryIndex = 0;
          for (let i = 0; i < lowerName.length && queryIndex < lowerQuery.length; i++) {
            if (lowerName[i] === lowerQuery[queryIndex]) {
              queryIndex++;
              score += 5;
            }
          }
          if (queryIndex < lowerQuery.length) {
            score = 0; // Not all chars found
          }
        }

        // Boost recent searches
        const daysSince = (Date.now() - player.lastSearched) / (1000 * 60 * 60 * 24);
        if (daysSince < 1) score += 15;
        else if (daysSince < 7) score += 8;
        else if (daysSince < 30) score += 3;

        return { player, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => m.player);

    return matches;
  }

  static getRecentSearches(limit = 5): CachedPlayer[] {
    return this.getCache().slice(0, limit);
  }

  static getAllPlayers(): CachedPlayer[] {
    return this.getCache();
  }

  static getPlayerCount(): number {
    return this.getCache().length;
  }

  static clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
  }
}
