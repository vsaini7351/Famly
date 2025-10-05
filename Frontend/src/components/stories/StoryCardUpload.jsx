// import React, { useState } from "react";
// import { useAuth } from "../../utils/authContext";
// import api from "../../utils/axios";

// const StoryUploadCard = ({ familyId }) => {
//   const { auth, isAuthenticated } = useAuth();
//   const [title, setTitle] = useState("");
//   const [caption, setCaption] = useState("");
//   const [memoryDate, setMemoryDate] = useState("");
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [mediaText, setMediaText] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleMediaUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setMediaFiles(files);
//     setMediaText(new Array(files.length).fill(""));
//     setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
//   };

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
//       alert("⚠️ Please sign in first.");
//       window.location.href = "/auth";
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("caption", caption);
//     formData.append("memory_date", memoryDate);
//     mediaFiles.forEach((f) => formData.append("mediaFiles", f));
//     mediaText.forEach((t) => formData.append("mediaText", t));
//     formData.append("tags", JSON.stringify(tags));

//     try {
//       setUploading(true);
//       const res = await api.post(`/content/create-story/${familyId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("✅ Story uploaded successfully!");
//       console.log("Response:", res.data);

//       // Reset form
//       setTitle("");
//       setCaption("");
//       setMemoryDate("");
//       setMediaFiles([]);
//       setMediaText([]);
//       setTags([]);
//       setPreviewUrls([]);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("❌ Failed to upload story.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
//       <h2 className="text-xl font-semibold text-center mb-4">Upload a Memory</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Title *"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="w-full border rounded-lg p-2"
//         />

//         <input
//           type="text"
//           placeholder="Caption"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           className="w-full border rounded-lg p-2"
//         />

//         <input
//           type="date"
//           value={memoryDate}
//           onChange={(e) => setMemoryDate(e.target.value)}
//           className="w-full border rounded-lg p-2"
//           required
//         />

//         <input
//           type="file"
//           accept="image/*,video/*,audio/*"
//           multiple
//           onChange={handleMediaUpload}
//           className="w-full border rounded-lg p-2"
//         />

//         {previewUrls.length > 0 && (
//           <div className="grid grid-cols-3 gap-2">
//             {previewUrls.map((url, idx) => (
//               <img
//                 key={idx}
//                 src={url}
//                 alt=""
//                 className="rounded-lg h-24 object-cover"
//               />
//             ))}
//           </div>
//         )}

//         {mediaFiles.map((file, i) => (
//           <textarea
//             key={i}
//             placeholder={`Description for ${file.name}`}
//             value={mediaText[i] || ""}
//             onChange={(e) => handleTextChange(i, e.target.value)}
//             className="w-full border rounded-lg p-2"
//           />
//         ))}

//         <input
//           type="text"
//           placeholder="Press Enter to add tags"
//           onKeyDown={handleTagChange}
//           className="w-full border rounded-lg p-2"
//         />
//         <div className="flex flex-wrap gap-2">
//           {tags.map((tag, i) => (
//             <span
//               key={i}
//               onClick={() => removeTag(tag)}
//               className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg cursor-pointer"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>

//         <button
//           type="submit"
//           disabled={uploading}
//           className={`w-full py-2 rounded-lg text-white font-semibold transition ${
//             uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {uploading ? "Uploading..." : "Upload Story"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StoryUploadCard;


import React, { useState } from "react";
import { useAuth } from "../../utils/authContext";
import api from "../../utils/axios";

const StoryUploadCard = ({ familyId }) => {
  const { auth, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaText, setMediaText] = useState([]);
  const [tags, setTags] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    setMediaText(new Array(files.length).fill(""));
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const handleTextChange = (index, value) => {
    const updated = [...mediaText];
    updated[index] = value;
    setMediaText(updated);
  };

  const handleTagChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
      e.target.value = "";
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("⚠️ Please sign in first.");
      window.location.href = "/auth";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("memory_date", memoryDate);
    mediaFiles.forEach((f) => formData.append("mediaFiles", f));
    mediaText.forEach((t) => formData.append("mediaText", t));
    formData.append("tags", JSON.stringify(tags));

    try {
      setUploading(true);
      const res = await api.post(`/content/create-story/${familyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Story uploaded successfully!");
      console.log("Response:", res.data);

      // Reset form
      setTitle("");
      setCaption("");
      setMemoryDate("");
      setMediaFiles([]);
      setMediaText([]);
      setTags([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload story.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New Memory</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Photos & Videos</label>
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleMediaUpload}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          />
        </div>

        {/* Media Preview */}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`preview-${idx}`}
                className="rounded-lg h-24 object-cover"
              />
            ))}
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded-lg p-3 text-lg"
        />

        {/* Caption Input */}
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded-lg p-3 text-lg"
        />

        {/* Date Input */}
        <input
          type="date"
          value={memoryDate}
          onChange={(e) => setMemoryDate(e.target.value)}
          className="w-full border rounded-lg p-3 text-lg"
          required
        />

        {/* Tags Section */}
        <div>
          <input
            type="text"
            placeholder="Press Enter to add tags"
            onKeyDown={handleTagChange}
            className="w-full border rounded-lg p-3 text-lg mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                onClick={() => removeTag(tag)}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Common Tags */}
        <div className="mt-2 text-gray-600">
          <span className="font-medium">Common Tags: </span>
          <button
            type="button"
            onClick={() => setTags((prev) => [...prev, "Birthday"])}
            className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm mr-2"
          >
            Birthday
          </button>
          <button
            type="button"
            onClick={() => setTags((prev) => [...prev, "Holiday"])}
            className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm mr-2"
          >
            Holiday
          </button>
          <button
            type="button"
            onClick={() => setTags((prev) => [...prev, "Vacation"])}
            className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm mr-2"
          >
            Vacation
          </button>
        </div>

        {/* Description for Each File */}
        {mediaFiles.map((file, i) => (
          <textarea
            key={i}
            placeholder={`Description for ${file.name}`}
            value={mediaText[i] || ""}
            onChange={(e) => handleTextChange(i, e.target.value)}
            className="w-full border rounded-lg p-3 text-lg mt-4"
          />
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {uploading ? "Uploading..." : "Upload Memory"}
        </button>
      </form>
    </div>
  );
};

export default StoryUploadCard;
