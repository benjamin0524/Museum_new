import React, { useState, useEffect } from 'react';
import { exhibitionData } from '../../data/exhibitionData';

import { ShareButton } from '../ShareButton';

interface ObesityGameProps {
    onClose?: () => void;
}

export const ObesityGame: React.FC<ObesityGameProps> = ({ onClose }) => {
    // Game State: 'INTRO' -> 'SIMULATION' -> 'RESULT'
    const [gameState, setGameState] = useState<'INTRO' | 'SIMULATION' | 'RESULT'>('INTRO');

    // Environment Factors (0-100)
    const resultRef = React.useRef<HTMLDivElement>(null);
    const [foodAccess, setFoodAccess] = useState(50); // High Calorie Accessibility
    const [workHours, setWorkHours] = useState(50);   // Work Stress / Sedentary
    const [sleepQuality, setSleepQuality] = useState(50); // 100 = Good, 0 = Bad (Inverse in calc)
    const [sportsFacilities, setSportsFacilities] = useState(50); // 100 = Many, 0 = None

    const [difficultyScore, setDifficultyScore] = useState(0);

    const data = exhibitionData.find(d => d.id === 3);

    // Calculate Difficulty
    useEffect(() => {
        // Higher Food Access (+), Longer Work (+), Lower Sleep (+), Lower Sports (+)
        const sleepFactor = 100 - sleepQuality;
        const sportsFactor = 100 - sportsFacilities;

        const score = (foodAccess + workHours + sleepFactor + sportsFactor) / 4;
        setDifficultyScore(Math.round(score));
    }, [foodAccess, workHours, sleepQuality, sportsFacilities]);

    const handleStart = () => {
        setGameState('SIMULATION');
    };

    const handleFinish = () => {
        setGameState('RESULT');
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Game Container */}
            <div className="relative w-full min-h-[60vh] md:min-h-0 md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                {/* Background Video/Image */}
                <img
                    src={data?.imageUrl || "https://picsum.photos/800/600?grayscale"}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    alt="Background"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center overflow-y-auto">

                    {gameState === 'INTRO' && (
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 animate-fade-in max-w-2xl">
                            <h3 className="text-3xl font-bold text-white mb-4">⚖️ 環境因子模擬器</h3>
                            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                                很多人認為體重控制只是「意志力」的問題。<br />
                                讓我們來調整看看，當生活環境改變時，<br />
                                身體這個系統會面臨多大的壓力。
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                            >
                                開始模擬
                            </button>
                        </div>
                    )}

                    {gameState === 'SIMULATION' && (
                        <div className="w-full max-w-4xl animate-fade-in bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h4 className="text-2xl text-white font-bold mb-6">調整環境參數</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Sliders */}
                                <div className="space-y-6 text-left">
                                    <div>
                                        <label className="text-gray-300 block mb-2">🍰 高熱量食物可近性 (越高越容易取得)</label>
                                        <input type="range" min="0" max="100" value={foodAccess} onChange={(e) => setFoodAccess(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 block mb-2">💼 工作時數 (越高越久坐/壓力大)</label>
                                        <input type="range" min="0" max="100" value={workHours} onChange={(e) => setWorkHours(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 block mb-2">😴 睡眠品質 (越低越差)</label>
                                        <input type="range" min="0" max="100" value={sleepQuality} onChange={(e) => setSleepQuality(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 block mb-2">🏋️ 運動設施密度 (越低越難運動)</label>
                                        <input type="range" min="0" max="100" value={sportsFacilities} onChange={(e) => setSportsFacilities(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                </div>

                                {/* Live Result Gauge */}
                                <div className="flex flex-col items-center justify-center border-l border-gray-600 pl-4">
                                    <h5 className="text-xl text-gray-300 mb-4">體重管理難度</h5>

                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="10" />
                                            <circle
                                                cx="50" cy="50" r="45" fill="none" stroke={difficultyScore > 70 ? "#ef4444" : difficultyScore > 40 ? "#eab308" : "#22c55e"}
                                                strokeWidth="10"
                                                strokeDasharray="283"
                                                strokeDashoffset={283 - (283 * difficultyScore) / 100}
                                                className="transition-all duration-500 ease-out transform -rotate-90 origin-center"
                                            />
                                        </svg>
                                        <div className="absolute text-4xl font-bold text-white">{difficultyScore}%</div>
                                    </div>
                                    <p className="mt-4 text-center text-gray-400 text-sm">
                                        {difficultyScore > 80 ? "環境嚴苛：僅靠意志力幾乎不可能維持健康" :
                                            difficultyScore > 40 ? "環境挑戰：需要付出極大努力對抗環境" :
                                                "環境友善：系統支持你的健康選擇"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleFinish}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg"
                            >
                                查看分析結果
                            </button>
                        </div>
                    )}

                    {gameState === 'RESULT' && (
                        <div ref={resultRef} className="bg-gray-900/95 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl max-w-3xl animate-fade-in">
                            <h3 className="text-3xl font-bold text-white mb-6">
                                系統比意志力更強大
                            </h3>

                            <p className="text-xl text-gray-200 mb-8 leading-loose text-left">
                                當您將環境調整到高壓力、高熱量可近性、低睡眠品質時，<br />
                                <span className="text-red-400 font-bold">體重管理難度飆升至 {difficultyScore}%。</span><br /><br />
                                這時候大腦的異導點（Set Point）會被重新設定，<br />
                                身體會以為「囤積脂肪」才是生存之道。<br />
                                這不是您不想瘦，而是您的身體系統正在「失衡」的環境下努力運作。
                            </p>

                            <p className="text-2xl text-red-300 font-bold mb-10 border-t border-gray-700 pt-6">
                                {data?.details.coreMessage}
                            </p>

                            <div className="flex gap-4 justify-center flex-wrap">
                                <button
                                    onClick={handleStart}
                                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                                >
                                    重新模擬
                                </button>
                                <ShareButton
                                    text="在 Lilly Museum 發現：體重不完全是意志力的問題，環境因素影響也很大！快來測測你的環境難度。"
                                    captureRef={resultRef}
                                />
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
                        <span className="font-bold text-red-800 block mb-2 text-xl tracking-wider">身體狀態</span>
                        <span className="whitespace-pre-line">{data?.details.bodyState}</span>
                    </p>
                    <p>
                        <span className="font-bold text-red-800 block mb-2 text-xl tracking-wider">成因</span>
                        <span className="whitespace-pre-line">{data?.details.cause}</span>
                    </p>
                    <p>
                        <span className="font-bold text-red-800 block mb-2 text-xl tracking-wider">醫學介入</span>
                        <span className="whitespace-pre-line">{data?.details.intervention}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
