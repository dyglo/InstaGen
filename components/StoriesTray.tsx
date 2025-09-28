import React from 'react';
import type { UserStory, UserProfile } from '../types';
import { PlusIcon } from './icons/Icons';

interface StoryCircleProps {
    story: UserStory;
    onClick: (userId: string) => void;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ story, onClick }) => {
    const ringClass = story.hasUnseenStories
        ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'
        : 'bg-gray-200 dark:bg-gray-700';

    return (
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button className={`w-16 h-16 rounded-full p-0.5 ${ringClass}`} onClick={() => onClick(story.userId)}>
                <img 
                    src={story.avatarUrl} 
                    alt={story.username} 
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" 
                />
            </button>
            <p className="text-xs w-16 truncate text-center">{story.username}</p>
        </div>
    );
};

interface YourStoryCircleProps {
    userProfile: UserProfile;
    onClick: () => void;
}

const YourStoryCircle: React.FC<YourStoryCircleProps> = ({ userProfile, onClick }) => {
    return (
         <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button className="w-16 h-16 rounded-full relative" onClick={onClick}>
                <img 
                    src={userProfile.avatarUrl} 
                    alt="Your Story" 
                    className="w-full h-full rounded-full object-cover" 
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                    <PlusIcon className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
            </button>
            <p className="text-xs w-16 truncate text-center">Your story</p>
        </div>
    )
}

interface StoriesTrayProps {
  stories: UserStory[];
  userProfile: UserProfile;
  onOpenStoryViewer: (userId: string) => void;
  onOpenCreateStory: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({ stories, userProfile, onOpenStoryViewer, onOpenCreateStory }) => {
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-4 p-3 overflow-x-auto scrollbar-hide">
            <YourStoryCircle userProfile={userProfile} onClick={onOpenCreateStory} />
            {stories.map(story => (
                <StoryCircle key={story.userId} story={story} onClick={onOpenStoryViewer} />
            ))}
        </div>
         <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }
        `}</style>
    </div>
  );
};
