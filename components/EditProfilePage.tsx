
import React, { useState, useRef } from 'react';
import type { UserProfile } from '../types';
import { CloseIcon, CheckIcon } from './icons/Icons';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface EditProfilePageProps {
    userProfile: UserProfile;
    onClose: () => void;
    onSave: (updatedData: { name: string; bio: string; avatarUrl: string; }) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ userProfile, onClose, onSave }) => {
    const [name, setName] = useState(userProfile.name);
    const [bio, setBio] = useState(userProfile.bio);
    const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onSave({ name, bio, avatarUrl });
    };
    
    const handleAvatarChangeClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setAvatarUrl(dataUrl);
            } catch (error) {
                console.error("Error converting file to data URL:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
            <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button onClick={onClose}><CloseIcon /></button>
                <h2 className="font-semibold text-md">Edit Profile</h2>
                <button onClick={handleSave} className="text-blue-500 font-bold"><CheckIcon /></button>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4">
                <div className="flex flex-col items-center">
                    <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={handleAvatarChangeClick} className="text-blue-500 font-semibold text-sm">
                        Change profile photo
                    </button>
                </div>
                
                <div className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs text-gray-500 dark:text-gray-400">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1"
                        />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-xs text-gray-500 dark:text-gray-400">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
