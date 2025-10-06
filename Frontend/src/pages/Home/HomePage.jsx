// //it include create family options
// //it include create family options
// import hero from "../../assets/home-image.jpg";
// import annu from "../../assets/famly-logo.png";
// const Home = () => {
//   return (
//     <main className="bg-gray-50 text-gray-800 font-sans">

//       {/* --- Hero Section (Correctly Structured) --- */}
//       <header
//         className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center text-center px-4"
//         style={{ backgroundImage: `url(${hero})` }}
//       >
        

//         {/* Content is now on a semi-transparent card, and relative to the header */}
//         <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl shadow-lg border border-white/20">
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Welcome to FAMLY 👨‍👩‍👧‍👦
//           </h1>
//           <p className="text-lg text-white/90 mb-8">
//             Preserve and share your family’s precious memories with love. Create a family circle and keep your memories alive forever.
//           </p>
//           <a
//             href="/auth"
//             className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all transform hover:scale-105"
//           >
//             Get Started
//           </a>
//         </div>
//       </header>

//       <div className="relative bg-white overflow-hidden">
//       {/* Subtle background pattern */}
//       <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
//         <div className="relative h-full max-w-7xl mx-auto">
//           <svg className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
//             <defs>
//               <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
//                 <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
//               </pattern>
//             </defs>
//             <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
//           </svg>
//         </div>
//       </div>

//       <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            
//             {/* Left Column: Text Content */}
//             <div className="relative">
//               <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl text-purple-600">
//                 About FAMLY
//               </h2>
//               <p className="mt-4 text-lg text-gray-600 leading-8">
//                 FAMLY was born from a simple idea: family stories are treasures that deserve a beautiful, private, and permanent home. We provide a dedicated space for the moments that truly matter, connecting generations and building a collaborative history for your family.
//               </p>
              
//               {/* Accent line and a stat for visual interest */}
//               <div className="mt-8 border-t border-purple-200 pt-6">
//                 <dl>
//                   <dt className="text-base font-medium text-gray-500">Connecting families since</dt>
//                   <dd className="text-2xl font-bold tracking-tight text-purple-600">2025</dd>
//                 </dl>
//               </div>
//             </div>

//             {/* Right Column: Image */}
//             <div className="mt-10 lg:mt-0" aria-hidden="true">
//               <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-2xl shadow-xl">
//                  {/* Replace with a meaningful, high-quality image */}
//                 <img
//                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
//                   alt="Family members using a tablet together"
//                   className="w-full h-full object-cover object-center"
//                 />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>

//       {/* --- How It Works Section (Redesigned with Cards & Icons) --- */}
//       <section id="how-it-works" className="py-24 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">How It Works</h2>
//             <p className="text-lg text-gray-600">Get set up in three simple steps.</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8 text-center">
//             {/* Step 1 Card */}
//             <div className="bg-blue-200 p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
//               <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
//                  <span className="text-2xl font-bold">1</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Circle</h3>
//               <p className="text-gray-600">Sign up and create a private, secure circle just for your family.</p>
//             </div>
//             {/* Step 2 Card */}
//             <div className="bg-blue-200 p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
//               <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
//                 <span className="text-2xl font-bold">2</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Invite Members</h3>
//               <p className="text-gray-600">Easily send invitations to family members via email or a special link.</p>
//             </div>
//             {/* Step 3 Card */}
//             <div className="bg-blue-200 p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform">
//                <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
//                 <span className="text-2xl font-bold">3</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Share & Preserve</h3>
//               <p className="text-gray-600">Upload photos, videos, and stories to build your collective memory bank.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- Why Choose FAMLY? Section (Redesigned with Icons) --- */}
//       <section id="features" className="py-24 bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Why Choose <span className="text-purple-600">FAMLY?</span>
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             A secure, beautiful, and collaborative space designed to preserve what matters most.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
          
//           {/* Card 1: Private & Secure */}
//           <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
//             <div className="flex items-start space-x-5">
//               <div className="flex-shrink-0">
//                 <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 21a12.02 12.02 0 009-8.056z"></path></svg>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">Private & Secure</h3>
//                 <p className="text-gray-600 mt-1">We use top-tier encryption and never share your data. Your memories are for your eyes only.</p>
//               </div>
//             </div>
//           </div>

