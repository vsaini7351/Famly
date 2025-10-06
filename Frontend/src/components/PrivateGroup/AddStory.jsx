import React, { useState } from 'react';
import axios from '../../utils/axios'; 

// Mock Icons
const TextIcon = () => <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const PhotoIcon = () => <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-12 1h.01M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const VideoIcon = () => <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55-4.55A1 1 0 0121 6v12a1 1 0 01-1.45.95L15 14M4 10a3 3 0 013-3h10a3 3 0 013 3v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4z"></path></svg>;

export default function AddStory({ privateGroupId, onClose, onStoryAdded }) {
    // State for the type of content being added
    const [contentType, setContentType] = useState('text'); // Default to 'text'
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Determines the appropriate 'accept' attribute for the file input
    const getFileAccept = () => {
        if (contentType === 'image') return 'image/*';
        if (contentType === 'video') return 'video/*';
        return '';
    };
    
    // Updates local file state and automatically sets the contentType based on the input field
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };
    
    // Handles changing the content mode, resetting inputs
    const handleModeChange = (newType) => {
        setContentType(newType);
        setText('');
        setFile(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- Frontend Validation ---
        const textContent = text.trim();

        if (contentType === 'text' && !textContent) {
            setError("Text content cannot be empty for a text story.");
            return;
        }
        if (contentType !== 'text' && !file) {
            setError(`Please select a file for the ${contentType} story.`);
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('contentType', contentType);
        formData.append('text', textContent);
        
        if (file) {
            // Your backend controller expects a single file field named 'file' 
            formData.append('file', file);
        }

        try {
            await axios.post(`/private-group/${privateGroupId}/stories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Essential for file uploads
                },
            });

            // Success: Close modal and trigger story list refresh in parent
            if (onStoryAdded) onStoryAdded();
            if (onClose) onClose();

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to post story. Check console for details.';
            setError(errorMessage);
            console.error("Story Submission Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-2xl border-2 border-purple-200 w-full max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-purple-700 border-b pb-3">Share a Memory</h2>
            
            <form onSubmit={handleSubmit}>
                {/* 1. Content Type Selection */}
                <div className="mb-6 p-3 bg-purple-50 rounded-lg">
                    <label className="block text-sm font-bold text-purple-700 mb-3">Choose Content Type:</label>
                    <div className="flex space-x-3">
                        <TypeButton 
                            type="text" 
                            currentType={contentType} 
                            onClick={handleModeChange} 
                            Icon={TextIcon}
                        />
                        <TypeButton 
                            type="image" 
                            currentType={contentType} 
                            onClick={handleModeChange} 
                            Icon={PhotoIcon}
                        />
                        <TypeButton 
                            type="video" 
                            currentType={contentType} 
                            onClick={handleModeChange} 
                            Icon={VideoIcon}
                        />
                    </div>
                </div>

                {/* 2. Text/Caption Area */}
                <div className="mb-6">
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                        {contentType === 'text' ? 'What\'s the story?' : 'Caption (Optional):'}
                    </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={contentType === 'text' ? 5 : 3}
                        placeholder={contentType === 'text' ? "Write your memory here..." : "Add a short description to your file."}
                        className="mt-1 block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        required={contentType === 'text'}
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                {/* 3. Media Upload Area (if not text story) */}
                {contentType !== 'text' && (
                    <div className="mb-6 p-4 border-2 border-dashed border-purple-400 rounded-lg bg-white">
                        <label htmlFor="file-upload" className="block text-lg font-bold text-purple-700 mb-2 capitalize">
                            Upload {contentType}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept={getFileAccept()}
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                            required={!file}
                            disabled={isSubmitting}
                        />
                        {file && (
                            <p className="mt-2 text-xs text-green-600 font-medium">
                                ✅ Selected: **{file.name}**
                            </p>
                        )}
                    </div>
                )}
                
                {/* 4. Error and Action Buttons */}
                {error && (
                    <p className="text-sm text-red-600 mb-4 p-2 bg-red-50 border border-red-200 rounded-md">{error}</p>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 text-base font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors disabled:bg-purple-400 shadow-md"
                        disabled={isSubmitting || (contentType !== 'text' && !file)}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Story'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper component for the type buttons
const TypeButton = ({ type, currentType, onClick, Icon }) => {
    const isSelected = currentType === type;
    return (
        <button
            type="button"
            onClick={() => onClick(type)}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 font-semibold text-sm capitalize min-w-[100px] justify-center ${
                isSelected 
                    ? 'bg-purple-700 text-white shadow-lg ring-2 ring-purple-300' 
                    : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-300'
            }`}
        >
            <Icon /> {type}
        </button>
    );
};