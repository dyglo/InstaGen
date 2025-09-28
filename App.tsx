import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CreateReelModal } from './components/CreateReelModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { CommentModal } from './components/CommentModal';
import { EditProfilePage } from './components/EditProfilePage';
import { SettingsModal } from './components/SettingsModal';
import { StoryViewer } from './components/StoryViewer';
import { Feed } from './components/Feed';
import { CommentType, PostType, ReelType, UserProfile, UserStory, StoryItem, DatabaseUser } from './types';
import { ReelsPage } from './components/ReelsPage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { SearchIcon } from './components/icons/Icons';
import { dbService } from './services/databaseService';

const SearchPage: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DatabaseUser[]>([]);
    const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(new Map());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const searchUsers = async () => {
            setLoading(true);
            try {
                const users = await dbService.searchUsers(query);
                setResults(users);

                // Get follow status for each user
                const statusMap = new Map<string, boolean>();
                for (const user of users) {
                    try {
                        const isFollowing = await dbService.getFollowStatus(user.id);
                        statusMap.set(user.id, isFollowing);
                    } catch (error) {
                        console.error(`Failed to get follow status for user ${user.id}:`, error);
                    }
                }
                setFollowingStatus(statusMap);
            } catch (error) {
                console.error('Failed to search users:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleFollow = async (userId: string) => {
        try {
            await dbService.followUser(userId);
            setFollowingStatus(prev => new Map(prev.set(userId, true)));

            // Update the user in results to reflect new follower count
            setResults(prev => prev.map(user =>
                user.id === userId
                    ? { ...user, followers_count: (user.followers_count || 0) + 1 }
                    : user
            ));
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUnfollow = async (userId: string) => {
        try {
            await dbService.unfollowUser(userId);
            setFollowingStatus(prev => new Map(prev.set(userId, false)));

            // Update the user in results to reflect new follower count
            setResults(prev => prev.map(user =>
                user.id === userId
                    ? { ...user, followers_count: Math.max(0, (user.followers_count || 0) - 1) }
                    : user
            ));
        } catch (error) {
            console.error('Failed to unfollow user:', error);
        }
    };

    return (
        <div className="p-4 flex flex-col h-full bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Search Users</h1>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />
            </div>

            <div className="flex-grow overflow-y-auto">
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                )}

                {!loading && results.length > 0 ? (
                    results.map(user => {
                        const isFollowing = followingStatus.get(user.id) || false;
                        return (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mb-2">
                                <div className="flex items-center flex-1 cursor-pointer">
                                    <img
                                        src={user.avatar_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop'}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{user.username}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.name}</p>
                                        {user.bio && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                                                {user.bio}
                                            </p>
                                        )}
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{user.followers_count || 0} followers</span>
                                            <span className="mx-1">•</span>
                                            <span>{user.following_count || 0} following</span>
                                        </div>
                                    </div>
                                </div>

                                {user.id !== userProfile?.id && (
                                    <button
                                        onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                                        className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            isFollowing
                                                ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    !loading && query.trim() !== '' && (
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                            No users found for "{query}"
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [reels, setReels] = useState<ReelType[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [commentingItem, setCommentingItem] = useState<PostType | ReelType | null>(null);
  const [viewingStoryUserId, setViewingStoryUserId] = useState<string | null>(null);
  const [view, setView] = useState<'feed' | 'profile' | 'search' | 'reels'>('feed');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Load posts and reels from database on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load user feed (posts from followed users + own posts)
        const databasePosts = await dbService.getUserFeed(50, 0);
        const appPosts: PostType[] = databasePosts.map(dbPost => ({
          id: dbPost.id,
          username: dbPost.username,
          avatarUrl: dbPost.avatar_url,
          imageUrl: dbPost.image_url,
          caption: dbPost.caption,
          likes: dbPost.likes_count,
          comments: [],
          isLiked: dbPost.is_liked_by_current_user,
        }));
        setPosts(appPosts);

        // Load user reels feed
        const databaseReels = await dbService.getUserReelsFeed(50, 0);
        const appReels: ReelType[] = databaseReels.map(dbReel => ({
          id: dbReel.id,
          username: dbReel.username,
          avatarUrl: dbReel.avatar_url,
          videoUrl: dbReel.video_url,
          caption: dbReel.caption,
          likes: dbReel.likes_count,
          comments: [],
          isLiked: dbReel.is_liked_by_current_user,
          audio: {
            author: dbReel.audio_author,
            title: dbReel.audio_title,
          },
          prompt: dbReel.prompt || '',
        }));
        setReels(appReels);

        // Load stories from database
        const databaseStories = await dbService.getActiveStories();
        setStories(databaseStories);

      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };

    if (isAuthenticated) {
      loadContent();
    }
  }, [isAuthenticated]);


  const handleOpenCreatePostModal = useCallback(() => setIsCreatePostModalOpen(true), []);
  const handleCloseCreatePostModal = useCallback(() => setIsCreatePostModalOpen(false), []);
  const handleOpenCreateReelModal = useCallback(() => setIsCreateReelModalOpen(true), []);
  const handleCloseCreateReelModal = useCallback(() => setIsCreateReelModalOpen(false), []);
  const handleOpenCreateStoryModal = useCallback(() => setIsCreateStoryModalOpen(true), []);
  const handleCloseCreateStoryModal = useCallback(() => setIsCreateStoryModalOpen(false), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleOpenEditProfile = useCallback(() => {
    setIsSettingsOpen(false);
    setIsEditingProfile(true);
  }, []);
  const handleCloseEditProfile = useCallback(() => setIsEditingProfile(false), []);
  const handleOpenStoryViewer = useCallback((userId: string) => {
      setStories(prev => prev.map(s => s.userId === userId ? { ...s, hasUnseenStories: false } : s));
      setViewingStoryUserId(userId);
  }, []);
  const handleCloseStoryViewer = useCallback(() => setViewingStoryUserId(null), []);

  const handleUpdateProfile = useCallback(async (updatedData: { name: string; bio: string; avatarUrl: string; }) => {
    if (!userProfile) return;

    try {
      let finalAvatarUrl = updatedData.avatarUrl;

      // If avatarUrl is a data URL (newly uploaded image), upload it to storage
      if (updatedData.avatarUrl && updatedData.avatarUrl.startsWith('data:image')) {
        try {
          // Convert data URL to blob
          const response = await fetch(updatedData.avatarUrl);
          const blob = await response.blob();
          const file = new File([blob], `avatar_${userProfile.id}.jpg`, { type: 'image/jpeg' });

          // Upload to Supabase storage
          const filePath = `avatars/${userProfile.id}_${Date.now()}.jpg`;
          await dbService.uploadMedia(file, 'avatars', filePath);

          // Get the public URL
          finalAvatarUrl = await dbService.getMediaUrl('avatars', filePath);
        } catch (uploadError) {
          console.error('Failed to upload avatar:', uploadError);
          // Continue with the data URL as fallback
          finalAvatarUrl = updatedData.avatarUrl;
        }
      }

      // Update in database first
      await dbService.updateUser(userProfile.id, {
        name: updatedData.name,
        bio: updatedData.bio,
        avatar_url: finalAvatarUrl,
      });

      // Then update local state
      setUserProfile(prev => ({
        ...prev,
        name: updatedData.name,
        bio: updatedData.bio,
        avatarUrl: finalAvatarUrl,
      }));
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error message to the user here
      throw error; // Re-throw so EditProfilePage can handle the error
    }
  }, [userProfile]);

  const handleCreatePost = useCallback(async (newPostData: Omit<PostType, 'id' | 'likes' | 'comments'>, setAsProfilePic: boolean) => {
    if (!userProfile) return;

    try {
      const postData = {
        user_id: userProfile.id,
        image_url: newPostData.imageUrl,
        caption: newPostData.caption,
      };

      const createdPost = await dbService.createPost(postData);

      // Convert database post to app post format
      const newPost: PostType = {
        id: createdPost.id,
        username: createdPost.username,
        avatarUrl: createdPost.avatar_url,
        imageUrl: createdPost.image_url,
        caption: createdPost.caption,
        likes: createdPost.likes_count,
        comments: [], // Comments will be loaded separately
        isLiked: createdPost.is_liked_by_current_user,
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      if (setAsProfilePic) {
        setUserProfile(prevProfile => ({ ...prevProfile, avatarUrl: newPost.imageUrl }));
      }
      handleCloseCreatePostModal();
    } catch (error) {
      console.error('Failed to create post:', error);
      // You might want to show an error message to the user here
    }
  }, [userProfile, handleCloseCreatePostModal]);
  
  const handleCreateReel = useCallback(async (newReelData: Omit<ReelType, 'id' | 'likes' | 'comments' | 'isLiked' | 'audio'>) => {
    if (!userProfile) return;

    try {
      const reelData = {
        user_id: userProfile.id,
        video_url: newReelData.videoUrl,
        caption: newReelData.caption,
        audio_author: userProfile.username,
        audio_title: 'Original Audio',
        prompt: newReelData.prompt,
      };

      const createdReel = await dbService.createReel(reelData);

      // Convert database reel to app format
      const newReel: ReelType = {
        id: createdReel.id,
        username: createdReel.username,
        avatarUrl: createdReel.avatar_url,
        videoUrl: createdReel.video_url,
        caption: createdReel.caption,
        likes: createdReel.likes_count,
        comments: [],
        isLiked: createdReel.is_liked_by_current_user,
        audio: {
          author: createdReel.audio_author,
          title: createdReel.audio_title,
        },
        prompt: createdReel.prompt || '',
      };

      setReels(prevReels => [newReel, ...prevReels]);
      handleCloseCreateReelModal();
      setView('reels');
    } catch (error) {
      console.error('Failed to create reel:', error);
      // You might want to show an error message to the user here
    }
  }, [userProfile, handleCloseCreateReelModal]);
  
  const handleCreateStory = useCallback(async (imageUrl: string) => {
    if (!userProfile) return;

    try {
      await dbService.createStory(imageUrl);

      const newStoryItem: StoryItem = {
        id: `story_${new Date().toISOString()}`,
        imageUrl,
        createdAt: new Date().toISOString(),
        duration: 5000,
      };

      setStories(prevStories => {
        const userStoryExists = prevStories.some(s => s.userId === userProfile.id);
        if (userStoryExists) {
          return prevStories.map(userStory =>
            userStory.userId === userProfile.id
              ? { ...userStory, stories: [...userStory.stories, newStoryItem], hasUnseenStories: true }
              : userStory
          );
        } else {
          const newUserStory: UserStory = {
            userId: userProfile.id,
            username: userProfile.username,
            avatarUrl: userProfile.avatarUrl,
            stories: [newStoryItem],
            hasUnseenStories: true,
          };
          return [newUserStory, ...prevStories];
        }
      });
      handleCloseCreateStoryModal();
    } catch (error) {
      console.error('Failed to create story:', error);
      // You might want to show an error message to the user here
    }
  }, [userProfile, handleCloseCreateStoryModal]);

  const handleLikePost = useCallback(async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const wasLiked = post.isLiked;

      // Optimistically update UI
      setPosts(currentPosts =>
        currentPosts.map(p =>
          p.id === postId
            ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );

      // Update database
      if (wasLiked) {
        await dbService.unlikePost(postId);
      } else {
        await dbService.likePost(postId);
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      // Revert optimistic update on error
      setPosts(currentPosts =>
        currentPosts.map(p =>
          p.id === postId
            ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
    }
  }, [posts]);

  const handleLikeReel = useCallback(async (reelId: string) => {
    try {
      const reel = reels.find(r => r.id === reelId);
      if (!reel) return;

      const wasLiked = reel.isLiked;

      // Optimistically update UI
      setReels(currentReels =>
        currentReels.map(r =>
          r.id === reelId
            ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
            : r
        )
      );

      // Update database
      if (wasLiked) {
        await dbService.unlikeReel(reelId);
      } else {
        await dbService.likeReel(reelId);
      }
    } catch (error) {
      console.error('Failed to update reel like:', error);
      // Revert optimistic update on error
      setReels(currentReels =>
        currentReels.map(r =>
          r.id === reelId
            ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
            : r
        )
      );
    }
  }, [reels]);

  const handleAddComment = useCallback(async (itemId: string, commentText: string) => {
    if (!commentText.trim()) return;

    try {
      const newComment = await dbService.createComment(commentText, itemId);

      // Update local state with the comment from database
      const databaseComment: CommentType = {
        id: newComment.id,
        username: newComment.username,
        avatarUrl: newComment.avatar_url,
        text: newComment.text,
      };

      let itemFoundInPosts = false;
      const updatedPosts = posts.map(p => {
        if (p.id === itemId) {
          itemFoundInPosts = true;
          const updatedPost = { ...p, comments: [...p.comments, databaseComment] };
          setCommentingItem(updatedPost);
          return updatedPost;
        }
        return p;
      });

      if (itemFoundInPosts) {
        setPosts(updatedPosts);
        return;
      }

      const updatedReels = reels.map(r => {
        if (r.id === itemId) {
          const updatedReel = { ...r, comments: [...r.comments, databaseComment] };
          setCommentingItem(updatedReel);
          return updatedReel;
        }
        return r;
      });
      setReels(updatedReels);

    } catch (error) {
      console.error('Failed to add comment:', error);
      // You might want to show an error message to the user here
    }
  }, [posts, reels]);

  const handleOpenLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const handleCloseLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const handleOpenSignUpModal = useCallback(() => setIsSignUpModalOpen(true), []);
  const handleCloseSignUpModal = useCallback(() => setIsSignUpModalOpen(false), []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const user = await dbService.signIn(email, password);
      if (user) {
        setIsAuthenticated(true);
        setUserProfile({
          id: user.id,
          username: user.username,
          name: user.name,
          avatarUrl: user.avatar_url || '',
          bio: user.bio || '',
          stats: {
            posts: user.posts_count || 0,
            followers: user.followers_count || 0,
            following: user.following_count || 0,
          }
        });
        handleCloseLoginModal();
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [handleCloseLoginModal]);

  const handleSignUp = useCallback(async (name: string, username: string, email: string, password: string) => {
    try {
      const user = await dbService.signUp(email, password, name, username);
      if (user) {
        setIsAuthenticated(true);
        setUserProfile({
          id: user.id,
          username: user.username,
          name: user.name,
          avatarUrl: user.avatar_url || '',
          bio: user.bio || '',
          stats: {
            posts: user.posts_count || 0,
            followers: user.followers_count || 0,
            following: user.following_count || 0,
          }
        });
        handleCloseSignUpModal();
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }, [handleCloseSignUpModal]);

  const handleDeletePost = useCallback(async (postId: string) => {
    try {
      await dbService.deletePost(postId);

      // Update local state by removing the post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

      // Also update user profile stats if needed
      if (userProfile) {
        setUserProfile(prevProfile => ({
          ...prevProfile,
          stats: {
            ...prevProfile.stats,
            posts: Math.max(0, prevProfile.stats.posts - 1)
          }
        }));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      // Show user-friendly error message
      alert('Failed to delete post. Please try again.');
    }
  }, [userProfile]);

  const handleLogout = useCallback(async () => {
    try {
      await dbService.signOut();
      setIsAuthenticated(false);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear local state
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    // LoginPage will trigger this after successful authentication
  }, []);

  const handleLoginPageLogin = useCallback(async (email: string, password: string) => {
    await handleLogin(email, password);
  }, [handleLogin]);

  const handleLoginPageSignUp = useCallback(async (name: string, username: string, email: string, password: string) => {
    await handleSignUp(name, username, email, password);
  }, [handleSignUp]);
  const handleOpenCommentsModal = useCallback((item: PostType | ReelType) => {
    setCommentingItem(item);
  }, []);
  const handleCloseCommentsModal = useCallback(() => {
    setCommentingItem(null);
  }, []);
  const handleShare = useCallback(async (item: PostType | ReelType) => {
    try {
      const shareUrl = `${window.location.origin}/?item=${item.id}`;

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Check out this ${item.id.startsWith('reel') ? 'reel' : 'post'}`,
          text: item.caption || `Shared from InstaGen`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(shareUrl);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback: copy to clipboard manually
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/?item=${item.id}`);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  }, []);

  const navigateToFeed = useCallback(() => setView('feed'), []);
  const navigateToProfile = useCallback(() => setView('profile'), []);
  const navigateToSearch = useCallback(() => setView('search'), []);
  const navigateToReels = useCallback(() => setView('reels'), []);
  const totalUserLikes = React.useMemo(() => {
    if (!userProfile) return 0;
    return posts
      .filter(post => post.user_id === userProfile.id)
      .reduce((total, post) => total + post.likes_count, 0);
  }, [posts, userProfile]);

  const totalUserComments = React.useMemo(() => {
    if (!userProfile) return 0;
    return posts
      .filter(post => post.user_id === userProfile.id)
      .reduce((total, post) => total + post.comments_count, 0);
  }, [posts, userProfile]);

  const renderContent = () => {
    switch(view) {
        case 'feed':
            return <Feed 
                posts={posts} 
                stories={stories}
                userProfile={userProfile}
                onLike={handleLikePost} 
                onOpenComments={handleOpenCommentsModal}
                onOpenStoryViewer={handleOpenStoryViewer}
                onOpenCreateStory={handleOpenCreateStoryModal}
                onShare={handleShare}
            />;
        case 'profile':
            return <ProfilePage 
                userProfile={userProfile} 
                posts={posts} 
                reels={reels} 
                stories={stories}
                onAddPostClick={handleOpenCreatePostModal} 
                onOpenSettings={handleOpenSettings}
                onOpenStoryViewer={handleOpenStoryViewer}
                onDeletePost={handleDeletePost}
            />;
        case 'search':
            return <SearchPage userProfile={userProfile} />;
        case 'reels':
            return <ReelsPage 
                reels={reels} 
                onLikeReel={handleLikeReel} 
                onOpenComments={handleOpenCommentsModal}
                onGenerateReel={handleOpenCreateReelModal}
                onShare={handleShare}
            />;
        default:
            return null;
    }
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-black min-h-screen">
        <LoginPage
          onLogin={handleLoginPageLogin}
          onSignUp={handleLoginPageSignUp}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-md mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen flex flex-col bg-white dark:bg-gray-900">
        {view === 'feed' && <Header totalLikes={totalUserLikes} totalComments={totalUserComments} />}
        <main className="flex-grow overflow-y-auto relative">
          {renderContent()}
        </main>
        <BottomNav
            currentView={view}
            onPlusClick={handleOpenCreatePostModal}
            onHomeClick={navigateToFeed}
            onProfileClick={navigateToProfile}
            onSearchClick={navigateToSearch}
            onReelsClick={navigateToReels}
        />
      </div>

      {isCreatePostModalOpen && (
        <CreatePostModal
          userProfile={userProfile}
          onClose={handleCloseCreatePostModal}
          onCreatePost={handleCreatePost}
        />
      )}

      {isCreateReelModalOpen && (
        <CreateReelModal
            userProfile={userProfile}
            onClose={handleCloseCreateReelModal}
            onCreateReel={handleCreateReel}
        />
      )}

      {isCreateStoryModalOpen && (
        <CreateStoryModal
          onClose={handleCloseCreateStoryModal}
          onCreateStory={handleCreateStory}
        />
      )}

      {commentingItem && (
        <CommentModal
          userProfile={userProfile}
          item={commentingItem}
          onClose={handleCloseCommentsModal}
          onAddComment={handleAddComment}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
            onClose={handleCloseSettings}
            onEditProfileClick={handleOpenEditProfile}
            currentTheme={theme}
            onThemeChange={setTheme}
            onLogout={handleLogout}
        />
      )}

      {isEditingProfile && (
        <EditProfilePage
            userProfile={userProfile}
            onClose={handleCloseEditProfile}
            onSave={handleUpdateProfile}
        />
      )}

      {viewingStoryUserId && (
        <StoryViewer
            stories={stories}
            startUserId={viewingStoryUserId}
            onClose={handleCloseStoryViewer}
        />
      )}
    </div>
  );
};

export default App;