//           {/* Card 2: Easy for Everyone */}
//           <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
//             <div className="flex items-start space-x-5">
//               <div className="flex-shrink-0">
//                 <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">Easy for Everyone</h3>
//                 <p className="text-gray-600 mt-1">Our intuitive interface is designed for all ages, from grandkids to grandparents.</p>
//               </div>
//             </div>
//           </div>

//           {/* Card 3: Collaborative Timeline */}
//           <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
//             <div className="flex items-start space-x-5">
//               <div className="flex-shrink-0">
//                 <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">Collaborative Timeline</h3>
//                 <p className="text-gray-600 mt-1">Everyone can contribute. See your family's history unfold in a shared, chronological story.</p>
//               </div>
//             </div>
//           </div>

//           {/* Card 4: Unlimited Storage */}
//           <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
//             <div className="flex items-start space-x-5">
//               <div className="flex-shrink-0">
//                 <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">Unlimited Storage</h3>
//                 <p className="text-gray-600 mt-1">Don't worry about running out of space. Preserve every photo, video, and story without limits.</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>

//       {/* --- FAQ Section --- */}
//       <section id="faq" className="py-24 bg-blue-100">
//         <div className="max-w-3xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">Frequently Asked Questions</h2>
//           </div>
//           <div className="space-y-4">
//             {/* You can make these interactive with a bit of state management */}
//             <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 rounded-lg shadow-sm">
//               <h3 className="font-semibold text-lg text-gray-800">Is my family's data safe?</h3>
//               <p className="text-gray-600 mt-2">
//                 Absolutely. Security is our highest priority. All data is encrypted, and your family circle is completely private.
//               </p>
//             </div>
//             <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 rounded-lg shadow-sm">
//               <h3 className="font-semibold text-lg text-gray-800">How many members can I invite?</h3>
//               <p className="text-gray-600 mt-2">
//                 Our standard plan allows up to 50 members. We also offer larger plans for bigger families!
//               </p>
//             </div>
//             {/* ... other questions ... */}
//           </div>
//         </div>
//       </section>
      
      
//       <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
//       <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
//           {/* Column 1: Brand Info */}
//           <div className="col-span-2 md:col-span-1">
//             <div className="flex items-center space-x-2 mb-4" >
//               {/* You can replace this SVG with your actual logo */}
//               <img
//                       src={annu}
//                       alt="Logo"
//                       className="w-10 h-10 object-cover rounded-lg shadow-md"
//                   />
//               <span className="text-2xl font-bold">FAMLY</span>
//             </div>
//             <p className="text-gray-300">
//               Preserving family memories for generations to come.
//             </p>
//           </div>

//           {/* Column 2: Platform Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Platform</h3>
//             <ul className="space-y-3">
//               <li><a href="#about" className="hover:text-gray-300 transition">About</a></li>
//               <li><a href="#how-it-works" className="hover:text-gray-300 transition">How It Works</a></li>
//               <li><a href="#features" className="hover:text-gray-300 transition">Features</a></li>
//               <li><a href="#faq" className="hover:text-gray-300 transition">FAQ</a></li>
//             </ul>
//           </div>

//           {/* Column 3: Support Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Support</h3>
//             <ul className="space-y-3">
//               <li><a href="/contact" className="hover:text-gray-300 transition">Contact</a></li>
//               <li><a href="/help" className="hover:text-gray-300 transition">Help Center</a></li>
//               <li><a href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</a></li>
//               <li><a href="/terms" className="hover:text-gray-300 transition">Terms of Service</a></li>
//             </ul>
//           </div>

//           {/* Column 4: Connect Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Connect</h3>
//             <ul className="space-y-3">
//               <li><a href="/community" className="hover:text-gray-300 transition">Community</a></li>
//               <li><a href="/blog" className="hover:text-gray-300 transition">Blog</a></li>
//               <li><a href="/newsletter" className="hover:text-gray-300 transition">Newsletter</a></li>
//               <li><a href="/social" className="hover:text-gray-300 transition">Social Media</a></li>
//             </ul>
//           </div>

//         </div>

//       </div>
//     </div>

//     </main>
//   );
// };

// export default Home;





