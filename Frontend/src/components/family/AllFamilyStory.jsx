import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/axios";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FamilyStoriesForm({ familyId }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortMode, setSortMode] = useState("desc");

  useEffect(() => {
    if (!familyId) return;

    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/content/family/${familyId}/${sortMode}`);
        setStories(res.data.data.stories || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [familyId, sortMode]);

  const groupByYear = (stories) => {
    const groups = {};
    stories.forEach((story) => {
      const date = new Date(story.memory_date || story.createdAt);
      const year = date.getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(story);
    });
    return groups;
  };

  const groupedStories = useMemo(() => groupByYear(stories), [stories]);

  return (
    <div className="p-6">
      {/* Sorting */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${sortMode === "desc" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setSortMode("desc")}
        >
          Recent
        </button>
        <button
          className={`px-3 py-1 rounded ${sortMode === "asc" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setSortMode("asc")}
        >
          By Memory Date
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading stories...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && stories.length === 0 && <p>No stories found for this family.</p>}

      {/* Timeline */}
      {Object.entries(groupedStories)
        .sort((a, b) => (sortMode === "asc" ? a[0] - b[0] : b[0] - a[0]))
        .map(([year, yearStories]) => (
          <div key={year} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 border-l-4 border-purple-500 pl-3">{year}</h3>
            <div className="space-y-4">
              {yearStories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

/* ---------------- STORY CARD ---------------- */
const StoryCard = React.memo(({ story }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [likes, setLikes] = React.useState(story.liked_by.length);
  const [isLiked, setIsLiked] = React.useState(false); // Optional: handle logged-in user later

  const goToNext = () => setCurrentMediaIndex((prev) => (prev + 1) % story.media.length);
  const goToPrev = () => setCurrentMediaIndex((prev) => (prev - 1 + story.media.length) % story.media.length);

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
  };

  const renderMedia = (media) => {
    switch (media.type) {
      case "image":
        return <img src={media.url} className="w-full h-full object-cover rounded-lg" alt="" />;
      case "video":
        return <video src={media.url} controls className="w-full h-full rounded-lg" />;
      case "audio":
        return <audio controls src={media.url} className="w-full" />;
      case "text":
        return <div className="p-4 bg-gray-100 rounded-lg">{media.text}</div>;
      default:
        return null;
    }
  };

  const cleanedTags = (story.tags || []).map((t) => t.replace(/[\[\]"]/g, ""));

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col md:flex-row gap-4">
      {/* Media */}
      <div className="relative w-full md:w-2/3">
        {story.media.length > 0 && renderMedia(story.media[currentMediaIndex])}

        {story.media.length > 1 && (
          <>
            <button onClick={goToPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full">
              <ChevronRight size={20} />
            </button>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {currentMediaIndex + 1}/{story.media.length}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="w-full md:w-1/3 flex flex-col justify-between">
        <h3 className="font-bold">{story.title}</h3>
        <p>{story.caption}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {cleanedTags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-2 items-center">
          <button onClick={handleLikeToggle} className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
            <Heart size={16} /> {likes}
          </button>
          <MessageCircle size={16} />
          <Share2 size={16} />
          <Bookmark size={16} />
        </div>
      </div>
    </div>
  );
});
