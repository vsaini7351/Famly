import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../utils/authContext";
import api from "../../utils/axios";
import { Users, Crown, Home, Heart, MessageCircle, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { Link } from "react-router-dom"; 

// ====================================================================
// Throttle Utility: Limits how often a function can run (e.g., scroll handler)
// NO CHANGE - KEPT AS IS
// ====================================================================
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ====================================================================
// StoryCard Component: NO CHANGE - KEPT AS IS
// ====================================================================
const StoryCard = ({ story, currentUserUserId }) => {
    // --- REVISED: Extract uploader details from the component's context/props ---
    // The current user (from auth context) is the uploader.
    const { auth } = useAuth();
    const uploaderFullname = auth?.user?.fullname || "You";
    const uploaderProfilePhoto = auth?.user?.profilePhoto;
    
    // Extract family details directly from the enriched story object
    const familyName = story.family_name || "Unknown Family"; 
    const familyPhoto = story.family_photo; 
    // -----------------------------------------------------------

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const currentMedia = story.media[currentMediaIndex];
    const totalMedia = story.media.length;
    
    const isLiked = story.liked_by.includes(currentUserUserId);
    const likesCount = story.liked_by.length;

    // The rest of the rendering/logic for media and actions is unchanged
    const renderMedia = (mediaItem) => {
        switch (mediaItem.type) {
            case "image": return (<img src={mediaItem.url} alt="Story Media" className="w-full h-full object-cover"/>);
            case "video": return (<video className="w-full h-full object-cover" controls><source src={mediaItem.url} type="video/mp4" />Your browser does not support the video tag.</video>);
            case "audio": return (<div className="flex items-center justify-center h-full bg-gray-100"><audio controls className="w-full px-4 py-8"><source src={mediaItem.url} type="audio/mp3" />Your browser does not support the audio element.</audio></div>);
            case "text": return (<div className="p-4 h-full flex items-center justify-center text-md text-gray-700 text-center bg-gray-50"><p>{mediaItem.text}</p></div>);
            default: return null;
        }
    };

    const goToNext = (e) => { e.preventDefault(); setCurrentMediaIndex((prev) => (prev + 1) % totalMedia); };
    const goToPrev = (e) => { e.preventDefault(); setCurrentMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia); };
    const handleLike = (e) => { e.preventDefault(); console.log(`Toggling like on story ${story._id}`); };
    const handleComment = (e) => { e.preventDefault(); console.log(`Opening comments for story ${story._id}`); };
    const handleBookmark = (e) => { e.preventDefault(); console.log(`Toggling bookmark on story ${story._id}`); };

    if (!currentMedia) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-200">
            
            {/* Story Header */}
            <div className="flex items-center p-4">
                {/* Uploader Profile Pic (Uses Auth Context Photo) */}
                {uploaderProfilePhoto ? (
                    <img
                        src={uploaderProfilePhoto}
                        alt={`${uploaderFullname}'s profile`}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                ) : (
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3 text-purple-700 text-lg font-bold">
                        {uploaderFullname.charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div>
                    {/* Display Uploader Fullname (From Auth Context) */}
                    <p className="text-sm font-semibold text-gray-800">{uploaderFullname}</p>
                    <p className="text-xs text-gray-500">
                        {/* Display Family Name (From Story Data) */}
                        <span className="mr-2">• {new Date(story.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium text-purple-600">{familyName}</span>
                    </p>
                </div>
                
                <button className="ml-auto text-gray-500 hover:text-gray-800" onClick={(e) => e.preventDefault()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
            </div>

            {/* ... (The rest of the component body is unchanged) ... */}
            <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center">
                {renderMedia(currentMedia)}
                
                {totalMedia > 1 && (
                    <>
                        <button onClick={goToPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full hover:bg-opacity-50 transition-opacity" disabled={currentMediaIndex === 0}><ChevronLeft size={20} /></button>
                        <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full hover:bg-opacity-50 transition-opacity" disabled={currentMediaIndex === totalMedia - 1}><ChevronRight size={20} /></button>
                        
                        <div className="absolute top-2 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-0.5 rounded-full">
                            {currentMediaIndex + 1}/{totalMedia}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{story.title}</h3>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{story.caption}</p>

                <div className="flex justify-between items-center mb-3">
                    <div className="flex space-x-4">
                        <button onClick={handleLike} className={`flex items-center text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`} >
                            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} className="mr-1" />
                            {likesCount > 0 ? likesCount : ''}
                        </button>
                        <button onClick={handleComment} className="flex items-center text-gray-500 hover:text-purple-600 transition-colors text-sm" >
                            <MessageCircle size={18} className="mr-1" />
                            {story.commentCount || 0}
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-purple-600 transition-colors" onClick={handleBookmark}>
                        <Bookmark size={18} />
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {story.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// Overview Component: REFACTORED FOR INFINITE SCROLL
// ====================================================================
const Overview = () => {
    const { auth } = useAuth();
    const user = auth?.user;
    const currentUserUserId = user?.user_id; 

    // Profile state (kept separate from stories)
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Recent Stories state (Infinite Scroll Logic)
    const [stories, setStories] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingStories, setLoadingStories] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Tracks if more pages exist

    // Fetch user profile data (No change)
    useEffect(() => {
        if (!currentUserUserId) return;

        const fetchProfile = async () => {
            try {
                const res = await api.get(`/user/${currentUserUserId}/profile`);
                setProfileData(res.data.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [currentUserUserId]);

    // Fetch stories function using the page state for the next chunk
    const fetchStories = useCallback(
        async () => {
            if (!hasMore) return; // Stop fetching if we know there's no more data
            if (loadingStories) return; // Prevent concurrent requests

            setLoadingStories(true);
            try {
                // Use page state in the API call
                const res = await api.get(`/content/user-recent-stories?page=${page}&limit=5`);
                const fetchedStories = res.data.data.stories || [];
                
                setStories((prev) => {
                    // Use a Set to ensure no duplicates are added
                    const existingIds = new Set(prev.map(s => s._id));
                    const newStories = fetchedStories.filter(
                        (story) => !existingIds.has(story._id)
                    );
                    return [...prev, ...newStories];
                });
                
                // If the number of stories returned is less than the limit (5), assume it's the last page
                if (fetchedStories.length < 5) {
                    setHasMore(false);
                }

            } catch (err) {
                console.error("Error fetching stories:", err);
            } finally {
                setLoadingStories(false);
            }
        },
        // Dependencies must include page and hasMore to correctly capture their latest values
        // Note: loadingStories is intentionally excluded from the dependency array because 
        // the check `if (loadingStories) return;` prevents a loop, and including it here 
        // could create an infinite loop if not handled carefully.
        [page, hasMore] 
    );

    // 1. Trigger initial and subsequent page loads when 'page' state increments
    useEffect(() => {
        if (currentUserUserId) {
            fetchStories();
        }
    }, [fetchStories, currentUserUserId]);

    // 2. Infinite Scroll Handler (Triggers the page increment)
    const handleInfiniteScroll = useCallback(() => {
        // Stop if already loading OR if the feed has no more pages
        if (loadingStories || !hasMore) return;

        // Check if user is near the bottom (1px threshold, common practice)
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight
        ) {
            // Increment page, which triggers the useEffect -> fetchStories loop
            setPage((prev) => prev + 1);
        }
    }, [loadingStories, hasMore]); // Depends on the latest loading and hasMore state

    // 3. Throttle and Attach/Cleanup Scroll Listener
    const throttledScrollHandler = throttle(handleInfiniteScroll, 200);

    useEffect(() => {
        window.addEventListener("scroll", throttledScrollHandler);

        return () => {
            window.removeEventListener("scroll", throttledScrollHandler);
        };
    }, [throttledScrollHandler]); 

    // --- Rendering Logic ---
    const { user: profile, families = [] } = profileData || {};
    const adminFamily = families.find((f) => f.Membership?.role === "admin");
    const memberFamily = families.find((f) => f.Membership?.role === "member");
    
    // Determine initial loading state based on both profile and first story load
    const isInitialLoading = loadingProfile || (loadingStories && stories.length === 0);
    
    if (isInitialLoading) {
        return (
            <div className="p-6 bg-purple-50 min-h-screen text-center pt-40">
                <p className="text-2xl font-semibold text-purple-600 animate-pulse">
                    Loading your profile and stories...
                </p>
            </div>
        );
    }


    return (
        <div className="p-6 bg-purple-50 min-h-screen">
            
            {/* 🌟 Welcome Section (No change) */}
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
                <div>
                    <h1 className="text-3xl font-semibold">Welcome back, {profile?.fullname?.split(" ")[0]}! 👋</h1>
                    <p className="text-purple-100 mt-1">Ready to preserve more family memories today?</p>
                    <p className="mt-3 text-purple-100">
                        You are connected to <span className="font-bold">{families.length}</span> family{families.length > 1 ? "ies" : "y"} 💜
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {profile?.profilePhoto ? (
                        <img
                            src={profile.profilePhoto}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-2xl">
                            {profile?.fullname?.charAt(0)}
                        </div>
                    )}
                </div>
            </div>
            
            {/* 👨‍👩‍👧 Family Cards (No change) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminFamily && (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-purple-100">
                        <div className="relative">
                            <img
                                src={adminFamily.familyPhoto}
                                alt={adminFamily.family_name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Crown size={14} /> Admin Family
                            </div>
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-purple-700">{adminFamily.family_name}</h2>
                            <p className="text-gray-600 text-sm mt-1">{adminFamily.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <Users size={16} /> <span>Created on {adminFamily.created_at}</span>
                            </div>
                            <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-2 rounded-xl hover:opacity-90 transition-all">
                                Manage Family
                            </button>
                        </div>
                    </div>
                )}

                {memberFamily && (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-purple-100">
                        <div className="relative">
                            <img
                                src={memberFamily.familyPhoto}
                                alt={memberFamily.family_name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Home size={14} /> Member Family
                            </div>
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-purple-700">{memberFamily.family_name}</h2>
                            <p className="text-gray-600 text-sm mt-1">{memberFamily.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <Users size={16} /> <span>Joined on {memberFamily.Membership?.joined_at}</span>
                            </div>
                            <button className="mt-4 w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-2 rounded-xl hover:opacity-90 transition-all">
                                View Family
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!adminFamily && !memberFamily && (
                <div className="text-center mt-10 text-gray-600">
                    <p>You are not part of any family yet. 💭</p>
                    <button className="mt-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-2 px-6 rounded-xl hover:opacity-90 transition-all">
                        Create Your Family
                    </button>
                </div>
            )}

            {/* 📝 User Recent Stories */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-purple-700 mb-4">Your Recent Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stories.map((story) => (
                        <Link
                            to={`/stories/${story._id}`} 
                            key={story._id}
                            className="block no-underline" 
                        >
                            <StoryCard 
                                story={story} 
                                currentUserUserId={currentUserUserId} 
                                familyInfo={families} 
                            />
                        </Link>
                    ))}
                </div>

                {/* LOADING/END STATE MESSAGES */}
                {loadingStories && stories.length > 0 && (
                    <p className="text-center mt-8 text-purple-600 font-medium animate-pulse">
                        Loading more stories...
                    </p>
                )}

                {/* Only show "End of stories" if there are *some* stories */}
                {!loadingStories && !hasMore && stories.length > 0 && (
                    <p className="text-center mt-8 text-purple-600 font-medium border-t pt-4 border-purple-200">
                        You've reached the end of your recent stories. 📖
                    </p>
                )}

                {/* Empty state when initial load is done and no stories were found */}
                {!loadingStories && stories.length === 0 && !hasMore && (
                    <p className="text-center mt-8 text-gray-500 font-medium">
                        No recent stories to display. Start sharing your family's memories!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Overview;