import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import hero from "../../assets/home-image.jpg";
import annu from "../../assets/famly-logo.png";
import { useAuth } from "../../utils/authContext"; 
import { useTheme } from "../../utils/ThemeContext"; // Removed in final code, but kept for context 
import api from "../../utils/axios"; 
import { Heart, MessageCircle, Share2, Bookmark, Image as ImageIcon, FileText, Film, Volume2, Clock, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";


// ====================================================================
// StoryCard Component: Displays a single memory with media carousel
// (ALL DARK MODE CLASSES REMOVED)
// ====================================================================
const StoryCard = React.memo(({ story, currentUserId }) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [likes, setLikes] = useState(story.liked_by.length);
    const [isLiked, setIsLiked] = useState(story.liked_by.includes(currentUserId));

    const currentMedia = story.media[currentMediaIndex];
    const totalMedia = story.media.length;

    const uploader = story.uploaded_by_user || {
        fullname: "Unknown User",
        username: "unknown_user",
        profilePhoto: "https://via.placeholder.com/40" 
    };

    const timeAgo = useMemo(() => {
        const diff = Date.now() - new Date(story.createdAt).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `less than a minute ago`;
    }, [story.createdAt]);


    const handleLikeToggle = async (e) => {
        e.preventDefault();
        if (!currentUserId) return;

        const endpoint = isLiked ? `/unlike/${story._id}` : `/like/${story._id}`;
        
        setIsLiked(prev => !prev);
        setLikes(prev => prev + (isLiked ? -1 : 1));

        try {
            await api.post(endpoint); 
        } catch (err) {
            console.error("Like toggle failed:", err);
            setIsLiked(prev => !prev);
            setLikes(prev => prev - (isLiked ? -1 : 1));
        }
    };
    
    // --- REFINED RENDER MEDIA FUNCTION ---
    const renderMedia = (mediaItem) => {
        if (!mediaItem) return null;
        switch (mediaItem.type) {
            case "image":
                return <img src={mediaItem.url} alt="Story Media" className="w-full h-full object-cover" />;
            case "video":
                // Use the HTML5 video element with controls for user playback
                return (
                    <div className="relative w-full h-full bg-black">
                        <video 
                            src={mediaItem.url} 
                            className="w-full h-full object-contain" // Use object-contain to ensure video isn't clipped
                            controls 
                            poster={mediaItem.thumbnailUrl} // Optional: Add a thumbnail/poster
                        />
                    </div>
                );
            case "audio":
                // Use the HTML5 audio element with controls
                return (
                    <div className="flex flex-col items-center justify-center min-h-[150px] bg-purple-200 rounded-lg p-4">
                        <Volume2 size={32} className="text-purple-600 mb-3"/>
                        <p className="text-gray-700 text-sm mb-2">Audio Memory</p>
                        <audio controls className="w-full max-w-xs">
                            <source src={mediaItem.url} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            case "text":
                return <div className="p-6 bg-purple-100 min-h-[200px] flex flex-col justify-center rounded-lg text-gray-700">
                    <p className="font-medium text-lg mb-2 whitespace-pre-wrap">{mediaItem.text}</p>
                </div>;
            default:
                return null;
        }
    };

    const goToNext = (e) => {
        e.preventDefault();
        setCurrentMediaIndex(prev => (prev + 1) % totalMedia);
    };

    const goToPrev = (e) => {
        e.preventDefault();
        setCurrentMediaIndex(prev => (prev - 1 + totalMedia) % totalMedia);
    };
    
    const cleanedTags = (story.tags || []).map(tag => tag.replace(/[\[\]"]/g, '')).filter(t => t.length > 0);

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 mb-6 max-w-xl mx-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <img src={uploader.profilePhoto || "https://via.placeholder.com/40"} alt={uploader.fullname} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-800">{uploader.fullname}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">Grandmother</span> 
                        </div>
                        <p className="text-xs text-gray-500">
                            @{uploader.username} • {timeAgo} • Johnson Family
                        </p>
                    </div>
                </div>
                <MoreVertical size={20} className="text-gray-500 hover:text-gray-800 cursor-pointer" />
            </div>

            {/* Media/Content Area */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-purple-700 mb-2 flex items-center space-x-2">
                    {currentMedia?.type === 'image' && <ImageIcon size={20} className="text-purple-500" />}
                    {currentMedia?.type === 'video' && <Film size={20} className="text-purple-500" />}
                    {currentMedia?.type === 'audio' && <Volume2 size={20} className="text-purple-500" />}
                    {currentMedia?.type === 'text' && <FileText size={20} className="text-purple-500" />}
                    <span>{story.title}</span>
                </h3>
                <p className="text-gray-700 mb-3">{story.caption}</p>

                {/* Media Carousel Wrapper - Aspect ratio set to handle various media, adjusted if not text/audio */}
                <div className={`relative w-full ${currentMedia?.type !== 'text' && currentMedia?.type !== 'audio' ? 'aspect-video' : ''} rounded-lg overflow-hidden border border-gray-300`}>
                    {renderMedia(currentMedia)}
                    
                    {/* Carousel Controls (Logic is fine) */}
                    {totalMedia > 1 && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-opacity z-10"
                                disabled={currentMediaIndex === 0}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-opacity z-10"
                                disabled={currentMediaIndex === totalMedia - 1}
                            >
                                <ChevronRight size={20} />
                            </button>
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
                                {currentMediaIndex + 1}/{totalMedia}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {cleanedTags.map((tag, i) => <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-600">#{tag}</span>)}
            </div>

            {/* Actions (Like, Comment, Share) */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-100">
                <div className="flex space-x-6">
                    <button onClick={handleLikeToggle} className={`flex items-center text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}>
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} className="mr-1" /> {likes}
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors text-sm">
                        <MessageCircle size={18} className="mr-1" /> 0
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors text-sm">
                        <Share2 size={18} className="mr-1" /> 0
                    </button>
                </div>
                <Bookmark size={18} className="text-gray-500 hover:text-purple-600 cursor-pointer" />
            </div>
        </div>
    );
});



// ====================================================================
// StoryFeed Component: Fetches and renders the timeline
// (ALL DARK MODE CLASSES REMOVED)
// ====================================================================
// ====================================================================
// StoryFeed Component: Implements Infinite Scroll
// (STATIC LIGHT MODE)
// ====================================================================
const StoryFeed = () => {
    const { auth } = useAuth();
    const currentUserId = auth?.user?.user_id;

    const [stories, setStories] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true); // Tracks if there are more pages
    const [initialLoadError, setInitialLoadError] = useState(null);

    const resetFeed = useCallback(() => {
        setStories([]);
        setPage(1);
        setLoading(true);
        setHasMore(true);
        setInitialLoadError(null);
    }, []);

    // Function to fetch stories for the current page
    const fetchStories = useCallback(async () => {
        if (!hasMore && page > 1) return; // Stop if no more stories are expected
        
        // Only set loading to true if we are on page 1 or have more to fetch
        setLoading(true); 
        try {
            // Updated API endpoint to include pagination parameter
            const res = await api.get(`/content/recent-story?page=${page}`);
            const newStories = res?.data?.data?.stories || [];

            setStories(prev => {
                // Prevent duplicate stories in case of multiple renders/scrolls
                const newStoryIds = new Set(prev.map(s => s._id));
                const filteredNewStories = newStories.filter(s => !newStoryIds.has(s._id));
                return [...prev, ...filteredNewStories];
            });

            // If we received fewer than the expected number of items (or none), assume it's the last page.
            // We'll assume a page size of 10 for this check, but you should use your actual page size.
            // Using `newStories.length === 0` is safer if the API guarantees no results on the last page.
            if (newStories.length === 0) {
                setHasMore(false);
            }
            
            if (page === 1 && newStories.length === 0) {
                 setInitialLoadError("No stories yet. Start preserving your memories!");
            } else {
                 setInitialLoadError(null); // Clear error if data is found on subsequent pages
            }
            
        } catch (err) {
            console.error("Story Feed Fetch Error:", err);
            if (page === 1) {
                setInitialLoadError("Failed to load stories. Please check your network or try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [page, hasMore]);

    // Scroll handler to detect when to load the next page
    const handleInfiniteScroll = useCallback(() => {
        // Only proceed if not already loading and there are potentially more stories
        if (loading || !hasMore) return; 

        // Check if user is near the bottom (e.g., within 100px)
        const isBottom = (window.innerHeight + document.documentElement.scrollTop + 100) >= document.documentElement.scrollHeight;
        
        if (isBottom) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

     useEffect(() => {
        // If the access token is missing, the user is logged out (or accessing as a public user)
        // Since StoryFeed is only rendered when logged in, this handles switching users or logging out.
        if (!auth?.accessToken && stories.length > 0) {
            resetFeed();
        } else if (auth?.accessToken && stories.length === 0 && page === 1 && !loading) {
            // Re-fetch only if logged in, feed is empty, and we haven't started fetching page 1 yet.
            // This case prevents infinite re-renders while logging in.
            fetchStories();
        }
    }, [auth, stories.length, loading, page, resetFeed, fetchStories]);
    
    // 2. Data Fetch Effect: Triggers on mount and when 'page' state changes
    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    // 1. Initial/Page Load Effect
    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    // 2. Scroll Listener Effect
    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);

        return () => window.removeEventListener("scroll", handleInfiniteScroll);
    }, [handleInfiniteScroll]);


    // --- RENDERING LOGIC ---

    // Case 1: Initial (Page 1) loading state, or an error occurred on page 1
    if (loading && stories.length === 0 && initialLoadError === null) {
        return <div className="text-center py-20 text-xl font-semibold text-purple-600">Loading your family stories...</div>;
    }
    
    // Case 2: Initial load finished and found no stories (empty state or load error)
    if (stories.length === 0) {
        return (
            <div className="text-center py-20">
                <p className={`text-xl mb-4 ${initialLoadError ? 'text-red-600' : 'text-gray-600'}`}>
                    {initialLoadError || "No stories yet. Start preserving your memories!"}
                </p>
                <Link to="/create-family" className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all">Create Your Family</Link>
            </div>
        );
    }
    
    // Case 3: Display the feed and infinite scroll indicators
    return (
        <div className="py-12 bg-gray-50 min-h-screen transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Recent Family Stories</h2>
                
                {stories.map(story => (
                    <StoryCard key={story._id} story={story} currentUserId={currentUserId} />
                ))}

                {/* Loading indicator for subsequent pages */}
                {loading && hasMore && (
                    <div className="text-center py-4 text-purple-600 font-medium">
                        Loading more memories...
                    </div>
                )}

                {/* End of content message */}
                {!hasMore && (
                     <div className="text-center py-8 text-gray-500 border-t mt-4">
                        You've reached the end of the timeline! 🎉
                    </div>
                )}
            </div>
        </div>
    );
};
// The rest of the Home component remains unchanged.


// ====================================================================
// Home Component: Conditional View based on Authentication
// (THEME DEPENDENCY REMOVED, ALL DARK MODE CLASSES REMOVED)
// ====================================================================
const Home = () => {
    const { auth } = useAuth();
    // Removed useTheme import and usage

    const isUserAuthenticated = !!auth?.accessToken;

    if (isUserAuthenticated) {
        return <StoryFeed />;
    }

    // If user is NOT logged in, show the marketing landing page (STATIC LIGHT MODE)
    return (
        <main className="bg-gray-50 text-gray-800 font-sans transition-colors duration-300 min-h-screen">

            {/* --- Hero Section (Landing Page) --- */}
            <header
                className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center text-center px-4"
                style={{ backgroundImage: `url(${hero})` }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div> 

                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl shadow-lg border border-white/20 transition-colors duration-300">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Welcome to FAMLY 👨‍👩‍👧‍👦
                    </h1>
                    <p className="text-lg text-white/90 mb-8">
                        Preserve and share your family’s precious memories with love. Create a family circle and keep your memories alive forever.
                    </p>
                    <a
                        href="/auth"
                        className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Get Started
                    </a>
                </div>
            </header>

            {/* --- About FAMLY Section --- */}
            <div className="relative bg-white overflow-hidden transition-colors duration-300">

                <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        
                        {/* Left Column: Text Content */}
                        <div className="relative">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-600">
                                About FAMLY
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 leading-8">
                                FAMLY was born from a simple idea: family stories are treasures that deserve a beautiful, private, and permanent home. We provide a dedicated space for the moments that truly matter, connecting generations and building a collaborative history for your family.
                            </p>
                            
                            <div className="mt-8 border-t border-purple-200 pt-6">
                                <dl>
                                    <dt className="text-base font-medium text-gray-500">Connecting families since</dt>
                                    <dd className="text-2xl font-bold tracking-tight text-purple-600">2025</dd>
                                </dl>
                            </div>
                        </div>
                        {/* Right Column: Image is fine */}
                        <div className="mt-10 lg:mt-0" aria-hidden="true">
                            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
                                    alt="Family members using a tablet together"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- How It Works Section --- */}
            <section id="how-it-works" className="py-24 bg-gray-100 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">Get set up in three simple steps.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { title: "Create Your Circle", text: "Sign up and create a private, secure circle just for your family." },
                            { title: "Invite Members", text: "Easily send invitations to family members via email or a special link." },
                            { title: "Share & Preserve", text: "Upload photos, videos, and stories to build your collective memory bank." }
                        ].map((item, index) => (
                            // Removed bg-blue-200 (using white for cleaner light mode), kept light bg-purple
                            <div key={index} className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform border border-purple-200">
                                <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl font-bold">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Why Choose FAMLY? Section --- */}
            <section id="features" className="py-24 bg-gray-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-purple-600">FAMLY?</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A secure, beautiful, and collaborative space designed to preserve what matters most.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        // Changed feature card background from gradient to static white with light border
                        { title: "Private & Secure", text: "Top-tier encryption ensures your memories are for your eyes only.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 21a12.02 12.02 0 009-8.056z"></path></svg>},
                        { title: "Easy for Everyone", text: "Our intuitive interface is designed for all ages, from grandkids to grandparents.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>},
                        { title: "Collaborative Timeline", text: "Everyone can contribute. See your family's history unfold in a shared, chronological story.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>},
                        { title: "Unlimited Storage", text: "Preserve every photo, video, and story without worrying about running out of space.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>},
                    ].map((feature, index) => (
                        // Removed bg-gradient-to-br from-violet-500 to-fuchsia-500
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-purple-200">
                            <div className="flex items-start space-x-5">
                                <div className="flex-shrink-0">
                                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                        {feature.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600 mt-1">{feature.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </section>

            {/* --- FAQ Section --- */}
            <section id="faq" className="py-24 bg-purple-100 transition-colors duration-300">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Is my family's data safe?", a: "Absolutely. Security is our highest priority. All data is encrypted, and your family circle is completely private." },
                            { q: "How many members can I invite?", a: "Our standard plan allows up to 50 members. We also offer larger plans for bigger families!" },
                        ].map((item, index) => (
                            // Removed bg-gradient-to-br from-violet-500 to-fuchsia-500
                            <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-purple-300">
                                <h3 className="font-semibold text-lg text-gray-800">{item.q}</h3>
                                <p className="text-gray-600 mt-2">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- Footer --- */}
            {/* Changed background from bg-gradient-to-r from-purple-800 to-indigo-900 to just bg-purple-800 for simplicity */}
            <div className="bg-purple-800 text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Brand Info */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <img src={annu} alt="Logo" className="w-10 h-10 object-cover rounded-lg shadow-md" />
                                <span className="text-2xl font-bold">FAMLY</span>
                            </div>
                            <p className="text-gray-300">Preserving family memories for generations to come.</p>
                        </div>

                        {/* Other Footer Columns */}
                        <div><h3 className="text-lg font-semibold mb-4">Platform</h3><ul className="space-y-3"><li><a href="#about" className="hover:text-gray-300 transition">About</a></li><li><a href="#how-it-works" className="hover:text-gray-300 transition">How It Works</a></li><li><a href="#features" className="hover:text-gray-300 transition">Features</a></li><li><a href="#faq" className="hover:text-gray-300 transition">FAQ</a></li></ul></div>
                        <div><h3 className="text-lg font-semibold mb-4">Support</h3><ul className="space-y-3"><li><a href="/contact" className="hover:text-gray-300 transition">Contact</a></li><li><a href="/help" className="hover:text-gray-300 transition">Help Center</a></li><li><a href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</a></li><li><a href="/terms" className="hover:text-gray-300 transition">Terms of Service</a></li></ul></div>
                        <div><h3 className="text-lg font-semibold mb-4">Connect</h3><ul className="space-y-3"><li><a href="/community" className="hover:text-gray-300 transition">Community</a></li><li><a href="/blog" className="hover:text-gray-300 transition">Blog</a></li><li><a href="/newsletter" className="hover:text-gray-300 transition">Newsletter</a></li><li><a href="/social" className="hover:text-gray-300 transition">Social Media</a></li></ul></div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;