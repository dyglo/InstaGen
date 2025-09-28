import React, { useState, useEffect, useRef } from 'react';
import type { UserStory } from '../types';
import { CloseIcon } from './icons/Icons';

interface StoryViewerProps {
    stories: UserStory[];
    startUserId: string;
    onClose: () => void;
}

const ProgressBar: React.FC<{ count: number; currentIndex: number, active: boolean }> = ({ count, currentIndex, active }) => {
    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-white/50 rounded-full">
                     <div
                        className={`h-full rounded-full ${index < currentIndex ? 'bg-white' : ''} ${index === currentIndex && active ? 'bg-white animate-progress' : ''}`}
                        style={{ animationDuration: '5s' }}
                    ></div>
                </div>
            ))}
        </div>
    );
};


export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, startUserId, onClose }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(() => stories.findIndex(s => s.userId === startUserId));
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const timerRef = useRef<number | null>(null);

    const currentUser = stories[currentUserIndex];

    const goToNextUser = () => {
        if (currentUserIndex < stories.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
        } else {
            onClose();
        }
    };
    
    const goToPrevUser = () => {
        if (currentUserIndex > 0) {
            setCurrentUserIndex(prev => prev - 1);
            setCurrentStoryIndex(0);
        }
    };

    const goToNextStory = () => {
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            goToNextUser();
        }
    };
    
    const goToPrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else {
            goToPrevUser();
        }
    };

    useEffect(() => {
        const clearTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };

        clearTimer();

        if (!isPaused) {
            timerRef.current = window.setTimeout(() => {
                goToNextStory();
            }, currentUser.stories[currentStoryIndex].duration);
        }
        
        return clearTimer;
    }, [currentStoryIndex, currentUserIndex, isPaused, stories]);


    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const tapPosition = (clientX - left) / width;

        if (tapPosition < 0.3) {
            goToPrevStory();
        } else {
            goToNextStory();
        }
    };
    
    const handleMouseDown = () => setIsPaused(true);
    const handleMouseUp = () => setIsPaused(false);
    const handleMouseLeave = () => setIsPaused(false);

    if (!currentUser) return null;

    return (
         <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div 
                className="relative w-full max-w-md h-full max-h-[95vh] sm:max-h-[85vh] aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden select-none"
                onClick={handleTap}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <img 
                    src={currentUser.stories[currentStoryIndex].imageUrl} 
                    alt={`Story by ${currentUser.username}`}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/40"></div>

                <div className="absolute top-0 left-0 right-0 p-3">
                    <ProgressBar count={currentUser.stories.length} currentIndex={currentStoryIndex} active={!isPaused} />
                     <div className="flex items-center mt-3">
                        <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-8 h-8 rounded-full" />
                        <span className="ml-3 font-semibold text-white text-sm">{currentUser.username}</span>
                    </div>
                </div>

                <button onClick={onClose} className="absolute top-3 right-3 p-1 z-10 text-white">
                    <CloseIcon />
                </button>
                 <style>{`
                    @keyframes progress {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                    .animate-progress {
                        animation-name: progress;
                        animation-timing-function: linear;
                        animation-fill-mode: forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};
