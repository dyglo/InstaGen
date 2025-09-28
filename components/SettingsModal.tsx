
import React from 'react';
import { EditProfileIcon, ThemeIcon, AccountSwitchIcon, LogOutIcon, CloseIcon } from './icons/Icons'; 

interface SettingsModalProps {
    onClose: () => void;
    onEditProfileClick: () => void;
    currentTheme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean; isToggle?: boolean; children?: React.ReactNode }> = ({ icon, label, onClick, disabled, isToggle, children }) => {
    const content = (
        <>
            {icon}
            <span className="ml-4 flex-grow">{label}</span>
            {isToggle && children}
        </>
    );

    if (disabled) {
        return <div className="flex items-center p-4 text-gray-400 dark:text-gray-600 cursor-not-allowed">{content}</div>;
    }

    return (
        <button onClick={onClick} className="w-full flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {content}
        </button>
    );
};


export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onEditProfileClick, currentTheme, onThemeChange }) => {
    
    const handleToggle = () => {
        onThemeChange(currentTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div 
                className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl w-full max-w-md flex flex-col transition-transform transform translate-y-full animate-slide-up"
            >
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-center relative">
                    <div className="h-1.5 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
                        <CloseIcon />
                    </button>
                </div>
                <div className="py-2">
                    <MenuItem icon={<EditProfileIcon />} label="Edit Profile" onClick={onEditProfileClick} />
                    <MenuItem icon={<ThemeIcon />} label="Dark Mode" isToggle>
                        <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="theme-toggle" className="sr-only peer" checked={currentTheme === 'dark'} onChange={handleToggle} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                        </label>
                    </MenuItem>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <MenuItem icon={<AccountSwitchIcon />} label="Switch Account" disabled />
                    <MenuItem icon={<LogOutIcon />} label="Sign Up" disabled />
                    <MenuItem icon={<LogOutIcon />} label="Log In" disabled />
                </div>
                <style>{`
                    @keyframes slide-up {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                    .animate-slide-up {
                        animation: slide-up 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};
