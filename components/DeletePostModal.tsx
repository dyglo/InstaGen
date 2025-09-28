import React from 'react';
import type { PostType } from '../types';

interface DeletePostModalProps {
  post: PostType | null;
  onClose: () => void;
  onDelete: (postId: string) => void;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({ post, onClose, onDelete }) => {
  if (!post) return null;

  const handleDelete = () => {
    onDelete(post.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full mx-4">
        <div className="p-4">
          <h3 id="delete-modal-title" className="text-lg font-semibold text-center mb-4">Delete Post?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg"
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              aria-label="Confirm post deletion"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
