import { useState } from "react";
import MediaRenderer from "./MediaRenderer";

export default function TimelineCard({ story }) {
  const [showFullCaption, setShowFullCaption] = useState(false);

  const captionPreview =
    story.caption.length > 100 && !showFullCaption
      ? story.caption.slice(0, 100) + "..."
      : story.caption;

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 border border-gray-100">
      {/* Header: Uploader + Date */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-purple-700">
          {story.uploaded_by?.fullname || "Unknown User"}
        </h4>
        <span className="text-xs text-gray-500">
          {new Date(story.memory_date || story.createdAt).toDateString()}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold mb-2">{story.title}</h2>

      {/* Caption */}
      <p className="text-sm text-gray-600 mb-4">
        {captionPreview}
        {story.caption.length > 100 && (
          <button
            onClick={() => setShowFullCaption((prev) => !prev)}
            className="text-purple-500 ml-1"
          >
            {showFullCaption ? "Show less" : "Show more"}
          </button>
        )}
      </p>

      {/* Media */}
      <MediaRenderer media={story.media} />

      {/* Tags */}
      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {story.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
            >
              #{tag.replace(/[\[\]"]/g, "")}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
        <button>❤️ Like</button>
        <button>💬 Comment</button>
        <button>↗️ Share</button>
      </div>
    </div>
  );
}
