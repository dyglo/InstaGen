
import React from 'react';
import { SendIcon, HeartIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Grand Hotel', cursive" }}>
          InstaGen
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-1">
            <HeartIcon />
          </button>
          <button className="p-1">
            <SendIcon />
          </button>
        </div>
      </div>
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap');
      `}</style>
    </header>
  );
};