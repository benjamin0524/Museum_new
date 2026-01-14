export interface ArtworkData {
  id: number;
  title: string;
  description: string;
  artist: string;
  year: string;
  imageUrl: string; // Placeholder URL
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface MuseumTheme {
  name: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppState {
  LOADING,
  PLAYING,
  INSPECTING, // Looking closely at an artwork
  ERROR
}

export interface InputState {
  moveVector: { x: number, z: number }; // Normalized -1 to 1. Z is forward/back
  lookDelta: { x: number, y: number };  // Pixel delta
  isInteracting: boolean;
}