


import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../utils/authContext";
import api from "../../utils/axios";
import { Users, Crown, Home } from "lucide-react";
import { Link } from "react-router-dom"; // For story links

const Overview = () => {
  const { auth } = useAuth();
  const user = auth?.user;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recent Stories state
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingStories, setLoadingStories] = useState(false);
  const [noMoreStories, setNoMoreStories] = useState(false); // New state to track when no more stories

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/${user.user_id}/profile`);
        setProfileData(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false); // Set loading to false after profile fetch
      }
    };

    fetchProfile();
  }, [user?.user_id]);

  const fetchStories = useCallback(
    async (pageNum = 1) => {
      if (loadingStories || pageNum > totalPages) return;
      setLoadingStories(true);
      try {
        const res = await api.get(`/content/user-recent-stories?page=${pageNum}&limit=5`);
        const fetchedStories = res.data.data.stories;

        // Avoid adding duplicate stories
        setStories((prev) => {
          const newStories = fetchedStories.filter(
            (story) => !prev.some((existingStory) => existingStory.id === story.id || existingStory._id === story._id)
          );
          return [...prev, ...newStories]; // Append only unique stories
        });
        setTotalPages(res.data.data.pagination.totalPages);

        // Check if we are on the last page
        if (pageNum >= totalPages) {
          setNoMoreStories(true); // Set noMoreStories to true if we're on the last page
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoadingStories(false); // Set loadingStories to false after fetch is complete
      }
    },
    [loadingStories, totalPages]
  );

  useEffect(() => {
    fetchStories(page);
  }, [fetchStories, page]);

  // Infinite Scroll
  const handleInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
        page < totalPages
      ) {
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Infinite scroll error", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);

    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [page, totalPages]);

  const { user: profile, families = [] } = profileData || {};
  const adminFamily = families.find((f) => f.Membership?.role === "admin");
  const memberFamily = families.find((f) => f.Membership?.role === "member");

  // Helper function to render media
  const renderMedia = (mediaItem) => {
  switch (mediaItem.type) {
    case "image":
      return (
        <img
          src={mediaItem.url}
          alt="Story Media"
          className="w-full h-full object-cover"
        />
      );
    case "video":
      return (
        <video className="w-full h-full object-cover" controls>
          <source src={mediaItem.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    case "audio":
      return (
        <div className="flex items-center justify-center h-full">
          <audio controls className="w-full px-2">
            <source src={mediaItem.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    case "text":
      return (
        <div className="p-3 h-full flex items-center justify-center text-sm text-gray-700 text-center">
          <p>{mediaItem.text}</p>
        </div>
      );
    default:
      return null;
  }
};


  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      {/* 🌟 Welcome Section */}
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

      {/* 👨‍👩‍👧 Family Cards */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              to={`/stories/${story.id || story._id}`}
              key={story.id || story._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-purple-100"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-purple-700">{story.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{story.caption}</p>

                {/* Render all media */}
                {story.media.slice(0, 3).map((mediaItem, index) => (
                  <div key={index} className="mt-3">
                    {renderMedia(mediaItem)}
                  </div>
                ))}

                <div className="flex gap-2 flex-wrap mt-2">
                  {story.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {loadingStories && !noMoreStories && (
          <p className="text-center mt-4 text-purple-600 font-medium animate-pulse">
            Loading more stories...
          </p>
        )}

        {noMoreStories && stories.length > 0 && (
          <p className="text-center mt-4 text-purple-600 font-medium">
            No more stories to load.
          </p>
        )}
      </div>
    </div>
  );
};

export default Overview;
