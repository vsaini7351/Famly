// import React, { useState } from "react";
// import { useAuth } from "../../utils/authContext";
// import api from "../../utils/axios";

// const AddMemory = ({ familyId }) => {
//   const { auth, isAuthenticated } = useAuth();

//   const [title, setTitle] = useState("");
//   const [caption, setCaption] = useState("");
//   const [memoryDate, setMemoryDate] = useState("");
//   const [tags, setTags] = useState([]);

//   const [mediaFiles, setMediaFiles] = useState([]); // image/video/audio
//   const [mediaText, setMediaText] = useState([]); // text and "" placeholders
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   // Add a text block
//   const addTextBlock = () => {
//     setMediaText((prev) => [...prev, ""]);
//     setMediaFiles((prev) => [...prev, null]); // placeholder to keep alignment
//   };

//   // Add a media block
//   const addMediaBlock = (e) => {
//     const files = Array.from(e.target.files);
//     const newFiles = [...mediaFiles];
//     const newTexts = [...mediaText];
//     const newPreviews = [...previewUrls];

//     files.forEach((file) => {
//       newFiles.push(file);
//       newTexts.push(""); // empty string for file
//       newPreviews.push(URL.createObjectURL(file));
//     });

//     setMediaFiles(newFiles);
//     setMediaText(newTexts);
//     setPreviewUrls(newPreviews);
//   };

//   // Update text description or text block
//   const handleTextChange = (index, value) => {
//     const updated = [...mediaText];
//     updated[index] = value;
//     setMediaText(updated);
//   };

//   const handleTagChange = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const tag = e.target.value.trim();
//       if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
//       e.target.value = "";
//     }
//   };

//   const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isAuthenticated) {
//       alert("⚠ Please sign in first.");
//       window.location.href = "/auth";
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("caption", caption);
//     formData.append("memory_date", memoryDate);

//     // Only append actual files
//     mediaFiles.forEach((f) => {
//       if (f) formData.append("mediaFiles", f);
//     });

//     mediaText.forEach((t) => formData.append("mediaText", t));
//     formData.append("tags", JSON.stringify(tags));

//     try {
//       setUploading(true);
//       const res = await api.post(/content/create-story/${familyId}, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("✅ Story uploaded successfully!");
//       console.log("Response:", res.data);

//       // Reset
//       setTitle("");
//       setCaption("");
//       setMemoryDate("");
//       setTags([]);
//       setMediaFiles([]);
//       setMediaText([]);
//       setPreviewUrls([]);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("❌ Failed to upload story.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-6 border border-gray-200">
//       <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New Memory</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Details */}
//         <input
//           type="text"
//           placeholder="Title *"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="w-full border rounded-lg p-3 text-lg"
//         />

//         <input
//           type="text"
//           placeholder="Caption"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           className="w-full border rounded-lg p-3 text-lg"
//         />

//         <input
//           type="date"
//           value={memoryDate}
//           onChange={(e) => setMemoryDate(e.target.value)}
//           className="w-full border rounded-lg p-3 text-lg"
//         />

//         {/* Tags Section */}
//         <div>
//           <input
//             type="text"
//             placeholder="Press Enter to add tags"
//             onKeyDown={handleTagChange}
//             className="w-full border rounded-lg p-3 text-lg mb-2"
//           />
//           <div className="flex flex-wrap gap-2">
//             {tags.map((tag, i) => (
//               <span
//                 key={i}
//                 onClick={() => removeTag(tag)}
//                 className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Common Tags */}
//         <div className="mt-2 text-gray-600">
//           <span className="font-medium">Common Tags: </span>
//           {["Birthday", "Holiday", "Vacation"].map((t) => (
//             <button
//               key={t}
//               type="button"
//               onClick={() => setTags((prev) => [...prev, t])}
//               className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm mr-2"
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Content Section */}
//         <div className="mt-6">
//           <label className="block text-lg font-semibold text-gray-800 mb-3">
//             Add Memories
//           </label>

//           <div className="flex gap-4 mb-4">
//             <button
//               type="button"
//               onClick={addTextBlock}
//               className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
//             >
//               ➕ Add Text Memory
//             </button>

//             <label className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 cursor-pointer">
//               📸 Add Media Memory
//               <input
//                 type="file"
//                 accept="image/,video/,audio/*"
//                 multiple
//                 onChange={addMediaBlock}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           {/* Show combined blocks */}
//           {mediaText.map((text, i) => (
//             <div key={i} className="border rounded-lg p-3 mb-4">
//               {previewUrls[i] ? (
//                 // If there is a file preview
//                 <>
//                   {mediaFiles[i]?.type?.startsWith("image") && (
//                     <img
//                       src={previewUrls[i]}
//                       alt={media-${i}}
//                       className="rounded-lg w-full h-48 object-cover mb-2"
//                     />
//                   )}
//                   {mediaFiles[i]?.type?.startsWith("video") && (
//                     <video
//                       src={previewUrls[i]}
//                       controls
//                       className="rounded-lg w-full h-48 object-cover mb-2"
//                     />
//                   )}
//                   {mediaFiles[i]?.type?.startsWith("audio") && (
//                     <audio controls src={previewUrls[i]} className="w-full mb-2" />
//                   )}
//                 </>
//               ) : null}

