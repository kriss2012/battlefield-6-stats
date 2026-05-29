/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: index.ts
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
// Player Types
export interface Player {
  id: string;
  name: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  userName?: string;
  kills?: number;
  deaths?: number;
  wins?: number;
  losses?: number;
  accuracy?: number;
  score?: number;
  avatar?: string;
  classes?: Array<{
    className?: string;
    kills?: number;
  }>;
  [key: string]: unknown;
}

// Server Types
export interface Server {
  serverId?: string;
  id?: string;
  prefix?: string;
  name?: string;
  playerAmount?: number;
  playerCount?: number;
  maxPlayers?: number;
  currentMap?: string;
  map?: string;
  mode?: string;
  region?: string;
  progress?: number;
  url?: string;
  latency?: number;
}

export interface DetailedServer extends Server {
  description?: string;
  settings?: Record<string, string | number | boolean>;
  rotation?: string[];
  // Add more fields based on actual API response
}

// Content Types
export interface DLC {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

export interface GameEvent {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Translation {
  [key: string]: string;
}
