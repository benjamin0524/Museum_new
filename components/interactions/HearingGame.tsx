import React, { useState } from 'react';
import { exhibitionData } from '../../data/exhibitionData';

interface HearingGameProps {
    onClose?: () => void;
}

export const HearingGame: React.FC<HearingGameProps> = ({ onClose }) => {
    // Game State: 'INTRO' -> 'PLAYING' -> 'RESULT'
    const [gameState, setGameState] = useState<'INTRO' | 'PLAYING' | 'RESULT'>('INTRO');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const data = exhibitionData.find(d => d.id === 4);

    // Simple Lip Reading Challenge Data
    const challenge = {
        videoPlaceholderText: "影片播放中：請觀察對方的嘴型...",
        options: [
            "今天運氣好嗎？",
            "今天好冷嗎？",
            "今天甜點好吃嗎？",
            "今天好熱嗎？"
        ],
        correctIndex: 1 // "今天好冷嗎？" is at index 1
    };

    const handleStart = () => {
        setGameState('PLAYING');
    };

    const handleGuess = (index: number) => {
        setSelectedOption(index);
        // Simulate checking (in a real app, logic would be here)
        // For this demo, we'll force 'Correct' if they pick the intended one, or just show result
        const correct = index === challenge.correctIndex;
        setIsCorrect(correct);
        setGameState('RESULT');
    };

    const handleRetry = () => {
        setSelectedOption(null);
        setIsCorrect(false);
        setGameState('PLAYING');
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Game Container */}
            <div className="relative w-full min-h-[60vh] md:min-h-0 md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                {/* Background Image (Hearing Zone) */}
                <img
                    src={data?.imageUrl || "https://picsum.photos/800/600?grayscale"}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    alt="Background"
                />

                {/* Content Overlay - Scrollable */}
                <div className="absolute inset-0 overflow-y-auto z-50">
                    <div className="min-h-full w-full flex flex-col items-center justify-center p-4 py-8">

                        {gameState === 'INTRO' && (
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center animate-fade-in">
                                <h3 className="text-3xl font-bold text-white mb-4">👂 唇語挑戰</h3>
                                <p className="text-xl text-gray-200 mb-8">
                                    當聲音消失時，我們只能依賴視覺。<br />
                                    試著讀懂大螢幕上的人在說什麼。
                                </p>
                                <button
                                    onClick={handleStart}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                                >
                                    開始挑戰
                                </button>
                            </div>
                        )}

                        {gameState === 'PLAYING' && (
                            <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
                                {/* Video Player Area */}
                                <div className="w-full aspect-[16/9] bg-black rounded-lg mb-6 flex items-center justify-center border border-gray-600 relative overflow-hidden group shadow-2xl">
                                    <video
                                        src="/assets/hearing_test.mp4"
                                        loop
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {challenge.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleGuess(idx)}
                                            className="p-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all text-xl font-medium"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {gameState === 'RESULT' && (
                            <div className="bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl max-w-2xl text-center animate-fade-in">
                                <div className="text-6xl mb-4">
                                    {isCorrect ? '✨' : '❓'}
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-4">
                                    {isCorrect ? '答對了！' : '有點困難，對吧？'}
                                </h3>
                                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                                    {isCorrect
                                        ? "沒錯！即使沒有聲音，你依然「看」見了這句話。"
                                        : "這就是聽障者每天面對的挑戰：\n少了聲音的輔助，每一個字都像在猜謎。"
                                    }
                                </p>
                                <p className="text-xl text-blue-300 italic mb-10 border-l-4 border-blue-500 pl-6 text-left leading-normal">
                                    {data?.details.coreMessage}
                                </p>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={handleRetry}
                                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                                    >
                                        再試一次
                                    </button>
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
                        )}

                    </div>
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