//               {/* Text Input */}
//               <textarea
//                 placeholder={
//                   previewUrls[i]
//                     ? Description for ${mediaFiles[i]?.name || "media"}
//                     : "Write your memory text here..."
//                 }
//                 value={text}
//                 onChange={(e) => handleTextChange(i, e.target.value)}
//                 className="w-full border rounded-lg p-3 text-lg"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={uploading}
//           className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//             uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {uploading ? "Uploading..." : "Upload Memory"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddMemory;


import React, { useState } from "react";
import { useAuth } from "../../utils/authContext";
import api from "../../utils/axios";

const AddMemory = ({ familyId }) => {
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [tags, setTags] = useState([]);
  const [blocks, setBlocks] = useState([]); // single array for all blocks
  const [uploading, setUploading] = useState(false);

  const addTextBlock = () => {
    if (blocks.length > 0 && blocks[blocks.length - 1].type === "text" && blocks[blocks.length - 1].text.trim() === "") {
      alert("⚠ Fill previous text before adding a new one.");
      return;
    }
    setBlocks([...blocks, { type: "text", text: "" }]);
  };

  const addMediaBlock = (e) => {
    const files = Array.from(e.target.files);
    const newBlocks = [...blocks];
    files.forEach((file) => {
      newBlocks.push({ type: "media", file, text: "" });
    });
    setBlocks(newBlocks);
  };

  const handleBlockTextChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].text = value;
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleTagChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      e.target.value = "";
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("⚠ Please sign in first.");
      window.location.href = "/auth";
      return;
    }

    const mediaText = blocks.map((b) => b.text || ""); // all text (empty if media)
    const mediaFiles = blocks.filter((b) => b.type === "media").map((b) => b.file);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("memory_date", memoryDate);
    mediaFiles.forEach((f) => formData.append("mediaFiles", f));
    mediaText.forEach((t) => formData.append("mediaText", t));
    formData.append("tags", JSON.stringify(tags));

    try {
      setUploading(true);
      await api.post(`/content/create-story/${familyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Story uploaded successfully!");
      // Reset
      setTitle(""); setCaption(""); setMemoryDate(""); setTags([]); setBlocks([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload story.");
    } finally {
      setUploading(false);
    }
  };

  return (
   <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-100 to-purple-200 shadow-xl shadow-purple-500/20 rounded-2xl p-8 mt-6 border border-purple-200">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
        ✨ Create a New Memory ✨
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* All inputs now use the same consistent glassmorphism style */}
        <input 
          type="text" 
          placeholder="Title *" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="w-full bg-black/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-lg text-purple-900 font-medium placeholder:text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" 
        />
        <input 
          type="text" 
          placeholder="Caption" 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          className="w-full bg-black/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-lg text-purple-900 font-medium placeholder:text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
        <input 
          type="date" 
          value={memoryDate} 
          onChange={(e) => setMemoryDate(e.target.value)} 
          className="w-full bg-black/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-lg text-purple-900 font-medium placeholder:text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />

        {/* Tags input */}
        <input 
          type="text" 
          placeholder="Press Enter to add tags" 
          onKeyDown={handleTagChange} 
          className="w-full bg-black/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-lg text-purple-900 font-medium placeholder:text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition mb-2"
        />
        {/* Tags display (corrected styling) */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <span key={i} onClick={() => removeTag(tag)} className="bg-purple-500/20 text-purple-800 font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-purple-500/30 transition">
              #{tag}
            </span>
          ))}
        </div>

        {/* Add block buttons */}
        <div className="flex gap-4 mb-4">
          <button 
            type="button" 
            onClick={addTextBlock} 
            className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-teal-600 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
          >
            ➕ Add Text
          </button>
          <label className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out cursor-pointer shadow-sm hover:shadow-md">
            📸 Add Media
            <input type="file" accept="image/*,video/*,audio/*" multiple onChange={addMediaBlock} className="hidden" />
          </label>
        </div>

        {/* Render blocks (styled to match the glass theme) */}
        {blocks.map((b, i) => (
          <div key={i} className="border border-white/30 bg-black/10 backdrop-blur-sm rounded-lg p-4 mb-4 relative">
            <button 
              type="button" 
              onClick={() => removeBlock(i)} 
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-100"
            >
              ✖
            </button>
            {b.type === "media" && b.file && (
              <>
                {b.file.type.startsWith("image") && <img src={URL.createObjectURL(b.file)} alt="preview" className="w-full h-48 object-cover rounded-lg mb-3" />}
                {b.file.type.startsWith("video") && <video src={URL.createObjectURL(b.file)} controls className="w-full h-48 rounded-lg mb-3 object-cover" />}
                {b.file.type.startsWith("audio") && <audio src={URL.createObjectURL(b.file)} controls className="w-full mb-3" />}
              </>
            )}
            <textarea
              value={b.text}
              onChange={(e) => handleBlockTextChange(i, e.target.value)}
              placeholder={b.type === "media" ? "Add description for media..." : "Write your memory here..."}
              className="w-full bg-black/10 border border-white/20 rounded-lg p-3 text-lg text-purple-900 font-medium placeholder:text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
        ))}

        {/* Submit button (styled to match the header) */}
        <button 
          type="submit" 
          disabled={uploading} 
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl ${uploading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}`}
        >
          {uploading ? "Uploading..." : "Upload Memory"}
        </button>
      </form>
    </div>
  );
};

export default AddMemory;