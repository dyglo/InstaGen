import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { PostType, ReelType, UserProfile, CommentType, UserStory, StoryItem } from '../types';

// Database types (these should match your Supabase schema)
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

class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // User operations
  async getCurrentUser(): Promise<DatabaseUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserById(id: string): Promise<DatabaseUser | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  }

  async searchUsers(query: string): Promise<DatabaseUser[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  async createUser(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(id: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Authentication operations
  async signUp(email: string, password: string, name: string, username: string): Promise<DatabaseUser> {
    // Create auth user
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user account');

    // Create user profile in the users table
    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        username,
      })
      .select()
      .single();

    if (userError) {
      // If user creation fails, we should clean up the auth user
      // For now, just throw the error
      throw userError;
    }

    return userData;
  }

  async signIn(email: string, password: string): Promise<DatabaseUser | null> {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) return null;

    // Get user profile from the users table
    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;
    return userData;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUserAuth(): Promise<any> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  // Post operations
  async getPosts(limit = 20, offset = 0): Promise<DatabasePost[]> {
    const { data, error } = await this.supabase
      .from('posts_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getUserPosts(userId: string): Promise<DatabasePost[]> {
    const { data, error } = await this.supabase
      .from('posts_with_stats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPost(postData: { user_id: string; image_url: string; caption?: string }): Promise<DatabasePost> {
    const { data, error } = await this.supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;

    // Get the created post with stats
    const { data: postWithStats, error: statsError } = await this.supabase
      .from('posts_with_stats')
      .select('*')
      .eq('id', data.id)
      .single();

    if (statsError) throw statsError;
    return postWithStats;
  }

  async deletePost(postId: string): Promise<void> {
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  }

  // Reel operations
  async getReels(limit = 20, offset = 0): Promise<DatabaseReel[]> {
    const { data, error } = await this.supabase
      .from('reels_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getUserReels(userId: string): Promise<DatabaseReel[]> {
    const { data, error } = await this.supabase
      .from('reels_with_stats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createReel(reelData: { user_id: string; video_url: string; caption?: string; audio_author?: string; audio_title?: string; prompt?: string }): Promise<DatabaseReel> {
    const { data, error } = await this.supabase
      .from('reels')
      .insert(reelData)
      .select()
      .single();

    if (error) throw error;

    // Get the created reel with stats
    const { data: reelWithStats, error: statsError } = await this.supabase
      .from('reels_with_stats')
      .select('*')
      .eq('id', data.id)
      .single();

    if (statsError) throw statsError;
    return reelWithStats;
  }

  async deleteReel(reelId: string): Promise<void> {
    const { error } = await this.supabase
      .from('reels')
      .delete()
      .eq('id', reelId);

    if (error) throw error;
  }

  // Like operations
  async likePost(postId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('likes')
      .insert({
        user_id: user.id,
        post_id: postId
      });

    if (error) throw error;
  }

  async unlikePost(postId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId);

    if (error) throw error;
  }

  async likeReel(reelId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('likes')
      .insert({
        user_id: user.id,
        reel_id: reelId
      });

    if (error) throw error;
  }

  async unlikeReel(reelId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('reel_id', reelId);

    if (error) throw error;
  }

  // Comment operations
  async getComments(postId?: string, reelId?: string): Promise<DatabaseComment[]> {
    let query = this.supabase
      .from('comments')
      .select(`
        *,
        users!comments_user_id_fkey (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: true });

    if (postId) {
      query = query.eq('post_id', postId);
    } else if (reelId) {
      query = query.eq('reel_id', reelId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createComment(
    text: string,
    postId?: string,
    reelId?: string
  ): Promise<DatabaseComment> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('comments')
      .insert({
        user_id: user.id,
        post_id: postId,
        reel_id: reelId,
        text
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  // Story operations
  async getActiveStories(): Promise<UserStory[]> {
    const { data, error } = await this.supabase
      .from('stories')
      .select(`
        *,
        users!stories_user_id_fkey (
          username,
          avatar_url
        )
      `)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group stories by user
    const storiesByUser = new Map<string, any>();
    (data || []).forEach(story => {
      const userId = story.user_id;
      if (!storiesByUser.has(userId)) {
        storiesByUser.set(userId, {
          userId,
          username: story.users.username,
          avatarUrl: story.users.avatar_url,
          stories: []
        });
      }
      storiesByUser.get(userId).stories.push({
        id: story.id,
        imageUrl: story.image_url,
        createdAt: story.created_at,
        duration: 5000
      });
    });

    return Array.from(storiesByUser.values());
  }

  async createStory(imageUrl: string): Promise<DatabaseStory> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('stories')
      .insert({
        user_id: user.id,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Storage operations for media files
  async uploadMedia(file: File, bucket: string, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data.path;
  }

  async getMediaUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async deleteMedia(bucket: string, paths: string[]): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) throw error;
  }

  // Follow operations using the new database functions
  async followUser(userId: string): Promise<void> {
    const { error } = await this.supabase.rpc('follow_user', {
      target_user_id: userId
    });
    if (error) throw error;
  }

  async unfollowUser(userId: string): Promise<void> {
    const { error } = await this.supabase.rpc('unfollow_user', {
      target_user_id: userId
    });
    if (error) throw error;
  }

  async getUserProfile(userId: string): Promise<DatabaseUser | null> {
    const { data, error } = await this.supabase
      .rpc('get_user_profile', { user_id: userId });
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  }

  async getUserFeed(limit = 20, offset = 0): Promise<DatabasePost[]> {
    // Use the posts_with_stats view directly to get posts
    const { data, error } = await this.supabase
      .from('posts_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const posts = data || [];

    // If user is authenticated, update like status for each post
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (user) {
        // Get current user's likes for all posts
        const postIds = posts.map(post => post.id);
        if (postIds.length > 0) {
          const { data: userLikes } = await this.supabase
            .from('likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

          const likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);

          // Update posts with correct like status
          return posts.map(post => ({
            ...post,
            is_liked_by_current_user: likedPostIds.has(post.id)
          }));
        }
      }
    } catch (authError) {
      // If there's an error checking auth status, just return posts as-is
      console.warn('Failed to check user authentication for like status:', authError);
    }

    return posts;
  }

  async getUserReelsFeed(limit = 20, offset = 0): Promise<DatabaseReel[]> {
    // Use the reels_with_stats view directly to get reels
    const { data, error } = await this.supabase
      .from('reels_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const reels = data || [];

    // If user is authenticated, update like status for each reel
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (user) {
        // Get current user's likes for all reels
        const reelIds = reels.map(reel => reel.id);
        if (reelIds.length > 0) {
          const { data: userLikes } = await this.supabase
            .from('likes')
            .select('reel_id')
            .eq('user_id', user.id)
            .in('reel_id', reelIds);

          const likedReelIds = new Set(userLikes?.map(like => like.reel_id) || []);

          // Update reels with correct like status
          return reels.map(reel => ({
            ...reel,
            is_liked_by_current_user: likedReelIds.has(reel.id)
          }));
        }
      }
    } catch (authError) {
      // If there's an error checking auth status, just return reels as-is
      console.warn('Failed to check user authentication for reel like status:', authError);
    }

    return reels;
  }

  async getFollowStatus(targetUserId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await this.supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
}

// Export singleton instance
export const dbService = new DatabaseService();
export default dbService;
