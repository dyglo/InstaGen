
import React from 'react';
import type { PostType } from '../types';
import { HeartIcon, CommentIcon, SendIcon, BookmarkIcon, HeartIconFilled } from './icons/Icons';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onOpenComments: (post: PostType) => void;
}

export const Post: React.FC<PostProps> = ({ post, onLike, onOpenComments }) => {
  const handleCommentClick = () => onOpenComments(post);

  return (
    <article className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center p-3">
        <img src={post.avatarUrl} alt={post.username} className="w-8 h-8 rounded-full" />
        <span className="ml-3 font-semibold text-sm">{post.username}</span>
      </div>
      
      <div className="w-full bg-gray-100 dark:bg-black">
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button onClick={() => onLike(post.id)}>
              {post.isLiked ? <HeartIconFilled /> : <HeartIcon />}
            </button>
            <button onClick={handleCommentClick}><CommentIcon /></button>
            <button onClick={() => console.log('Send clicked for post', post.id)}><SendIcon /></button>
          </div>
          <div>
            <button><BookmarkIcon /></button>
          </div>
        </div>

        <p className="font-semibold text-sm mb-1">{post.likes.toLocaleString()} likes</p>

        <div className="text-sm">
          <span className="font-semibold mr-2">{post.username}</span>
          <span>{post.caption}</span>
        </div>
        
        {post.comments.length > 0 && (
          <p 
            className="text-xs text-gray-500 dark:text-gray-400 mt-2 cursor-pointer"
            onClick={handleCommentClick}
          >
            View all {post.comments.length} comments
          </p>
        )}
      </div>
    </article>
  );
};