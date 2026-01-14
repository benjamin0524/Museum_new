import React, { useState, useEffect, useRef } from 'react';
import { AppState, ArtworkData, MuseumTheme, ChatMessage, InputState } from '../types';
import { chatWithCurator } from '../services/geminiService';
import { MobileControls } from './MobileControls';

interface OverlayProps {
  appState: AppState;
  setAppState: (s: AppState) => void;
  hoveredId: number | null;
  selectedArtwork: ArtworkData | null;
  onCloseArtwork: () => void;
  theme: MuseumTheme | null;
  inputRef: React.MutableRefObject<InputState>;
  isMobile: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({
  appState,
  setAppState,
  hoveredId,
  selectedArtwork,
  onCloseArtwork,
  theme,
  inputRef,
  isMobile
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Evolution Lab State
  const [evolutionStep, setEvolutionStep] = useState<'form' | 'processing' | 'result'>('form');

  useEffect(() => {
    if (!selectedArtwork) {
      setEvolutionStep('form');
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

  // --- RENDERING ---

  // 1. Loading Screen (Light Mode)
  if (appState === AppState.LOADING) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f0f0] text-gray-900">
        <h1 className="text-4xl font-bold tracking-widest animate-pulse text-gray-800">無限博物館 (INFINI-MUSEUM)</h1>
        <p className="mt-4 text-gray-600">Gemini AI 正在為您策劃展覽...</p>
        <div className="mt-8 w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-1/2 animate-[wiggle_1s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  // 2. Artwork Inspection Modal
  if (appState === AppState.INSPECTING && selectedArtwork) {

    // Special UI for "Evolution Lab" (ID 1)
    if (selectedArtwork.id === 1) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 text-cyan-50">
          <div className="relative w-full max-w-2xl bg-gray-900 border border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">

            {/* Close Button */}
            <button
              onClick={onCloseArtwork}
              className="absolute top-4 right-4 z-10 text-cyan-500/50 hover:text-cyan-400 text-2xl transition-colors"
            >
              &times;
            </button>

            <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 tracking-wider">
                {selectedArtwork.title}
              </h2>
              <p className="text-cyan-500/60 mb-8 font-mono text-sm uppercase tracking-widest">
                Project: Human Optimization
              </p>

              {evolutionStep === 'form' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-gray-300 leading-relaxed border-l-2 border-cyan-500/50 pl-4">
                    {selectedArtwork.description}
                  </p>

                  <div className="space-y-4 mt-8">
                    <div className="bg-gray-800/50 p-4 rounded border border-gray-700/50">
                      <label className="block text-sm text-cyan-300 mb-2">Q1. 您是否認為「自然」不一定等於「完美」？</label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer gap-2"><input type="radio" name="q1" className="accent-cyan-500" /> 是的</label>
                        <label className="flex items-center cursor-pointer gap-2 text-gray-500"><input type="radio" name="q1" className="accent-cyan-500" /> 否</label>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded border border-gray-700/50">
                      <label className="block text-sm text-cyan-300 mb-2">Q2. 您是否願意透過科學手段優化代謝效率？</label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer gap-2"><input type="radio" name="q2" className="accent-cyan-500" /> 願意</label>
                        <label className="flex items-center cursor-pointer gap-2 text-gray-500"><input type="radio" name="q2" className="accent-cyan-500" /> 不願意</label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEvolutionStep('processing');
                      setTimeout(() => setEvolutionStep('result'), 2000);
                    }}
                    className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]"
                  >
                    開始基因序列分析
                  </button>
                </div>
              )}

              {evolutionStep === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-cyan-400 font-mono animate-pulse">正在分析代謝基因組...</p>
                </div>
              )}

              {evolutionStep === 'result' && (
                <div className="animate-in zoom-in-95 duration-500 text-center">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-cyan-500/50">
                    <span className="text-4xl">🧬</span>
                  </div>
                  <h3 className="text-2xl text-white font-bold mb-2">分析完成</h3>
                  <p className="text-cyan-200/80 mb-8">
                    系統已為您生成「個人專屬進化處方」。
                  </p>

                  <div className="bg-gray-800/80 rounded-lg p-6 text-left border border-cyan-500/20 mb-8 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">推薦方案</span>
                      <span className="text-cyan-400 font-bold">由 AI 客製化</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span> 營養支持 (GLP-1 類似物)
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> 代謝調節處方
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 py-3 rounded transition-colors">
                      下載詳細報告
                    </button>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded transition-colors shadow-lg shadow-cyan-900/20">
                      預約醫師諮詢
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      );
    }

    // Standard Overlay Logic
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="relative flex flex-col md:flex-row bg-white border border-gray-200 w-full max-w-5xl max-h-[90vh] rounded-lg overflow-hidden shadow-2xl">

          {/* Close Button */}
          <button
            onClick={onCloseArtwork}
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>

          {/* Left: Image & Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto bg-gray-50">
            <h2 className="text-3xl font-serif text-gray-900 mb-2">{selectedArtwork.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{selectedArtwork.artist}, {selectedArtwork.year}</p>
            <img
              src={selectedArtwork.imageUrl}
              alt={selectedArtwork.title}
              className="w-full h-64 object-cover rounded mb-6 border border-gray-300 shadow-sm"
            />
            <p className="text-gray-700 leading-relaxed font-light">{selectedArtwork.description}</p>
          </div>

          {/* Right: Chat with Curator */}
          <div className="w-full md:w-1/2 bg-white flex flex-col border-l border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg text-blue-600 font-semibold">AI 策展人</h3>
              <p className="text-xs text-gray-500">關於這件作品，您可以問我任何問題。</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-400 mt-10 italic">
                  "請儘管問，例如為什麼藝術家選擇了這種顏色..."
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && <div className="text-gray-400 text-xs animate-pulse">策展人正在思考...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="輸入您的問題..."
                className="flex-1 bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 shadow-sm"
              >
                發送
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 3. HUD (Playing State)
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${hoveredId ? 'bg-blue-500 scale-150' : 'bg-black/30'}`} />
      </div>

      {/* Interaction Prompt (Both Mobile and Desktop) */}
      {hoveredId && (
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-gray-900 bg-white/80 px-4 py-1 rounded backdrop-blur border border-gray-200 shadow-sm z-10">
          <span className="font-bold text-blue-600">點擊</span> 檢視作品
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
        <MobileControls inputRef={inputRef} />
      )}

      {/* Theme Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="text-center bg-white/60 backdrop-blur px-8 py-2 rounded-full border border-white/40 shadow-sm">
          <h2 className="text-xl text-gray-900 font-serif tracking-widest uppercase">{theme?.name || "載入中..."}</h2>
        </div>
      </div>
    </div>
  );
};