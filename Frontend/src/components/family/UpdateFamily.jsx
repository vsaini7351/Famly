// components/family/UpdateFamilyForm.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";

export default function UpdateFamilyForm({ familyId }) {
  const [familyData, setFamilyData] = useState({
    family_name: "",
    marriage_date: "",
    description: "",
    familyPhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch existing family data to prefill the form
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await api.get(`/family/${familyId}`);
        const data = res.data.data;
        setFamilyData({
          family_name: data.family_name || "",
          marriage_date: data.marriage_date
            ? new Date(data.marriage_date).toISOString().split("T")[0]
            : "",
          description: data.description || "",
          familyPhoto: null,
        });
      } catch (err) {
        console.error("Error fetching family:", err);
        setMessage({
          type: "error",
          text: "Failed to fetch family details.",
        });
      }
    };
    if (familyId) fetchFamily();
  }, [familyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFamilyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFamilyData((prev) => ({ ...prev, familyPhoto: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();
      formData.append("family_name", familyData.family_name);
      formData.append("marriage_date", familyData.marriage_date);
      formData.append("description", familyData.description);

      if (familyData.familyPhoto) {
        formData.append("familyPhoto", familyData.familyPhoto);
      }

      const res = await api.put(`/family/update/${familyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Family updated successfully!" });
      console.log("Updated family:", res.data.data);
    } catch (err) {
      console.error("Error updating family:", err);
      const msg =
        err.response?.data?.message || "Failed to update family. Try again.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Update Family Details
      </h2>

      {message.text && (
        <div
          className={`text-center mb-4 px-4 py-2 rounded-lg ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="family_name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Family Name
          </label>
          <input
            id="family_name"
            name="family_name"
            type="text"
            value={familyData.family_name}
            onChange={handleChange}
            placeholder="Enter family name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="marriage_date"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Marriage Date
          </label>
          <input
            id="marriage_date"
            name="marriage_date"
            type="date"
            value={familyData.marriage_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={familyData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="familyPhoto"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Family Photo (optional)
          </label>
          <input
            id="familyPhoto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition duration-200 ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:shadow-lg"
          }`}
        >
          {loading ? "Updating..." : "Update Family"}
        </button>
      </form>
    </div>
  );
}
