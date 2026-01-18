import React, { useState, useRef } from 'react';
import { exhibitionData } from '../../data/exhibitionData';

import { ShareButton } from '../ShareButton';

interface MyopiaGameProps {
    onClose?: () => void;
}

export const MyopiaGame: React.FC<MyopiaGameProps> = ({ onClose }) => {
    // Game State
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FOUND'>('START');

    // Mouse/Lens Position
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage

    // Book Position (Randomized on mount/start)
    const [bookPos, setBookPos] = useState({ x: 30, y: 40 });

    const containerRef = useRef<HTMLDivElement>(null);

    const data = exhibitionData.find(d => d.id === 6);

    const resultRef = useRef<HTMLDivElement>(null);

    const handleStart = () => {
        // Randomize book position (keep away from edges 10%-90%)
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        setBookPos({ x, y });
        setGameState('PLAYING');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (gameState !== 'PLAYING' || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setCursorPos({ x, y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (gameState !== 'PLAYING' || !containerRef.current) return;
        // Prevent scrolling while playing the game
        // e.preventDefault() cannot be called here if passive listener, handled by style or simple logic

        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        // Clamp values to keep lens within bounds (optional but good for touch)
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        setCursorPos({ x: clampedX, y: clampedY });
    };

    const handleBookClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setGameState('FOUND');
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Game Container */}
            <div
                ref={containerRef}
                className="relative w-full min-h-[60vh] md:min-h-0 md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl cursor-none border border-gray-700 touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onClick={() => { if (gameState === 'START') handleStart(); }}
            >
                {/* Background Image (Myopia Zone) */}
                <img
                    src={data?.imageUrl || "https://picsum.photos/800/600?blur=10"}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    alt="Background"
                />

                {/* Game Logic Layers */}
                {gameState === 'START' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 cursor-pointer hover:bg-black/50 transition-colors">
                        <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl border border-white/20 animate-pulse">
                            <h3 className="text-3xl font-bold text-white mb-2">尋找清晰的書本</h3>
                            <p className="text-gray-200">點擊畫面開始體驗高度近視的世界</p>
                        </div>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <>
                        {/* Book Item - Integrated style (Now BEHIND the blur layer) */}
                        <div
                            className="absolute flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform z-1 opacity-90 drop-shadow-2xl"
                            style={{
                                left: `${bookPos.x}%`,
                                top: `${bookPos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                textShadow: '0 0 10px rgba(0,0,0,0.5)'
                            }}
                            onClick={handleBookClick}
                        >
                            <span className="text-6xl filter drop-shadow-md hover:brightness-125 transition-all">📘</span>
                        </div>

                        {/* 1. Blurred Layer (Top) */}
                        <div
                            className="absolute inset-0 z-10 pointer-events-none"
                            style={{
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                maskImage: `radial-gradient(circle 80px at ${cursorPos.x}% ${cursorPos.y}%, transparent 95%, black 100%)`,
                                WebkitMaskImage: `radial-gradient(circle 80px at ${cursorPos.x}% ${cursorPos.y}%, transparent 95%, black 100%)`
                            }}
                        />

                        {/* Lens Cursor Visual */}
                        <div
                            className="absolute w-48 h-48 rounded-full border-2 border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.3)] pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-white/80 text-lg font-bold z-20 pointer-events-none drop-shadow-md px-4">
                            移動「眼鏡」尋找書籍
                        </div>
                    </>
                )}

                {gameState === 'FOUND' && (
                    <div className="absolute inset-0 bg-black/80 z-30 overflow-y-auto animate-fade-in">
                        <div className="min-h-full w-full flex flex-col items-center justify-center p-4 py-8 text-center">
                            <div ref={resultRef} className="bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl max-w-2xl">
                                <div className="text-8xl mb-6">👓</div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">你看見了嗎？</h3>
                                <p className="text-2xl text-gray-200 mb-8 leading-relaxed font-light">
                                    「在沒有輔助的情況下，世界是模糊的。<br />眼鏡與醫學，讓我們重新擁有選擇清晰的權利。」
                                </p>
                                <p className="text-xl text-cyan-300 italic mb-10 border-l-4 border-cyan-500 pl-6 text-left leading-normal">
                                    {data?.details.coreMessage}
                                </p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <button
                                        onClick={handleStart}
                                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                                    >
                                        再玩一次
                                    </button>
                                    <ShareButton className="bg-cyan-700 hover:bg-cyan-600" captureRef={resultRef} />
                                    {onClose && (
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/50 rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                                        >
                                            <span>🏛️</span> 回到展廳
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Curatorial Text Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 text-3xl mb-6 flex items-center gap-3 border-b pb-4">
                    <span className="text-4xl">💡</span>
                    策展人導讀
                </h4>
                <div className="space-y-6 text-xl md:text-2xl text-gray-800 leading-loose">
                    <p>
                        <span className="font-bold text-blue-800 block mb-2 text-xl tracking-wider">身體狀態</span>
                        {data?.details.bodyState}
                    </p>
                    <p>
                        <span className="font-bold text-blue-800 block mb-2 text-xl tracking-wider">成因</span>
                        <span className="whitespace-pre-line">{data?.details.cause}</span>
                    </p>
                    <p>
                        <span className="font-bold text-blue-800 block mb-2 text-xl tracking-wider">醫學介入</span>
                        <span className="whitespace-pre-line">{data?.details.intervention}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
