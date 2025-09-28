
import React from 'react';
import { SendIcon, HeartIcon, MenuIcon, CommentIcon } from './icons/Icons';

interface HeaderProps {
  onMenuClick?: () => void;
  totalLikes?: number;
  totalComments?: number;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, totalLikes = 0, totalComments = 0 }) => {
  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Grand Hotel', cursive" }}>
          InstaGen
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-1 relative">
            <HeartIcon />
            {totalLikes > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalLikes > 99 ? '99+' : totalLikes}
              </span>
            )}
          </button>
          <button className="p-1 relative">
            <CommentIcon />
            {totalComments > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalComments > 99 ? '99+' : totalComments}
              </span>
            )}
          </button>
          <button className="p-1">
            <SendIcon />
          </button>
          {onMenuClick && (
            <button onClick={onMenuClick} className="p-1">
              <MenuIcon />
            </button>
          )}
        </div>
      </div>
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap');
      `}</style>
    </header>
  );
};