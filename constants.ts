import { ArtworkData } from './types';

// Room dimensions for a Long Hallway
export const ROOM_WIDTH = 14;
export const ROOM_DEPTH = 50; 

export const MOVEMENT_SPEED = 6; // Slightly faster for the long hall
export const COLLISION_RADIUS = 0.5;

// Distribute 7 frames along the corridor
// Z-axis goes from approx -25 (End) to +25 (Entrance)
export const FRAME_LOCATIONS: Pick<ArtworkData, 'id' | 'position' | 'rotation'>[] = [
  // 1. The Focal Point (End Wall - North)
  { id: 1, position: [0, 2.5, -ROOM_DEPTH / 2 + 0.2], rotation: [0, 0, 0] }, 
  
  // West Wall (Left) - Spaced evenly from back to front
  { id: 2, position: [-ROOM_WIDTH / 2 + 0.2, 2.5, -15], rotation: [0, Math.PI / 2, 0] },
  { id: 4, position: [-ROOM_WIDTH / 2 + 0.2, 2.5, 0], rotation: [0, Math.PI / 2, 0] },
  { id: 6, position: [-ROOM_WIDTH / 2 + 0.2, 2.5, 15], rotation: [0, Math.PI / 2, 0] },

  // East Wall (Right) - Spaced evenly from back to front
  { id: 3, position: [ROOM_WIDTH / 2 - 0.2, 2.5, -15], rotation: [0, -Math.PI / 2, 0] },
  { id: 5, position: [ROOM_WIDTH / 2 - 0.2, 2.5, 0], rotation: [0, -Math.PI / 2, 0] },
  { id: 7, position: [ROOM_WIDTH / 2 - 0.2, 2.5, 15], rotation: [0, -Math.PI / 2, 0] },
];

export const INITIAL_MESSAGES: any[] = [
  { role: 'model', text: "歡迎來到無限博物館長廊。我是您的 AI 策展人。請沿著長廊漫步，探索今天為您準備的特別展覽。" }
];
