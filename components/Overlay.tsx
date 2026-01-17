import React, { useState, useEffect, useRef } from 'react';
import { AppState, ArtworkData, MuseumTheme, ChatMessage, InputState } from '../types';
import { chatWithCurator } from '../services/geminiService';
import { MobileControls } from './MobileControls';

// Import Interaction Components
import { MyopiaGame } from './interactions/MyopiaGame';
import { HearingGame } from './interactions/HearingGame';
import { DisabilityGame } from './interactions/DisabilityGame';
import { ObesityGame } from './interactions/ObesityGame';
import { FinalWall } from './interactions/FinalWall';

interface OverlayProps {
  appState: AppState;
  setAppState: (s: AppState) => void;
  hoveredId: number | null;
  selectedArtwork: ArtworkData | null;
  onCloseArtwork: () => void;
  theme: MuseumTheme | null;
  inputRef: React.MutableRefObject<InputState>;
  isMobile: boolean;
  artworks: ArtworkData[];
  onSelectArtwork: (artwork: ArtworkData) => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  appState,
  setAppState,
  hoveredId,
  selectedArtwork,
  onCloseArtwork,
  theme,
  inputRef,
  isMobile,
  artworks,
  onSelectArtwork
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedArtwork) {
      setChatHistory([]);
    }
  }, [selectedArtwork]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatting]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedArtwork) return;

    const newMessage: ChatMessage = { role: 'user', text: inputMessage };
    setChatHistory(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsChatting(true);

    // Call Gemini
    const responseText = await chatWithCurator(
      chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      newMessage.text,
      selectedArtwork
    );

    setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    setIsChatting(false);
  };

  const handleMobileInteract = () => {
    if (hoveredId) {
      const art = artworks.find(a => a.id === hoveredId);
      if (art) onSelectArtwork(art);
    }
  };

  // --- HELPER: Render Specific Interaction based on ID ---
  const renderInteraction = (id: number, onClose: () => void) => {
    switch (id) {
      case 6: // Zone 1: Myopia (Front Left)
        return <MyopiaGame onClose={onClose} />;
      case 4: // Zone 2: Hearing (Mid Left)
        return <HearingGame />;
      case 2: // Zone 3: Disability (Back Left)
        return <DisabilityGame onClose={onClose} />;
      case 3: // Zone 4: Obesity (Right Back)
        return <ObesityGame onClose={onClose} />;
      case 1: // Zone 5: Final Wall (End)
        return <FinalWall onClose={onClose} />;
      default:
        // Default filler or intro art without special game
        return null;
    }
  };

  // --- RENDERING ---

  // 1. Loading Screen (Light Mode)
  if (appState === AppState.LOADING) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f0f0] text-gray-900">
        <h1 className="text-4xl font-bold tracking-widest animate-pulse text-gray-800">身不由己 (INVOLUNTARY)</h1>
        <p className="mt-4 text-gray-600">展覽準備中...</p>
        <div className="mt-8 w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-1/2 animate-[wiggle_1s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  // 2. Artwork Inspection Modal
  if (appState === AppState.INSPECTING && selectedArtwork) {
    const CustomInteraction = renderInteraction(selectedArtwork.id, onCloseArtwork);
    // Zone 1-5 all use the optimized full-width layout
    const isOptimizedZone = [6, 4, 2, 3, 1].includes(selectedArtwork.id);

    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col md:flex-row bg-white border border-gray-200 w-full max-w-6xl max-h-[90vh] md:max-h-[95vh] rounded-lg overflow-hidden shadow-2xl">

          {/* Close Button */}
          <button
            onClick={onCloseArtwork}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 text-gray-500 hover:text-red-500 text-3xl font-bold bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
          >
            &times;
          </button>

          {/* Left: Content & Interaction */}
          <div className={`${isOptimizedZone ? 'w-full' : 'w-full md:w-3/5'} p-4 md:p-8 flex flex-col overflow-y-auto bg-gray-50 border-r border-gray-200 scrollbar-hide`}>
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">{selectedArtwork.title}</h2>
            <p className="text-sm text-gray-500 mb-4 md:mb-6">{selectedArtwork.artist}, {selectedArtwork.year}</p>

            {CustomInteraction ? (
              <div className="mb-6">
                {CustomInteraction}
              </div>
            ) : (
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-full h-48 md:h-64 object-cover rounded mb-6 border border-gray-300 shadow-sm"
              />
            )}

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 mb-4">
              <h4 className="font-bold text-gray-700 mb-2 border-b pb-2">作品描述</h4>
              <p className={`text-gray-700 leading-relaxed font-light whitespace-pre-wrap ${isOptimizedZone ? 'text-lg md:text-2xl' : 'text-base md:text-lg'}`}>
                {selectedArtwork.description}
              </p>
            </div>
            {/* Safe space at bottom for mobile scrolling */}
            <div className="h-10 md:h-0"></div>
          </div>

          {/* Right: Chat with Curator - HIDDEN for Optimized Zones */}
          {!isOptimizedZone && (
            <div className="w-full md:w-2/5 bg-white flex flex-col h-[400px] md:h-auto border-t md:border-t-0 border-gray-200">
              <div className="p-3 md:p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg text-blue-800 font-semibold flex items-center gap-2">
                  <span>🩺</span> 醫學人文策展人
                </h3>
                <p className="text-xs text-blue-600">針對此議題，歡迎與我交流看法。</p>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
                {chatHistory.length === 0 && (
                  <div className="text-center text-gray-400 mt-10 italic px-8">
                    "您對於這個身體議題有什麼看法？或是想知道更多關於醫學介入的觀點？"
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatting && <div className="text-gray-400 text-xs animate-pulse ml-2">正在撰寫回應...</div>}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="輸入您的想法..."
                  className="flex-1 bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-full focus:outline-none focus:border-blue-500 transition shadow-inner text-sm md:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isChatting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-full disabled:opacity-50 shadow-md font-bold text-sm md:text-base whitespace-nowrap"
                >
                  發送
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 3. HUD (Playing State)
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Reticle - hidden on mobile if user wants cleaner view, but good for aiming */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${hoveredId ? 'bg-blue-500 scale-150' : 'bg-black/30'}`} />
      </div>

      {/* Interaction Prompt (Both Mobile and Desktop) */}
      {hoveredId && (
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-gray-900 bg-white/90 px-6 py-2 rounded-full backdrop-blur border border-blue-200 shadow-lg z-10 animate-fade-in-up">
          <span className="font-bold text-blue-600 mr-2">{isMobile ? "點擊 VIEW" : "點擊"}</span>
          檢視作品
        </div>
      )}

      {/* Controls Guide: ONLY DESKTOP */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 text-gray-700 text-xs bg-white/60 p-2 rounded border border-white/20">
          <p>WASD 移動</p>
          <p>滑鼠 轉動視角</p>
          <p>點擊 鎖定游標</p>
          <p>ESC 釋放游標</p>
        </div>
      )}

      {/* Mobile Controls: ONLY MOBILE */}
      {isMobile && appState === AppState.PLAYING && (
        <MobileControls
          inputRef={inputRef}
          onInteract={handleMobileInteract}
          canInteract={!!hoveredId}
        />
      )}

      {/* Theme Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="text-center bg-white/80 backdrop-blur px-6 py-2 rounded-full border border-white/40 shadow-sm max-w-[90%]">
          <h2 className="text-lg md:text-xl text-gray-900 font-serif tracking-widest uppercase truncate">{theme?.name || "載入中..."}</h2>
        </div>
      </div>
    </div>
  );
};