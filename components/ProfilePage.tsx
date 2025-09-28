import React, { useState, useRef } from 'react';
import { AddIcon, MenuIcon, GridIcon, ReelsIcon, TaggedIcon, CameraIcon } from './icons/Icons';
import type { PostType, ReelType, UserProfile, UserStory } from '../types';

interface ProfileHeaderProps {
    username: string;
    onAddPostClick: () => void;
    onMenuClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, onAddPostClick, onMenuClick }) => (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between h-14 px-4">
            <h1 className="text-lg font-semibold tracking-tight">
                {username}
            </h1>
            <div className="flex items-center space-x-4">
                <button onClick={onAddPostClick} className="p-1"><AddIcon /></button>
                <button onClick={onMenuClick} className="p-1"><MenuIcon /></button>
            </div>
        </div>
    </header>
);

const StatItem: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="font-semibold text-md">{value}</p>
        <p className="text-sm">{label}</p>
    </div>
);

const ReelGridItem: React.FC<{ reel: ReelType }> = ({ reel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(e => {
             if (e.name !== 'AbortError') {
                console.error("Video playback interrupted or failed:", e);
            }
        });
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div 
            className="aspect-square bg-gray-900 relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video 
                ref={videoRef}
                src={reel.videoUrl} 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover" 
            />
        </div>
    );
};


interface ProfilePageProps {
    userProfile: UserProfile;
    posts: PostType[];
    reels: ReelType[];
    stories: UserStory[];
    onAddPostClick: () => void;
    onOpenSettings: () => void;
    onOpenStoryViewer: (userId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, posts, reels, stories, onAddPostClick, onOpenSettings, onOpenStoryViewer }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isHoveringUnfollow, setIsHoveringUnfollow] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');

    const userHasStory = stories.some(s => s.userId === userProfile.id && s.stories.length > 0);
    const ringClass = userHasStory ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : 'bg-gray-200 dark:bg-gray-700';

    return (
        <div className="flex flex-col h-full">
            <ProfileHeader username={userProfile.username} onAddPostClick={onAddPostClick} onMenuClick={onOpenSettings} />
            <main className="flex-grow overflow-y-auto">
                <div className="p-4">
                    {/* Profile Info */}
                    <div className="flex items-center mb-4">
                         <button 
                            onClick={() => userHasStory && onOpenStoryViewer(userProfile.id)}
                            className={`w-20 h-20 rounded-full p-0.5 ${ringClass} flex-shrink-0`}
                            disabled={!userHasStory}
                        >
                            <img 
                                src={userProfile.avatarUrl} 
                                alt={userProfile.name} 
                                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" 
                            />
                        </button>
                        <div className="flex-grow flex justify-around ml-4">
                            <StatItem value={posts.length} label="Posts" />
                            <StatItem value={`${(userProfile.stats.followers / 1000).toFixed(0)}K`} label="Followers" />
                            <StatItem value={userProfile.stats.following} label="Following" />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <p className="font-semibold text-sm">{userProfile.name}</p>
                        <p className="text-sm whitespace-pre-line">{userProfile.bio}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center space-x-2 mb-4">
                        {isFollowing ? (
                            <button
                                onClick={() => setIsFollowing(false)}
                                onMouseEnter={() => setIsHoveringUnfollow(true)}
                                onMouseLeave={() => setIsHoveringUnfollow(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-semibold py-1.5 rounded-lg"
                            >
                                {isHoveringUnfollow ? 'Unfollow' : 'Following'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsFollowing(true)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5 rounded-lg"
                            >
                                Follow
                            </button>
                        )}
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-semibold py-1.5 rounded-lg">Message</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-around border-y border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex-grow py-2 ${activeTab === 'posts' ? 'border-t-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-400'}`}>
                        <GridIcon className="mx-auto" />
                    </button>
                    <button 
                         onClick={() => setActiveTab('reels')}
                        className={`flex-grow py-2 ${activeTab === 'reels' ? 'border-t-2 border-black dark:border-white text-black dark:text-white' : 'text-gray-400'}`}>
                        <ReelsIcon className="mx-auto" />
                    </button>
                    <button className="flex-grow py-2 text-gray-400"><TaggedIcon className="mx-auto" /></button>
                </div>

                {/* Content Grid */}
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-3 gap-0.5">
                        {posts.map(post => (
                            <div key={post.id} className="aspect-square bg-gray-100 dark:bg-gray-800">
                                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'reels' && (
                    reels.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0.5">
                            {reels.map(reel => (
                                <ReelGridItem key={reel.id} reel={reel} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 text-gray-500 dark:text-gray-400">
                           <CameraIcon className="w-16 h-16 mb-4"/>
                           <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Share Reels</h2>
                           <p className="mt-1">When you share reels, they'll appear on your profile.</p>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};
