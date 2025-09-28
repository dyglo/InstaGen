import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { BottomNav } from './components/BottomNav';
import { CreatePostModal } from './components/CreatePostModal';
import { ProfilePage } from './components/ProfilePage';
import { CommentModal } from './components/CommentModal';
import { ReelsPage } from './components/ReelsPage';
import { CreateReelModal } from './components/CreateReelModal';
import { SettingsModal } from './components/SettingsModal';
import { EditProfilePage } from './components/EditProfilePage';
import { CreateStoryModal } from './components/CreateStoryModal';
import { StoryViewer } from './components/StoryViewer';
import type { PostType, UserProfile, CommentType, ReelType, UserStory, StoryItem } from './types';
import { allUsers, initialUserProfileData, initialReels, initialStories } from './data/mock';
import { SearchIcon } from './components/icons/Icons';

const initialPosts: PostType[] = [];
const LOCAL_STORAGE_POSTS_KEY = 'instagen_posts';
const LOCAL_STORAGE_REELS_KEY = 'instagen_reels';
const LOCAL_STORAGE_STORIES_KEY = 'instagen_stories';
const LOCAL_STORAGE_USER_PROFILE_KEY = 'instagen_user_profile';
const LOCAL_STORAGE_THEME_KEY = 'instagen_theme';
const MEDIA_STORAGE_PREFIX = 'instagen_media_';


