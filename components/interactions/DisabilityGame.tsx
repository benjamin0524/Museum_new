import React, { useState } from 'react';
import { exhibitionData } from '../../data/exhibitionData';

interface DisabilityGameProps {
    onClose?: () => void;
}

export const DisabilityGame: React.FC<DisabilityGameProps> = ({ onClose }) => {
    // Game State: 'INTRO' -> 'SCENARIO' -> 'RESULT'
    const [gameState, setGameState] = useState<'INTRO' | 'SCENARIO' | 'RESULT'>('INTRO');
    const [choice, setChoice] = useState<'TIME' | 'MONEY' | null>(null);

    const data = exhibitionData.find(d => d.id === 2);

    const handleStart = () => {
        setGameState('SCENARIO');
    };

    const handleChoice = (selected: 'TIME' | 'MONEY') => {
        setChoice(selected);
        setGameState('RESULT');
    };

    const handleReset = () => {
        setChoice(null);
        setGameState('INTRO');
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Game Container */}
            <div className="relative w-full min-h-[60vh] md:min-h-0 md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                {/* Background Image */}
                <img
                    src={data?.imageUrl || "https://picsum.photos/800/600?grayscale"}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    alt="Background"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">

                    {gameState === 'INTRO' && (
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 animate-fade-in max-w-2xl">
                            <h3 className="text-3xl font-bold text-white mb-4">♿ 抉擇時刻</h3>
                            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                                對於大多數人來說，「出門」只是一連串無意識的動作。<br />
                                但當身體不再自由，每一個簡單的移動，<br />
                                都可能是一道艱難的選擇題。
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                            >
                                進入情境
                            </button>
                        </div>
                    )}

                    {gameState === 'SCENARIO' && (
                        <div className="w-full max-w-4xl animate-fade-in">
                            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl mb-8 border border-white/10">
                                <h4 className="text-2xl text-yellow-400 font-bold mb-3">情境：上班通勤</h4>
                                <p className="text-xl text-white leading-relaxed">
                                    今天是重要的會議日，你正準備搭公車上班。<br />
                                    終於等到公車進站了，但你發現...<br />
                                    <span className="text-red-400 font-bold text-2xl">這班車沒有低底盤設計（無障礙坡道）。</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Option A */}
                                <button
                                    onClick={() => handleChoice('TIME')}
                                    className="group relative h-64 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-red-400 rounded-xl p-6 transition-all shadow-xl flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏳</div>
                                    <h5 className="text-2xl font-bold text-white mb-2">等待下一班</h5>
                                    <p className="text-gray-400">
                                        也許下一班會有坡道...<br />
                                        但你會遲到，可能錯過會議。
                                    </p>
                                </button>

                                {/* Option B */}
                                <button
                                    onClick={() => handleChoice('MONEY')}
                                    className="group relative h-64 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-green-400 rounded-xl p-6 transition-all shadow-xl flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💸</div>
                                    <h5 className="text-2xl font-bold text-white mb-2">改搭計程車</h5>
                                    <p className="text-gray-400">
                                        雖然能準時到達，<br />
                                        但這筆額外開銷是你負擔得起的嗎？
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}

                    {gameState === 'RESULT' && (
                        <div className="bg-gray-900/95 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl max-w-3xl animate-fade-in">
                            <h3 className="text-3xl font-bold text-white mb-6">
                                {choice === 'TIME' ? '你選擇了「時間」的代價' : '你選擇了「金錢」的代價'}
                            </h3>

                            <div className="text-xl text-gray-300 mb-8 leading-loose text-left bg-white/5 p-6 rounded-lg border-l-4 border-indigo-500">
                                {choice === 'TIME' ? (
                                    <>
                                        <p className="mb-4">你選擇在寒風中繼續等待，下一班車過了20分鐘才來。</p>
                                        <p>你遲到了，主管的眼神有些不悅。你感到委屈，因為這不是你不想準時，而是環境不允許。</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-4">你招了一輛無障礙計程車（如果運氣好叫得到的話）。</p>
                                        <p>你準時趕上了會議，但看著跳錶的金額，你心裡默默計算著這個月還剩多少生活費。為了像「一般人」一樣生活，你必須付出更多。</p>
                                    </>
                                )}
                            </div>

                            <p className="text-2xl text-yellow-300 font-bold mb-10">
                                {data?.details.coreMessage}
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                                >
                                    重新選擇
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
                        <span className="font-bold text-indigo-800 block mb-2 text-xl tracking-wider">身體狀態</span>
                        <span className="whitespace-pre-line">{data?.details.bodyState}</span>
                    </p>
                    <p>
                        <span className="font-bold text-indigo-800 block mb-2 text-xl tracking-wider">成因</span>
                        <span className="whitespace-pre-line">{data?.details.cause}</span>
                    </p>
                    <p>
                        <span className="font-bold text-indigo-800 block mb-2 text-xl tracking-wider">醫學介入</span>
                        <span className="whitespace-pre-line">{data?.details.intervention}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
