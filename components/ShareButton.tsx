import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    className?: string;
    captureRef?: React.RefObject<HTMLElement>; // Ref to the element we want to capture
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title = "Lilly Museum - 身不由己",
    text = "我剛剛在 Lilly Museum 體驗了一場震撼的感官旅程，你也來試試看？",
    url = window.location.origin,
    className = "",
    captureRef
}) => {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        setLoading(true);
        let file: File | null = null;

        // Try capturing image if ref is provided
        if (captureRef?.current) {
            try {
                const canvas = await html2canvas(captureRef.current, {
                    useCORS: true, // Important for external images
                    allowTaint: true,
                    backgroundColor: '#111827', // Dark background for transparent parts
                    scale: 2 // Higher resolution
                });

                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (blob) {
                    file = new File([blob], 'result.png', { type: 'image/png' });
                }
            } catch (err) {
                console.error("Screenshot failed:", err);
            }
        }

        // Try Web Share API (Mobile friendly)
        if (navigator.share) {
            try {
                const shareData: ShareData = {
                    title,
                    text,
                    url
                };

                // Add file if available and supported
                if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }

                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to Clipboard API
            try {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);

                // If we have a file but can't share it natively (Desktop), maybe download it?
                if (file) {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(file);
                    downloadLink.download = 'lilly-museum-result.png';
                    downloadLink.click();
                }

            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleShare}
            disabled={loading}
            className={`px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''} ${className}`}
        >
            <span>{copied ? '✅ 已複製' : loading ? '📸 處理中...' : '📤 分享結果'}</span>
        </button>
    );
};
