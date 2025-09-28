export interface CommentType {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
}

export interface PostType {
  id: string;
  username: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: CommentType[];
  isLiked?: boolean;
}

export interface ReelType {
  id: string;
  username: string;
  avatarUrl: string;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: CommentType[];
  isLiked?: boolean;
  audio: {
    author: string;
    title: string;
  };
  prompt: string;
}

export type CommentableItem = PostType | ReelType;

export interface UserProfile {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
}

export interface StoryItem {
  id: string;
  imageUrl: string; // base64 data URL
  createdAt: string; // ISO string
  duration: number; // in milliseconds
}

export interface UserStory {
  userId: string;
  username: string;
  avatarUrl: string;
  stories: StoryItem[];
  hasUnseenStories?: boolean;
}

// Database-specific types for Supabase integration
export interface DatabasePost {
  id: string;
  user_id: string;
  username: string;
  name: string;
  avatar_url: string;
  image_url: string;
  caption: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked_by_current_user: boolean;
}

export interface DatabaseReel {
  id: string;
  user_id: string;
  username: string;
  name: string;
  avatar_url: string;
  video_url: string;
  caption: string;
  audio_author: string;
  audio_title: string;
  prompt: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked_by_current_user: boolean;
}

export interface DatabaseComment {
  id: string;
  user_id: string;
  post_id?: string;
  reel_id?: string;
  text: string;
  username: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  reels_count?: number;
}

export interface DatabaseStory {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

// Utility types for form inputs
export interface CreatePostData {
  image_url: string;
  caption?: string;
}

export interface CreateReelData {
  video_url: string;
  caption?: string;
  audio_author?: string;
  audio_title?: string;
  prompt?: string;
}

export interface CreateCommentData {
  text: string;
  post_id?: string;
  reel_id?: string;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  avatar_url?: string;
}
