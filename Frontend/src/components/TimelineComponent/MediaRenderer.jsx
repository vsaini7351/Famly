import { useState } from "react";

export default function MediaRenderer({ media }) {
  const [showAll, setShowAll] = useState(false);
  const visibleMedia = showAll ? media : media.slice(0, 2);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {visibleMedia.map((item, idx) => {
        switch (item.type) {
          case "image":
            return (
              <div key={idx} className="max-w-sm overflow-hidden rounded-lg shadow">
                <img
                  src={item.url}
                  alt=""
                  className="object-cover w-full h-64 rounded-lg"
                />
                {item.text && (
                  <p className="text-xs text-center text-gray-600 p-2">
                    {item.text}
                  </p>
                )}
              </div>
            );
          case "video":
            return (
              <video
                key={idx}
                controls
                className="rounded-lg w-64 h-48 object-cover shadow"
                src={item.url}
              />
            );
          case "audio":
            return (
              <audio key={idx} controls className="w-full mt-2">
                <source src={item.url} />
              </audio>
            );
          case "text":
            return (
              <p
                key={idx}
                className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg"
              >
                {item.text}
              </p>
            );
          default:
            return null;
        }
      })}

      {media.length > 2 && (
        <button
          className="text-purple-500 text-sm mt-2"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : "Show more..."}
        </button>
      )}
    </div>
  );
}
