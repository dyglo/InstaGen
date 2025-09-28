import type { UserProfile, ReelType, UserStory, PostType } from '../types';

export const initialUserProfileData: UserProfile = {
    id: 'user1',
    username: 'tafar_m',
    name: 'Tafar M',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
    bio: 'Creator and developer of InstaGen.',
    stats: {
        posts: 1134,
        followers: 938000,
        following: 9,
    }
};

export const initialReels: ReelType[] = [];

export const initialPosts: PostType[] = [
    {
        id: 'post1',
        username: 'tafar_m',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
        imageUrl: 'https://picsum.photos/id/10/1080/1080',
        caption: 'Beautiful sunset from today\'s adventure! 🌅',
        likes: 1247,
        comments: [],
        isLiked: false,
    },
    {
        id: 'post2',
        username: 'art_explorer',
        avatarUrl: 'https://picsum.photos/id/1011/50/50',
        imageUrl: 'https://picsum.photos/id/20/1080/1080',
        caption: 'Street art finds in the city center 🎨',
        likes: 892,
        comments: [],
        isLiked: false,
    },
    {
        id: 'post3',
        username: 'urban_wanderer',
        avatarUrl: 'https://picsum.photos/id/1025/50/50',
        imageUrl: 'https://picsum.photos/id/30/1080/1080',
        caption: 'Coffee and city views ☕️🏙️',
        likes: 634,
        comments: [],
        isLiked: false,
    },
    {
        id: 'post4',
        username: 'pixel_dreamer',
        avatarUrl: 'https://picsum.photos/id/1012/50/50',
        imageUrl: 'https://picsum.photos/id/40/1080/1080',
        caption: 'AI-generated dreamscape ✨',
        likes: 2156,
        comments: [],
        isLiked: false,
    },
    {
        id: 'post5',
        username: 'lisa_anderson',
        avatarUrl: 'https://picsum.photos/id/237/50/50',
        imageUrl: 'https://picsum.photos/id/50/1080/1080',
        caption: 'Weekend adventures with my furry friend 🐕‍🦺',
        likes: 445,
        comments: [],
        isLiked: false,
    },
];

export const allUsers: UserProfile[] = [
  initialUserProfileData,
  {
    id: 'user2',
    username: 'art_explorer',
    name: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/id/1011/50/50',
    bio: 'Chasing the morning light. 🌅',
    stats: { posts: 150, followers: 5000, following: 200 }
  },
  {
    id: 'user3',
    username: 'urban_wanderer',
    name: 'Casey Lee',
    avatarUrl: 'https://picsum.photos/id/1025/50/50',
    bio: 'Cityscapes and coffee sips.',
    stats: { posts: 320, followers: 8500, following: 300 }
  },
  {
    id: 'user4',
    username: 'pixel_dreamer',
    name: 'Samira Khan',
    avatarUrl: 'https://picsum.photos/id/1012/50/50',
    bio: 'AI art & digital dreams.',
    stats: { posts: 50, followers: 12000, following: 50 }
  },
  {
    id: 'user5',
    username: 'lisa_anderson',
    name: 'Lisa Anderson',
    avatarUrl: 'https://picsum.photos/id/237/50/50',
    bio: 'Dog lover and adventurer.',
    stats: { posts: 400, followers: 2200, following: 600 }
  }
];

export const initialStories: UserStory[] = [
    {
        userId: 'user2',
        username: 'art_explorer',
        avatarUrl: 'https://picsum.photos/id/1011/50/50',
        stories: [
            { id: 'story1', imageUrl: 'https://picsum.photos/id/10/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
            { id: 'story2', imageUrl: 'https://picsum.photos/id/11/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
        ],
        hasUnseenStories: true,
    },
    {
        userId: 'user3',
        username: 'urban_wanderer',
        avatarUrl: 'https://picsum.photos/id/1025/50/50',
        stories: [
            { id: 'story3', imageUrl: 'https://picsum.photos/id/20/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
        ],
        hasUnseenStories: true,
    },
     {
        userId: 'user4',
        username: 'pixel_dreamer',
        avatarUrl: 'https://picsum.photos/id/1012/50/50',
        stories: [
            { id: 'story4', imageUrl: 'https://picsum.photos/id/30/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
            { id: 'story5', imageUrl: 'https://picsum.photos/id/31/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
            { id: 'story6', imageUrl: 'https://picsum.photos/id/32/1080/1920', createdAt: new Date().toISOString(), duration: 5000 },
        ],
        hasUnseenStories: true,
    },
];
