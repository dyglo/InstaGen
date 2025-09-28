
import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { ArrowLeftIcon, SparklesIcon, LoadingSpinner } from './icons/Icons';
import type { ReelType, UserProfile } from '../types';

interface CreateReelModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onCreateReel: (newReelData: Omit<ReelType, 'id' | 'likes' | 'comments' | 'isLiked' | 'audio'>) => void;
}

type AspectRatio = '9:16' | '1:1' | '16:9';

const AspectRatioButton: React.FC<{
    value: AspectRatio;
    label: string;
    current: AspectRatio;
    onClick: (value: AspectRatio) => void;
}> = ({ value, label, current, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            current === value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
        }`}
    >
        {label}
    </button>
);

export const CreateReelModal: React.FC<CreateReelModalProps> = ({ userProfile, onClose, onCreateReel }) => {
    const [stage, setStage] = useState<'generate' | 'share'>('generate');
    const [prompt, setPrompt] = useState('');
    const [caption, setCaption] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate a video.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { videoUrl } = await generateVideo(prompt, aspectRatio, setProgressMessage);
            setGeneratedVideoUrl(videoUrl);
            setStage('share');
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    };
    
    const handleShare = () => {
        if (!generatedVideoUrl) return;
        onCreateReel({
            username: userProfile.username,
            avatarUrl: userProfile.avatarUrl,
            videoUrl: generatedVideoUrl,
            caption,
            prompt,
        });
    }

    const goBack = () => {
        if (stage === 'share') {
            setStage('generate');
            setGeneratedVideoUrl(null);
            setCaption('');
        } else {
            onClose();
        }
    }

    const renderHeader = () => (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <button onClick={goBack}><ArrowLeftIcon /></button>
            <h2 className="font-semibold text-md">
                {stage === 'generate' ? 'Create Reel' : 'Share Reel'}
            </h2>
            <button
                onClick={stage === 'generate' ? handleGenerate : handleShare}
                disabled={isLoading || (stage === 'generate' && !prompt)}
                className="text-blue-500 font-semibold text-sm disabled:opacity-50"
            >
                {stage === 'generate' ? 'Generate' : 'Share'}
            </button>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                {renderHeader()}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                     <div className="relative aspect-[9/16] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        {generatedVideoUrl ? (
                            <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                                <SparklesIcon className="w-16 h-16" />
                                <p className="mt-2 font-semibold">Your video will appear here</p>
                            </div>
                        )}
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 flex flex-col items-center justify-center p-4 text-center">
                                <LoadingSpinner />
                                <p className="text-sm font-semibold mt-2 text-gray-600 dark:text-gray-300">InstaGen is creating your reel...</p>
                                <p className="text-xs text-gray-500 mt-1">{progressMessage}</p>
                            </div>
                        )}
                    </div>
                    {stage === 'generate' && (
                        <>
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., a neon hologram of a cat driving at top speed"
                                    rows={3}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aspect Ratio</label>
                                <div className="flex justify-center space-x-2">
                                    <AspectRatioButton value="9:16" label="Portrait" current={aspectRatio} onClick={setAspectRatio} />
                                    <AspectRatioButton value="1:1" label="Square" current={aspectRatio} onClick={setAspectRatio} />
                                    <AspectRatioButton value="16:9" label="Landscape" current={aspectRatio} onClick={setAspectRatio} />
                                </div>
                            </div>
                        </>
                    )}
                     {stage === 'share' && (
                        <div>
                            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
                            <textarea
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                rows={3}
                                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}