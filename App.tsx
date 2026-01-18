import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { AppState, ArtworkData, MuseumTheme } from './types';
import { generateMuseumContent } from './services/geminiService';
import { Player } from './components/Player';
import { MuseumRoom } from './components/MuseumRoom';
import { Artwork } from './components/Artwork';
import { Overlay } from './components/Overlay';
import { CrosshairRaycaster } from './components/CrosshairRaycaster';
import { ROOM_DEPTH } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [theme, setTheme] = useState<MuseumTheme | null>(null);
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(null);


  // Input State for Mobile/Cross-component controls
  const inputRef = React.useRef({
    moveVector: { x: 0, z: 0 },
    lookDelta: { x: 0, y: 0 },
    isInteracting: false
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|ipad|iphone|ipod/i.test(userAgent.toLowerCase())) {
        return true;
      }
      return window.innerWidth < 768; // Fallback for simple testing
    };
    setIsMobile(checkMobile());
  }, []);
  useEffect(() => {
    const initMuseum = async () => {
      // Fetch generative content from Gemini
      const content = await generateMuseumContent();
      setTheme(content.theme);
      setArtworks(content.artworks);
      setAppState(AppState.PLAYING);
    };

    initMuseum();
  }, []);

  // Interaction Cooldown Ref to prevent immediate re-selection after closing
  const lastInteractionTime = React.useRef(0);

  const handleArtworkSelect = (artwork: ArtworkData) => {
    // Cooldown check (prevent selection within 2s of closing)
    if (Date.now() - lastInteractionTime.current < 2000) return;

    setSelectedArtwork(artwork);
    setAppState(AppState.INSPECTING);
    document.exitPointerLock(); // Free cursor for modal interaction
  };

  const handleCloseArtwork = () => {
    lastInteractionTime.current = Date.now(); // Set cooldown start time
    setSelectedArtwork(null);
    setAppState(AppState.PLAYING);
  };

  // Start position: Near the entrance (Positive Z), looking towards the end (Negative Z)
  const startZ = ROOM_DEPTH / 2 - 5;

  return (
    <>
      {/* 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 1.7, startZ], fov: 75 }}
        className="w-full h-full bg-[#f0f0f0]"
        style={{ pointerEvents: appState === AppState.INSPECTING ? 'none' : 'auto' }}
      >
        {/* Environment Settings - Bright & Airy */}
        <color attach="background" args={['#f0f0f0']} />
        <fog attach="fog" args={['#f0f0f0', 5, 40]} />

        <Suspense fallback={null}>
          <MuseumRoom isMobile={isMobile} />

          {artworks.map((art) => (
            <Artwork
              key={art.id}
              data={art}
              onSelect={handleArtworkSelect}
              isHovered={hoveredId === art.id}
              setHoveredId={setHoveredId}
            />
          ))}

          <Player
            appState={appState}
            setAppState={setAppState}
            inputRef={inputRef}
            isMobile={isMobile}
          />

          {/* Mobile Crosshair Raycaster - Detects artwork at screen center */}
          {isMobile && <CrosshairRaycaster setHoveredId={setHoveredId} enabled={appState === AppState.PLAYING} />}

          {/* Phase 3: Post-Processing Effects - Desktop Only */}
          {!isMobile && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.9} // Only very bright things glow
                luminanceSmoothing={0.025}
                height={300}
                intensity={0.4}
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      {/* 2D UI Layer */}
      <Overlay
        appState={appState}
        setAppState={setAppState}
        hoveredId={hoveredId}
        selectedArtwork={selectedArtwork}
        onCloseArtwork={handleCloseArtwork}
        theme={theme}
        inputRef={inputRef}
        isMobile={isMobile}
        artworks={artworks}
        onSelectArtwork={handleArtworkSelect}
      />

      <Loader />
    </>
  );
};

export default App;