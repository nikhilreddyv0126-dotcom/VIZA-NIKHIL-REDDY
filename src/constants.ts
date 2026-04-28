import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Electric Pulse',
    artist: 'Neural Synth',
    coverUrl: 'https://picsum.photos/seed/electric1/400/400',
    duration: 180,
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Aether Drift',
    coverUrl: 'https://picsum.photos/seed/neon2/400/400',
    duration: 240,
  },
  {
    id: '3',
    title: 'Cyber Drive',
    artist: 'Glitch Core',
    coverUrl: 'https://picsum.photos/seed/cyber3/400/400',
    duration: 150,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 100;
