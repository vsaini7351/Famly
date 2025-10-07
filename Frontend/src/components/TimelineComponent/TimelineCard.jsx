import React, { useState } from "react";
import MediaRenderer from "./MediaRenderer"; 
import { Heart, MessageCircle, Share2 } from 'lucide-react'; 

export default function StoryCard({ story, isFirst = false, isLast = false }) {
    const [showFullCaption, setShowFullCaption] = useState(false);

    const memoryDate = story.memory_date || story.createdAt;
    const year = new Date(memoryDate).getFullYear();
    const dateLabel = new Date(memoryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    
    const userInitial = story.uploaded_by?.fullname ? story.uploaded_by.fullname.charAt(0).toUpperCase() : 'U';
    const familyLabel = story.family_name || 'Heritage'; 

    const captionPreview =
        story.caption && story.caption.length > 100 && !showFullCaption
            ? story.caption.slice(0, 100) + "..."
            : story.caption;
            
    const tags = Array.isArray(story.tags) ? story.tags : [];


    return (
        // --- FIX: Reduced gap to gap-2/gap-3 on mobile to maximize horizontal space ---
        <div className={`relative flex gap-2 sm:gap-4 w-full ${!isLast ? 'pb-10 sm:pb-12' : 'pb-6'} min-h-[150px]`}>

            {/* --- 1. TIMELINE CONNECTOR COLUMN --- */}
            <div className="flex flex-col items-center flex-shrink-0">
                {/* Year Label: Adjusted text size to match the smaller circle size on mobile */}
                <span className="text-purple-600 font-bold text-xs sm:text-base mb-2">{year}</span>

                {/* Vertical Connector Line: Adjusted top calculation for the smaller label */}
                <div 
                    className={`w-0.5 bg-fuchsia-300 absolute top-0 bottom-0`} 
                    style={{ height: isFirst ? 'calc(100% - 24px)' : '100%', top: isFirst ? '24px' : '0' }}
                ></div>

                {/* Circle/Node: Slightly smaller circle on mobile */}
                <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 bg-purple-600 rounded-full border-4 border-fuchsia-200 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {userInitial}
                </div>
            </div>

            {/* --- 2. CARD CONTENT COLUMN --- */}
            <div className="flex-1 min-w-0 -mt-2">
                <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 w-full">
                    
                    {/* TOP HEADER ROW: Use flex-col on mobile, ensuring uploader/date stack clean */}
                    <div className="flex justify-between items-start sm:items-center mb-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-2">
                            {/* Uploader Name */}
                            <h4 className="font-semibold text-sm sm:text-base text-purple-700">
                                {story.uploaded_by?.fullname || "Unknown User"}
                            </h4>
                            {/* Date Label */}
                            <span className="text-xs text-gray-500">
                                {dateLabel}
                            </span>
                        </div>
                        
                        {/* Family/Heritage Label: ensures it doesn't get cut off */}
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex-shrink-0 mt-1 sm:mt-0">
                            {familyLabel}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-bold mb-2 text-gray-800">{story.title}</h2>

                    {/* Caption */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                        {captionPreview}
                        {story.caption && story.caption.length > 100 && (
                            <button
                                onClick={() => setShowFullCaption((prev) => !prev)}
                                className="text-purple-500 ml-1 font-medium"
                            >
                                {showFullCaption ? "Show less" : "Show more"}
                            </button>
                        )}
                    </p>

                    {/* MediaRenderer handles its own responsiveness */}
                    <MediaRenderer media={story.media} /> 

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                                >
                                    #{tag.replace(/[\[\]"]/g, "")}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions: Use flex-wrap on very small screens for safety */}
                    <div className="flex flex-wrap justify-start gap-4 sm:gap-8 items-center mt-4 text-gray-500 text-xs sm:text-sm border-t border-gray-100 pt-3">
                        <button className="flex items-center hover:text-red-500 transition-colors">
                            <Heart size={14} className="mr-1" /> {story.likes || 0} Like
                        </button>
                        <button className="flex items-center hover:text-purple-600 transition-colors">
                            <MessageCircle size={14} className="mr-1" /> {story.comments || 0} Comment
                        </button>
                        <button className="flex items-center hover:text-purple-600 transition-colors">
                            <Share2 size={14} className="mr-1" /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}