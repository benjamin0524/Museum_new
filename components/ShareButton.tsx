import React, { useState } from 'react';

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title = "Lilly Museum - 身不由己",
    text = "我剛剛在 Lilly Museum 體驗了一場震撼的感官旅程，你也來試試看？",
    url = window.location.origin,
    className = ""
}) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Try Web Share API first (Mobile friendly)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to Clipboard API
            try {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${className}`}
        >
            <span>{copied ? '✅ 已複製連結' : '📤 分享體驗'}</span>
        </button>
    );
};
