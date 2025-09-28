
import React, { useState, useCallback, useRef } from 'react';
import type { PostType, UserProfile } from '../types';
import { fileToBase64, editImage, generateImage } from '../services/geminiService';
import { ArrowLeftIcon, SparklesIcon, LoadingSpinner } from './icons/Icons';

interface CreatePostModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onCreatePost: (newPostData: Omit<PostType, 'id' | 'likes' | 'comments'>, setAsProfilePic: boolean) => void;
}

const DEFAULT_IMAGE_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==";
const DEFAULT_IMAGE_MIMETYPE = "image/png";

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ userProfile, onClose, onCreatePost }) => {
  const [stage, setStage] = useState<'select' | 'edit' | 'generate' | 'share'>('select');
  
  const [originalImage, setOriginalImage] = useState<{file: File | null, url: string | null}>({ file: null, url: null });
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState('');
  const [caption, setCaption] = useState('');
  const [setAsProfile, setSetAsProfile] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage({ file, url });
      setStage('edit');
    }
  };

  const handleEditAndGenerate = async () => {
    if (!originalImage.file) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    const baseImage = await fileToBase64(originalImage.file);
    const mimeType = originalImage.file.type;

    if (!prompt.trim()) {
      setError("Please enter a prompt to edit the image.");
      setIsLoading(false);
      return;
    }
      
    try {
      const { base64Image } = await editImage(baseImage, mimeType, prompt);
      setGeneratedImageUrl(`data:${mimeType};base64,${base64Image}`);
      setStage('share');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromPrompt = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image.");
      setIsLoading(false);
      return;
    }

    try {
      const { base64Image } = await generateImage(prompt);
      setGeneratedImageUrl(`data:image/jpeg;base64,${base64Image}`);
      setStage('share');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  const handlePost = () => {
    if (!generatedImageUrl) return;
    onCreatePost({
      username: userProfile.username,
      avatarUrl: userProfile.avatarUrl,
      imageUrl: generatedImageUrl,
      caption,
    }, setAsProfile);
  };
  
  const goBack = () => {
     if (stage === 'share') {
       // Heuristic to decide where to go back to. If there's an original image, we were editing.
       if (originalImage.file) setStage('edit');
       else setStage('generate');
       setGeneratedImageUrl(null); // Clear the generated image to allow re-generation
     }
     else if (stage === 'edit' || stage === 'generate') setStage('select');
     else onClose();
  }

  const handleHeaderAction = () => {
    if (stage === 'share') {
        handlePost();
    } else if (stage === 'edit') {
        if (prompt.trim()) {
            handleEditAndGenerate();
        } else {
            if (originalImage.url) {
                setGeneratedImageUrl(originalImage.url);
                setStage('share');
            }
        }
    } else if (stage === 'generate') {
        handleGenerateFromPrompt();
    }
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
      <button onClick={goBack} disabled={stage === 'select'} className={`${stage === 'select' ? 'opacity-0' : ''}`}>
        <ArrowLeftIcon />
      </button>
      <h2 className="font-semibold text-md">
        {stage === 'select' && 'Create new post'}
        {stage === 'edit' && 'Edit image'}
        {stage === 'generate' && 'Generate with AI'}
        {stage === 'share' && 'Share post'}
      </h2>
      <button 
        onClick={handleHeaderAction} 
        disabled={isLoading || (stage==='generate' && !prompt)}
        className="text-blue-500 font-semibold text-sm disabled:opacity-50">
        {stage === 'share' ? 'Share' : stage === 'generate' ? 'Generate' : 'Next'}
      </button>
    </div>
  );

  const renderSelectStage = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 h-96">
        <svg className="w-24 h-24 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <p className="text-xl text-gray-700 dark:text-gray-300">Create your image</p>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 text-white font-semibold text-sm px-4 py-1.5 rounded">Select from computer</button>
        <button onClick={() => setStage('generate')} className="text-blue-500 font-semibold text-sm mt-2">... or start with a prompt</button>
    </div>
  );

  const renderContent = () => {
    switch(stage) {
      case 'select':
        return renderSelectStage();
      case 'generate':
      case 'edit':
      case 'share':
        const imageUrl = generatedImageUrl || originalImage.url;
        return (
          <div className="p-4 space-y-4">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                    <SparklesIcon className="w-16 h-16" />
                    <p className="mt-2 font-semibold">Your generation will appear here</p>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex flex-col items-center justify-center">
                  <LoadingSpinner />
                  <p className="text-sm font-semibold mt-2 text-gray-600 dark:text-gray-300">InstaGen is creating...</p>
                </div>
              )}
            </div>
            
            {(stage === 'edit' || stage === 'generate') && (
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={stage === 'edit' ? "e.g., add a party hat on the dog" : "e.g., a cat in a spacesuit, hyperrealistic"}
                    rows={3}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                    style={{ colorScheme: 'light' }}
                  />
                  <SparklesIcon className="absolute top-2 right-2 text-gray-400" />
                </div>
              </div>
            )}

            {stage === 'share' && (
              <div>
                 <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
                 <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    rows={4}
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    style={{ colorScheme: 'light' }}
                  />
                  <div className="flex items-center mt-3">
                    <input
                        id="set-profile-pic"
                        type="checkbox"
                        checked={setAsProfile}
                        onChange={(e) => setSetAsProfile(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="set-profile-pic" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        Also set as profile picture
                    </label>
                  </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {renderHeader()}
        
        <div className="flex-grow overflow-y-auto">
          {renderContent()}
        </div>
        
        {stage === 'select' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded">Cancel</button>
            </div>
        )}
      </div>
    </div>
  );
};