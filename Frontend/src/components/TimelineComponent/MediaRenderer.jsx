import { useState } from "react";
import { Maximize2, Minimize2, Video, Volume2, Image } from 'lucide-react'; 

export default function MediaRenderer({ media }) {
    if (!media || media.length === 0) return null;

    const [showAll, setShowAll] = useState(false);
    
    // Determine the media to display. If not showing all, take up to 3 items.
    const displayCount = showAll ? media.length : 3;
    const visibleMedia = media.slice(0, displayCount);
    const remainingCount = media.length - visibleMedia.length;
    
    // Determine the responsive grid layout class: Always 1 column on mobile, 2 columns on medium screens and up.
    const gridClass = media.length === 1
        ? "grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2"; // Use sm:grid-cols-2 for tablet/desktop layout

    // --- Component to Render Individual Media Item ---
    const renderMediaItem = (item, idx, className = "") => {
        let content;

        switch (item.type) {
            case "image":
                content = (
                    <>
                        <img
                            src={item.url}
                            alt={`Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/30 to-transparent">
                            {item.text && (
                                <p className="text-xs text-white font-medium line-clamp-1">
                                    {item.text}
                                </p>
                            )}
                        </div>
                        <Image size={20} className="absolute top-2 right-2 text-white/90" />
                    </>
                );
                break;
            case "video":
                content = (
                    <>
                        <video
                            controls
                            className="w-full h-full object-cover"
                            src={item.url}
                            poster={item.thumbnailUrl} 
                        />
                        <Video size={24} className="absolute top-2 right-2 text-white/90" />
                    </>
                );
                break;
            case "audio":
                return (
                    <div key={idx} className="w-full">
                        <div className="bg-purple-100 p-4 rounded-lg flex flex-col items-center border border-purple-200">
                            <Volume2 size={24} className="text-purple-600 mb-2" />
                            <p className="text-sm font-semibold text-gray-700 mb-2">Audio Recording</p>
                            {/* Make audio controls responsive by using w-full */}
                            <audio controls className="w-full max-w-xs sm:max-w-none">
                                <source src={item.url} />
                            </audio>
                        </div>
                    </div>
                );
            case "text":
                return (
                    <div key={idx} className="w-full">
                        <p
                            className="text-gray-700 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
                        >
                            {item.text}
                        </p>
                    </div>
                );
            default:
                return null;
        }

        // Wrapper for image/video media types to enforce a proportional aspect ratio on all devices
        return (
            <div 
                key={idx} 
                className={`relative w-full aspect-square sm:aspect-video overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl ${className}`}
            >
                {content}
            </div>
        );
    };

    // Special handling for text/audio only groups (remains flex-col)
    const isOnlyNonVisual = media.every(item => item.type === 'text' || item.type === 'audio');
    
    if (isOnlyNonVisual) {
        return (
            <div className="flex flex-col gap-3">
                {media.map((item, idx) => renderMediaItem(item, idx, ""))}
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            <div className={`grid ${gridClass} gap-3`}>
                {visibleMedia.map((item, idx) => {
                    // Only render if we are showing all OR if it is one of the first two items
                    if (showAll || idx < 2) {
                         return renderMediaItem(item, idx);
                    }
                    return null;
                })}

                {/* Show More Overlay: Responsive text and icon size */}
                {!showAll && media.length > 2 && (
                    <button
                        className="relative w-full aspect-square sm:aspect-video rounded-lg shadow-md flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer border-4 border-dashed border-gray-400 p-4"
                        onClick={() => setShowAll(true)}
                    >
                        <Maximize2 size={24} sm:size={32} className="text-purple-600 mb-2" />
                        <span className="text-base sm:text-lg font-bold text-gray-700">Show {remainingCount} More</span>
                        <span className="text-xs sm:text-sm text-gray-500">View all media</span>
                    </button>
                )}
            </div>
            
            {/* "Show Less" Button (responsive text size) */}
            {showAll && media.length > 3 && (
                <button
                    className="flex items-center text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors mx-auto"
                    onClick={() => setShowAll(false)}
                >
                    <Minimize2 size={16} className="mr-1" />
                    Show Less
                </button>
            )}
        </div>
    );
}