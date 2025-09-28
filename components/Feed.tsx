import React from 'react';
import type { PostType, UserStory, UserProfile } from '../types';
import { Post } from './Post';
import { StoriesTray } from './StoriesTray';

interface FeedProps {
  posts: PostType[];
  stories: UserStory[];
  userProfile: UserProfile;
  onLike: (postId: string) => void;
  onOpenComments: (post: PostType) => void;
  onOpenStoryViewer: (userId: string) => void;
  onOpenCreateStory: () => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, stories, userProfile, onLike, onOpenComments, onOpenStoryViewer, onOpenCreateStory }) => {
  return (
    <div>
      <StoriesTray 
        stories={stories} 
        userProfile={userProfile}
        onOpenStoryViewer={onOpenStoryViewer}
        onOpenCreateStory={onOpenCreateStory}
      />
      {posts.map(post => (
        <Post key={post.id} post={post} onLike={onLike} onOpenComments={onOpenComments} />
      ))}
    </div>
  );
};
