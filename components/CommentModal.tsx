
import React, { useState, useEffect, useRef } from 'react';
import type { CommentableItem, CommentType, PostType, UserProfile } from '../types';
import { CloseIcon } from './icons/Icons';

interface CommentModalProps {
  userProfile: UserProfile;
  item: CommentableItem;
  onClose: () => void;
  onAddComment: (itemId: string, commentText: string) => void;
}

const isPost = (item: CommentableItem): item is PostType => {
    return 'imageUrl' in item;
}

const CommentItem: React.FC<{ comment: CommentType }> = ({ comment }) => (
  <div className="flex items-start space-x-3 py-2">
    <img src={comment.avatarUrl} alt={comment.username} className="w-8 h-8 rounded-full" />
    <div className="text-sm">
      <span className="font-semibold mr-2">{comment.username}</span>
      <span>{comment.text}</span>
    </div>
  </div>
);

export const CommentModal: React.FC<CommentModalProps> = ({ userProfile, item, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment);
      setNewComment('');
    }
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [item.comments]);
  
  const showImage = isPost(item);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-4xl sm:h-[90vh] flex flex-col sm:flex-row">
        {/* Image Section (hidden on smaller screens or if item is a Reel) */}
        {showImage && (
            <div className="hidden sm:block sm:w-1/2 md:w-3/5 bg-black flex-shrink-0">
                <img src={item.imageUrl} alt="Post" className="w-full h-full object-contain" />
            </div>
        )}

        {/* Comments Section */}
        <div className={`w-full ${showImage ? 'sm:w-1/2 md:w-2/5' : ''} flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center">
              <img src={item.avatarUrl} alt={item.username} className="w-8 h-8 rounded-full" />
              <span className="ml-3 font-semibold text-sm">{item.username}</span>
            </div>
            <button onClick={onClose}><CloseIcon className="w-5 h-5" /></button>
          </div>

          {/* Comments List */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Post Caption */}
            {item.caption && <CommentItem comment={{ id: 'caption', ...item, text: item.caption }} />}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            {/* User Comments */}
            {item.comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Add Comment Form */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <img src={userProfile.avatarUrl} alt="Your avatar" className="w-8 h-8 rounded-full" />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-transparent focus:outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="text-blue-500 font-semibold text-sm disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};