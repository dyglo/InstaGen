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
