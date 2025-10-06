import React, { useState } from 'react';
import axios from '../../utils/axios'; // Recommended for handling file uploads
// for owner famliy 
import { useNavigate } from 'react-router-dom';
function CreateFamilyForm() {
    const [familyName, setFamilyName] = useState('');
    const [marriageDate, setMarriageDate] = useState('');
    const [description, setDescription] = useState('');
    const [familyPhoto, setFamilyPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
   const navigate = useNavigate();
    // This URL must match your Express server's family creation endpoint
    const API_URL = '/family/create-family'; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // 1. Prepare FormData: Must use FormData for file uploads (req.file)
        const formData = new FormData();
        formData.append('family_name', familyName);
        formData.append('marriage_date', marriageDate);
        // Description is optional
        if (description) formData.append('description', description); 
        // Append the file if one was selected (req.file)
        if (familyPhoto) formData.append('familyPhoto', familyPhoto); 

        try {
            const response = await axios.post(
                API_URL, 
                formData, 
                {
                    // Important: Configure Axios to send the correct headers for file upload
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    // You might need to add a way to send your user's auth token here
                    // e.g., withCredentials: true or manually adding a token header
                }
            );

            setSuccess(`Family "${response.data.data.family_name}" created! Code: ${response.data.data.invitation_code}`);
            
            // Optionally clear the form
            setFamilyName('');
            setMarriageDate('');
            setDescription('');
            setFamilyPhoto(null);
            navigate("/Dashboard");
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error("Family creation error:", err);
        } finally {
            
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create New Family</h1>
            
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">Error: {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Family Name */}
                <div>
                    <label htmlFor="familyName" className="block text-sm font-medium text-gray-700">Family Name <span className="text-red-500">*</span></label>
                    <input
                        id="familyName"
                        type="text"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Marriage Date */}
                <div>
                    <label htmlFor="marriageDate" className="block text-sm font-medium text-gray-700">Marriage Date (Optional)</label>
                    <input
                        id="marriageDate"
                        type="date"
                        value={marriageDate}
                        onChange={(e) => setMarriageDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                {/* Family Photo */}
                <div>
                    <label htmlFor="familyPhoto" className="block text-sm font-medium text-gray-700">Family Photo (Optional)</label>
                    <input
                        id="familyPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFamilyPhoto(e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !familyName}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                    {loading ? 'Creating Family...' : 'Create Family'}
                </button>
            </form>
        </div>
    );
}

export default CreateFamilyForm;