const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserProfile[]>([]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const lowercasedQuery = query.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.username.toLowerCase().includes(lowercasedQuery) ||
            user.name.toLowerCase().includes(lowercasedQuery)
        );
        setResults(filteredUsers);
    }, [query]);

    return (
        <div className="p-4 flex flex-col h-full bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />
            </div>

            <div className="flex-grow overflow-y-auto">
                {results.length > 0 ? (
                    results.map(user => (
                        <div key={user.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                            <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-sm">{user.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.name}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    query.trim() !== '' && <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No results found.</p>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>(() => {
    try {
        const savedPostsJson = window.localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
        if (!savedPostsJson) return initialPosts;
        
        const postsMetadata: Omit<PostType, 'imageUrl'>[] = JSON.parse(savedPostsJson);
        
        return postsMetadata.map(meta => {
            const imageUrl = window.localStorage.getItem(`${MEDIA_STORAGE_PREFIX}${meta.id}`);
            return {
                ...meta,
                imageUrl: imageUrl || '', 
            };
        });
    } catch (error) {
        console.error("Error reading posts from local storage:", error);
        return initialPosts;
    }
  });

  const [reels, setReels] = useState<ReelType[]>(() => {
      try {
        const savedReelsJson = window.localStorage.getItem(LOCAL_STORAGE_REELS_KEY);
        if (!savedReelsJson) return initialReels;
        
        const reelsMetadata: Omit<ReelType, 'videoUrl'>[] = JSON.parse(savedReelsJson);

        return reelsMetadata.map(meta => {
            const videoUrl = window.localStorage.getItem(`${MEDIA_STORAGE_PREFIX}${meta.id}`);
            return {
                ...meta,
                videoUrl: videoUrl || '',
            };
        });
      } catch (error) {
        console.error("Error reading reels from local storage:", error);
        return initialReels;
      }
  });
  
  const [stories, setStories] = useState<UserStory[]>(() => {
    try {
        const savedStoriesJson = window.localStorage.getItem(LOCAL_STORAGE_STORIES_KEY);
        if (!savedStoriesJson) return initialStories;
        
        const storiesMetadata: Omit<UserStory, 'stories'> & { stories: Omit<StoryItem, 'imageUrl'>[] }[] = JSON.parse(savedStoriesJson);
        
        return storiesMetadata.map(userStory => ({
            ...userStory,
            stories: userStory.stories.map(storyItem => {
                const imageUrl = window.localStorage.getItem(`${MEDIA_STORAGE_PREFIX}${storyItem.id}`);
                return { ...storyItem, imageUrl: imageUrl || '' };
            })
        }));
    } catch (error) {
        console.error("Error reading stories from local storage:", error);
        return initialStories;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
        const savedProfile = window.localStorage.getItem(LOCAL_STORAGE_USER_PROFILE_KEY);
        return savedProfile ? JSON.parse(savedProfile) : initialUserProfileData;
    } catch (error) {
        console.error("Error reading user profile from local storage:", error);
        return initialUserProfileData;
    }
  });
  
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [commentingItem, setCommentingItem] = useState<PostType | ReelType | null>(null);
  const [viewingStoryUserId, setViewingStoryUserId] = useState<string | null>(null);
  const [view, setView] = useState<'feed' | 'profile' | 'search' | 'reels'>('feed');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
      const savedTheme = window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (error) {
        console.error("Error saving user profile to local storage:", error);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
        const postsMetadata = posts.map(post => {
            const { imageUrl, ...meta } = post;
            if (imageUrl) {
                try {
                    window.localStorage.setItem(`${MEDIA_STORAGE_PREFIX}${post.id}`, imageUrl);
                } catch(e) {
                     console.error(`Error saving image for post ${post.id}:`, e);
                     if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                        alert('Storage is full. Could not save the new post image. You may need to delete older posts.');
                     }
                }
            }
            return meta;
        });
        
        window.localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(postsMetadata));
    } catch (error) {
        console.error("Error saving posts to local storage:", error);
    }
  }, [posts]);

  useEffect(() => {
    try {
        const reelsMetadata = reels.map(reel => {
            const { videoUrl, ...meta } = reel;
            if (videoUrl) {
                try {
                    window.localStorage.setItem(`${MEDIA_STORAGE_PREFIX}${reel.id}`, videoUrl);
                } catch (e) {
                     console.error(`Error saving video for reel ${reel.id}:`, e);
                      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                        alert('Storage is full. Could not save the new reel video. You may need to delete older content.');
                     }
                }
            }
            return meta;
        });
        
        window.localStorage.setItem(LOCAL_STORAGE_REELS_KEY, JSON.stringify(reelsMetadata));
    } catch (error) {
        console.error("Error saving reels to local storage:", error);
    }
  }, [reels]);

  useEffect(() => {
    try {
        const storiesMetadata = stories.map(userStory => {
            const storyItemsMetadata = userStory.stories.map(storyItem => {
                const { imageUrl, ...meta } = storyItem;
                if (imageUrl) {
                     try {
                        window.localStorage.setItem(`${MEDIA_STORAGE_PREFIX}${storyItem.id}`, imageUrl);
                    } catch (e) {
                        console.error(`Error saving image for story ${storyItem.id}:`, e);
                    }
                }
                return meta;
            });
            return { ...userStory, stories: storyItemsMetadata };
        });

        window.localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(storiesMetadata));
    } catch (error) {
        console.error("Error saving stories to local storage:", error);
    }
  }, [stories]);


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

  const handleUpdateProfile = useCallback((updatedData: { name: string; bio: string; avatarUrl: string; }) => {
    setUserProfile(prev => ({
        ...prev,
        ...updatedData,
    }));
    setIsEditingProfile(false);
  }, []);

  const handleCreatePost = useCallback((newPostData: Omit<PostType, 'id' | 'likes' | 'comments'>, setAsProfilePic: boolean) => {
    const newPost: PostType = {
      id: new Date().toISOString(),
      ...newPostData,
      likes: 0,
      comments: [],
      isLiked: false,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    if (setAsProfilePic) {
      setUserProfile(prevProfile => ({ ...prevProfile, avatarUrl: newPost.imageUrl }));
    }
    handleCloseCreatePostModal();
  }, [handleCloseCreatePostModal]);
  
  const handleCreateReel = useCallback((newReelData: Omit<ReelType, 'id' | 'likes' | 'comments' | 'isLiked' | 'audio'>) => {
    const newReel: ReelType = {
      id: new Date().toISOString(),
      ...newReelData,
      likes: 0,
      comments: [],
      isLiked: false,
      audio: { author: userProfile.username, title: 'Original Audio' }
    };
    setReels(prevReels => [newReel, ...prevReels]);
    handleCloseCreateReelModal();
    setView('reels');
  }, [handleCloseCreateReelModal, userProfile.username]);
  
  const handleCreateStory = useCallback((imageUrl: string) => {
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
  }, [userProfile, handleCloseCreateStoryModal]);

  const handleLikePost = useCallback((postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
      )
    );
  }, []);

  const handleLikeReel = useCallback((reelId: string) => {
    setReels(currentReels =>
      currentReels.map(reel =>
        reel.id === reelId ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 } : reel
      )
    );
  }, []);

  const handleAddComment = useCallback((itemId: string, commentText: string) => {
    if (!commentText.trim()) return;

    const newComment: CommentType = {
      id: new Date().toISOString() + Math.random(),
      text: commentText,
      username: userProfile.username,
      avatarUrl: userProfile.avatarUrl,
    };
    
    let itemFoundInPosts = false;
    const updatedPosts = posts.map(p => {
        if (p.id === itemId) {
            itemFoundInPosts = true;
            const updatedPost = { ...p, comments: [...p.comments, newComment] };
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
            const updatedReel = { ...r, comments: [...r.comments, newComment] };
            setCommentingItem(updatedReel);
            return updatedReel;
        }
        return r;
    });
    setReels(updatedReels);

  }, [posts, reels, userProfile]);

  const handleOpenCommentsModal = useCallback((item: PostType | ReelType) => {
    setCommentingItem(item);
  }, []);

  const handleCloseCommentsModal = useCallback(() => {
    setCommentingItem(null);
  }, []);


  const navigateToFeed = useCallback(() => setView('feed'), []);
  const navigateToProfile = useCallback(() => setView('profile'), []);
  const navigateToSearch = useCallback(() => setView('search'), []);
  const navigateToReels = useCallback(() => setView('reels'), []);

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
            />;
        case 'search':
            return <SearchPage />;
        case 'reels':
            return <ReelsPage 
                reels={reels} 
                onLikeReel={handleLikeReel} 
                onOpenComments={handleOpenCommentsModal}
                onGenerateReel={handleOpenCreateReelModal}
            />;
        default:
            return null;
    }
  }

  return (
    <div className="font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-md mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen flex flex-col bg-white dark:bg-gray-900">
        {view === 'feed' && <Header />}
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
