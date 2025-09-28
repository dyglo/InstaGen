
import React, { useRef, useEffect, useState } from 'react';
import type { ReelType } from '../types';
import { CameraIcon, CommentIcon, HeartIcon, HeartIconFilled, MusicNoteIcon, ReelsIcon, SendIcon } from './icons/Icons';

interface ReelProps {
    reel: ReelType;
    onLikeReel: (reelId: string) => void;
    onOpenComments: (reel: ReelType) => void;
    isVisible: boolean;
}

const Reel: React.FC<ReelProps> = ({ reel, onLikeReel, onOpenComments, isVisible }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isVisible) {
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // The AbortError is expected when a user scrolls away quickly,
                    // interrupting the play() request. We can safely ignore it.
                    if (error.name !== 'AbortError') {
                        console.error("Video playback failed:", error);
                    }
                });
            }
        } else {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
    }, [isVisible]);

    const formatCount = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num;
    };

    return (
        <div className="relative h-full w-full snap-start flex-shrink-0 bg-black">
            <video ref={videoRef} src={reel.videoUrl} loop muted playsInline className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Side Gradients */}
            <div className="absolute top-0 left-0 h-full w-1/12 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 h-full w-1/12 bg-gradient-to-l from-purple-500/30 via-pink-500/30 to-transparent opacity-50"></div>


            {/* Right Action Bar */}
            <div className="absolute bottom-28 right-2 flex flex-col items-center space-y-6 text-white">
                <button onClick={() => onLikeReel(reel.id)} className="flex flex-col items-center">
                    {reel.isLiked ? <HeartIconFilled className="w-7 h-7"/> : <HeartIcon className="w-7 h-7" />}
                    <span className="text-xs font-semibold">{formatCount(reel.likes)}</span>
                </button>
                <button onClick={() => onOpenComments(reel)} className="flex flex-col items-center">
                    <CommentIcon className="w-7 h-7" />
                    <span className="text-xs font-semibold">{formatCount(reel.comments.length)}</span>
                </button>
                <button className="flex flex-col items-center">
                    <SendIcon className="w-7 h-7" />
                </button>
                <button className="flex flex-col items-center">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-14 left-0 right-0 p-4 text-white text-shadow-md">
                <div className="flex items-center">
                    <img src={reel.avatarUrl} alt={reel.username} className="w-10 h-10 rounded-full border-2 border-white" />
                    <span className="ml-3 font-semibold">{reel.username}</span>
                    <button 
                        onClick={() => setIsFollowing(f => !f)}
                        className={`ml-3 text-sm font-semibold px-4 py-1 rounded-lg ${isFollowing ? 'bg-white/20' : 'bg-white text-black'}`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
                <p className="mt-2 text-sm">{reel.caption}</p>
                 <div className="flex items-center mt-2">
                    <MusicNoteIcon className="w-4 h-4" />
                    <p className="text-sm ml-2">{reel.audio.author} · {reel.audio.title}</p>
                </div>
            </div>
             <div className="absolute bottom-16 right-3">
                <img src={reel.avatarUrl} alt="audio" className="w-10 h-10 rounded-full border-2 border-black animate-spin-slow"/>
            </div>
             <style>{`
                .text-shadow-md { text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </div>
    );
};

interface ReelsPageProps {
    reels: ReelType[];
    onLikeReel: (reelId: string) => void;
    onOpenComments: (reel: ReelType) => void;
    onGenerateReel: () => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ reels, onLikeReel, onOpenComments, onGenerateReel }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleReelId, setVisibleReelId] = useState<string | null>(reels.length > 0 ? reels[0].id : null);

    useEffect(() => {
        if (reels.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleReelId(entry.target.getAttribute('data-reel-id'));
                    }
                });
            },
            { threshold: 0.5 }
        );

        const reelsElements = containerRef.current?.childNodes;
        if (reelsElements) {
            reelsElements.forEach(el => observer.observe(el as Element));
        }

        return () => {
             if (reelsElements) {
                reelsElements.forEach(el => observer.unobserve(el as Element));
            }
        };
    }, [reels]);

    return (
        <div className="absolute inset-0 bg-black flex flex-col">
            <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 text-white">
                <h1 className="text-xl font-bold text-shadow-md">Reels</h1>
                <button onClick={onGenerateReel}>
                    <CameraIcon className="w-7 h-7" />
                </button>
            </header>
            
            {reels.length > 0 ? (
                <div ref={containerRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory">
                    {reels.map(reel => (
                        <div key={reel.id} data-reel-id={reel.id} className="h-full w-full snap-start flex-shrink-0">
                             <Reel reel={reel} onLikeReel={onLikeReel} onOpenComments={onOpenComments} isVisible={visibleReelId === reel.id} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-white text-center p-8">
                    <ReelsIcon className="w-24 h-24 text-gray-500 mb-4" />
                    <h2 className="text-2xl font-bold">Create your first Reel</h2>
                    <p className="text-gray-400 mt-2 max-w-xs">
                        Bring your ideas to life. Generate short videos with a text prompt and share them with the world.
                    </p>
                    <button 
                        onClick={onGenerateReel} 
                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Generate with AI
                    </button>
                </div>
            )}
        </div>
    );
};
