import React, { useState, useRef, useEffect } from 'react';
import { InputState } from '../types';

interface MobileControlsProps {
    inputRef: React.MutableRefObject<InputState>;
    onInteract?: () => void;
    canInteract?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ inputRef, onInteract, canInteract }) => {
    // ... (Joystick State & Logic - Unchanged)
    const joystickRef = useRef<HTMLDivElement>(null);
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 }); // relative to center
    const [isDraggingStick, setIsDraggingStick] = useState(false);
    const stickOrigin = useRef({ x: 0, y: 0 });

    const handleStickStart = (e: React.TouchEvent) => {
        setIsDraggingStick(true);
        const touch = e.touches[0];
        stickOrigin.current = { x: touch.clientX, y: touch.clientY };
        setJoystickPos({ x: 0, y: 0 });
    };

    const handleStickMove = (e: React.TouchEvent) => {
        if (!isDraggingStick) return;
        const touch = e.touches[0];
        const dx = touch.clientX - stickOrigin.current.x;
        const dy = touch.clientY - stickOrigin.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 40;
        const angle = Math.atan2(dy, dx);
        const clampedDist = Math.min(distance, maxDist);
        const x = Math.cos(angle) * clampedDist;
        const y = Math.sin(angle) * clampedDist;
        setJoystickPos({ x, y });
        inputRef.current.moveVector = {
            x: x / maxDist,
            z: y / maxDist
        };
    };

    const handleStickEnd = () => {
        setIsDraggingStick(false);
        setJoystickPos({ x: 0, y: 0 });
        inputRef.current.moveVector = { x: 0, z: 0 };
    };

    // ... (Look Logic - Unchanged)
    const lastTouch = useRef<{ x: number, y: number } | null>(null);

    const handleLookStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        lastTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleLookMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (lastTouch.current) {
            const dx = touch.clientX - lastTouch.current.x;
            const dy = touch.clientY - lastTouch.current.y;
            inputRef.current.lookDelta = { x: dx, y: dy };
            lastTouch.current = { x: touch.clientX, y: touch.clientY };
        }
    };

    const handleLookEnd = () => {
        lastTouch.current = null;
        inputRef.current.lookDelta = { x: 0, y: 0 };
    };

    return (
        <div className="absolute inset-0 pointer-events-none select-none z-50">

            {/* Left: Joystick Zone */}
            <div
                className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/10 border border-white/20 backdrop-blur pointer-events-auto touch-none flex items-center justify-center"
                onTouchStart={handleStickStart}
                onTouchMove={handleStickMove}
                onTouchEnd={handleStickEnd}
            >
                <div
                    className="w-16 h-16 rounded-full bg-blue-500/80 shadow-lg"
                    style={{
                        transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                        transition: isDraggingStick ? 'none' : 'transform 0.1s ease-out'
                    }}
                />
            </div>

            {/* Right: Look Zone */}
            <div
                className="absolute top-0 right-0 w-1/2 h-full pointer-events-auto touch-none"
                onTouchStart={handleLookStart}
                onTouchMove={handleLookMove}
                onTouchEnd={handleLookEnd}
            />

            <div className="absolute top-20 right-10 text-white/50 text-xs pointer-events-none">
                Drag to Look
            </div>

            {/* Action Button - Only visible when canInteract */}
            {canInteract && (
                <div
                    className="absolute bottom-24 right-10 w-24 h-24 rounded-full bg-blue-600/90 shadow-xl flex items-center justify-center pointer-events-auto animate-pulse active:scale-95 transition-transform touch-none border-4 border-white/20"
                    onTouchStart={(e) => {
                        e.stopPropagation(); // Prevent look zone from catching this
                        onInteract?.();
                    }}
                >
                    <span className="text-white font-bold text-xl drop-shadow-md">VIEW</span>
                </div>
            )}
        </div>
    );
};
