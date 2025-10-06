import { useEffect, useState } from "react";
import api from "../../utils/axios";
import TimelineCard from "../../components/TimelineComponent/TimelineCard";

export default function TimelinePage({ familyId }) {
  const [stories, setStories] = useState([]);
  const [sortMode, setSortMode] = useState("desc"); // 'asc' or 'desc'
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content/family/${familyId}/${sortMode}`);
      setStories(res.data.data.stories);
    } catch (error) {
      console.error("Failed to load stories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [sortMode, familyId]);

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

  const groupedStories = groupByYear(stories);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Family Timeline</h2>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              sortMode === "desc" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortMode("desc")}
          >
            Show by Recent
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              sortMode === "asc" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortMode("asc")}
          >
            Show by Memory Date
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading stories...</p>
      ) : (
        Object.entries(groupedStories)
          .sort((a, b) => (sortMode === "asc" ? a[0] - b[0] : b[0] - a[0]))
          .map(([year, stories]) => (
            <div key={year} className="mb-10">
              <h3 className="text-xl font-semibold mb-4 border-l-4 border-purple-500 pl-2">
                {year}
              </h3>
              <div className="space-y-6">
                {stories.map((story) => (
                  <TimelineCard key={story._id} story={story} />
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
