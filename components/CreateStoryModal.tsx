import React, { useState, useRef } from 'react';
import { generateImage } from '../services/geminiService';
import { ArrowLeftIcon, SparklesIcon, LoadingSpinner } from './icons/Icons';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreateStory: (imageUrl: string) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreateStory }) => {
  const [stage, setStage] = useState<'select' | 'generate' | 'share'>('select');
  const [prompt, setPrompt] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await fileToDataUrl(file);
        setUploadedImageUrl(url);
        setStage('share');
      } catch (e) {
        setError("Could not load image file.");
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { base64Image } = await generateImage(prompt);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setGeneratedImageUrl(imageUrl);
      setStage('share');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const imageUrl = generatedImageUrl || uploadedImageUrl;
    if (imageUrl) {
      onCreateStory(imageUrl);
    }
  };

  const goBack = () => {
    if (stage === 'share' || stage === 'generate') {
      setStage('select');
      setGeneratedImageUrl(null);
      setUploadedImageUrl(null);
      setPrompt('');
      setError(null);
    } else {
      onClose();
    }
  };

  const handleHeaderAction = () => {
    if (stage === 'generate') {
      handleGenerate();
    } else if (stage === 'share') {
      handleShare();
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
      <button onClick={goBack} disabled={stage === 'select'} className={`${stage === 'select' ? 'opacity-0' : ''}`}>
        <ArrowLeftIcon />
      </button>
      <h2 className="font-semibold text-md">
        {stage === 'select' && 'Create Story'}
        {stage === 'generate' && 'Generate with AI'}
        {stage === 'share' && 'Add to story'}
      </h2>
      <button
        onClick={handleHeaderAction}
        disabled={isLoading || (stage === 'generate' && !prompt.trim())}
        className={`text-blue-500 font-semibold text-sm disabled:opacity-50 ${stage === 'select' ? 'opacity-0' : ''}`}
      >
        {stage === 'generate' ? 'Generate' : 'Add to story'}
      </button>
    </div>
  );

  const renderSelectStage = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
      <svg className="w-24 h-24 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <p className="text-xl text-gray-700 dark:text-gray-300">Create your story</p>
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      <button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 text-white font-semibold text-sm px-4 py-1.5 rounded">Select from computer</button>
      <button onClick={() => setStage('generate')} className="text-blue-500 font-semibold text-sm mt-2">... or generate with AI</button>
    </div>
  );
  
  const renderGenerateOrShareStage = () => {
      const imageUrl = generatedImageUrl || uploadedImageUrl;
      return (
          <div className="p-4 space-y-4">
            <div className="relative aspect-[9/16] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Story preview" className="w-full h-full object-contain rounded-md" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                  <SparklesIcon className="w-16 h-16" />
                  <p className="mt-2 font-semibold">Your generation will appear here</p>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 flex flex-col items-center justify-center p-4 text-center">
                  <LoadingSpinner />
                  <p className="text-sm font-semibold mt-2 text-gray-600 dark:text-gray-300">InstaGen is creating...</p>
                </div>
              )}
            </div>
            
            {stage === 'generate' && (
              <div>
                <label htmlFor="prompt-story" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
                <textarea
                  id="prompt-story"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., a shiba inu wearing sunglasses on a beach"
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
      );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {renderHeader()}
        
        <div className="flex-grow overflow-y-auto">
          {stage === 'select' ? renderSelectStage() : renderGenerateOrShareStage()}
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
