
import React from 'react';
import { HomeIcon, SearchIcon, PlusCircleIcon, ReelsIcon, ProfileIcon } from './icons/Icons';

interface BottomNavProps {
  currentView: 'feed' | 'profile' | 'search' | 'reels';
  onPlusClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  onSearchClick: () => void;
  onReelsClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onPlusClick, onHomeClick, onProfileClick, onSearchClick, onReelsClick }) => {
  const activeStrokeWidth = 2.5;
  const defaultStrokeWidth = 1.8;

  return (
    <nav className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-20">
      <div className="flex items-center justify-around h-14">
        <button onClick={onHomeClick} className="p-2"><HomeIcon strokeWidth={currentView === 'feed' ? activeStrokeWidth : defaultStrokeWidth} /></button>
        <button onClick={onSearchClick} className="p-2"><SearchIcon strokeWidth={currentView === 'search' ? activeStrokeWidth : defaultStrokeWidth} /></button>
        <button onClick={onPlusClick} className="p-2"><PlusCircleIcon /></button>
        <button onClick={onReelsClick} className="p-2"><ReelsIcon strokeWidth={currentView === 'reels' ? activeStrokeWidth : defaultStrokeWidth} /></button>
        <button onClick={onProfileClick} className="p-2"><ProfileIcon strokeWidth={currentView === 'profile' ? activeStrokeWidth : defaultStrokeWidth} /></button>
      </div>
    </nav>
  );
};