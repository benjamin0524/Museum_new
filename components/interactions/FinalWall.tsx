import React, { useState } from 'react';
import { exhibitionData } from '../../data/exhibitionData';

interface FinalWallProps {
    onClose?: () => void;
}

export const FinalWall: React.FC<FinalWallProps> = ({ onClose }) => {
    // Stage: 'INTRO' -> 'Q1' -> 'Q2' -> 'CONCLUSION'
    const [stage, setStage] = useState<'INTRO' | 'Q1' | 'Q2' | 'CONCLUSION'>('INTRO');

    // Tracking user choices for fun (not stored persistently in this demo)
    const [answers, setAnswers] = useState({ q1: '', q2: '' });

    const data = exhibitionData.find(d => d.id === 1);

    const handleStart = () => setStage('Q1');

    const handleAnswerQ1 = (answer: string) => {
        setAnswers({ ...answers, q1: answer });
        setStage('Q2');
    };

    const handleAnswerQ2 = (answer: string) => {
        setAnswers({ ...answers, q2: answer });
        setStage('CONCLUSION');
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Game Container */}
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 min-h-[400px]">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-9xl">✨</span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center overflow-y-auto">

                    {stage === 'INTRO' && (
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 animate-fade-in max-w-2xl">
                            <h3 className="text-3xl font-bold text-white mb-4">🌟 結語：選擇與支持</h3>
                            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                                走過了身不由己的旅程，<br />
                                最後，我們想邀請您思考幾個問題。
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95"
                            >
                                開始思考
                            </button>
                        </div>
                    )}

                    {stage === 'Q1' && (
                        <div className="animate-fade-in max-w-3xl">
                            <h4 className="text-2xl text-blue-300 font-bold mb-6">思考一</h4>
                            <p className="text-2xl text-white font-bold mb-10 leading-relaxed">
                                「如果醫學可以幫助你更快回到想要的生活狀態，<br />你會選擇嗎？」
                            </p>
                            <div className="flex gap-6 justify-center flex-wrap">
                                <button onClick={() => handleAnswerQ1('YES')} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xl text-white transition-all hover:scale-105 min-w-[150px]">
                                    我會選擇
                                </button>
                                <button onClick={() => handleAnswerQ1('NO')} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xl text-white transition-all hover:scale-105 min-w-[150px]">
                                    我想靠自己
                                </button>
                                <button onClick={() => handleAnswerQ1('DEPENDS')} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xl text-white transition-all hover:scale-105 min-w-[150px]">
                                    看情況
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === 'Q2' && (
                        <div className="animate-fade-in max-w-3xl">
                            <h4 className="text-2xl text-pink-300 font-bold mb-6">思考二</h4>
                            <p className="text-2xl text-white font-bold mb-10 leading-relaxed">
                                「如果別人選擇醫學協助，<br />你會支持嗎？」
                            </p>
                            <div className="flex gap-6 justify-center flex-wrap">
                                <button onClick={() => handleAnswerQ2('YES')} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xl text-white transition-all hover:scale-105 min-w-[150px]">
                                    我會支持
                                </button>
                                <button onClick={() => handleAnswerQ2('NO')} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xl text-white transition-all hover:scale-105 min-w-[150px]">
                                    不一定
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === 'CONCLUSION' && (
                        <div className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-4xl animate-fade-in w-full h-full overflow-y-auto flex flex-col items-center">

                            {/* Exhibition Summary */}
                            <div className="mb-10 text-left w-full space-y-4">
                                <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center border-b border-white/10 pb-4">
                                    展覽結語
                                </h3>
                                <p className="text-lg text-gray-200 leading-relaxed pl-4 border-l-4 border-blue-500">
                                    <span className="font-bold text-white">努力與醫學，從來不是對立的選項。</span>
                                </p>
                                <p className="text-lg text-gray-200 leading-relaxed pl-4 border-l-4 border-green-500">
                                    有人選擇靠意志力調整生活習慣、有人選擇透過醫學協助加快進程與減輕負荷，<br />
                                    <span className="font-bold text-white">兩者都是選擇，都值得尊重。</span>
                                </p>
                                <p className="text-lg text-gray-200 leading-relaxed pl-4 border-l-4 border-purple-500">
                                    每個人有不同的身體條件，所生活的環境也各自不同，<br />
                                    有些人的困難並非我們所能想像。
                                </p>
                                <p className="text-lg text-gray-200 leading-relaxed pl-4 border-l-4 border-red-500">
                                    <span className="font-bold text-white">醫學不是捷徑，</span><br />
                                    而是為那些「身」不由己的人們，準備的一條安全道路。
                                </p>
                            </div>

                            {/* Core Spirit Summary */}
                            <div className="w-full bg-white/5 p-6 rounded-xl border border-white/10">
                                <h4 className="text-xl font-bold text-indigo-300 mb-4 text-center">
                                    策展核心精神
                                </h4>
                                <ul className="space-y-3 text-left max-w-2xl mx-auto list-disc list-outside pl-6 text-gray-100">
                                    <li>健康狀態是<span className="text-yellow-200">基因、生理與環境</span>交互作用的結果</li>
                                    <li>醫學介入是一種<span className="text-yellow-200">理性、有效且正當</span>的選擇</li>
                                    <li>身體差異應被<span className="text-yellow-200">理解</span>，而非被道德化審判</li>
                                </ul>
                            </div>

                            <div className="mt-8 flex gap-4">
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="px-10 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                                    >
                                        <span>🏛️</span> 完成觀展
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Static Text Section (Hidden for this special zone as it duplicates the interactive content) */}
        </div>
    );
};
