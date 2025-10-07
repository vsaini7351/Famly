// components/family/AddRootMemberCard.jsx
import React, { useState } from "react";
import api from "../../utils/axios";

export default function AddRootMemberCard() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAddRootMember = async (e) => {
    e.preventDefault();

    if (!userId || isNaN(userId)) {
      setMessage({ type: "error", text: "Please enter a valid User ID" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Call backend to add root member
      const res = await api.post(`/family/add-root-member`, {
        user_id: Number(userId),
      });
      console.log("hhi",userId);
      setMessage({ type: "success", text: "Root member added successfully!" });
      setUserId(""); // Reset input
      console.log("Root member added:", res.data);
    } catch (err) {
      console.error("Error adding root member:", err);
      const msg =
        err.response?.data?.message || "Failed to add root member. Try again.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Add Root Member
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Add a root member to this family by entering their User ID.
      </p>

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

      <form onSubmit={handleAddRootMember} className="space-y-4">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Enter User ID
          </label>
          <input
            id="userId"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g., 42"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
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
          {loading ? "Adding..." : "Add Root Member"}
        </button>
      </form>
    </div>
  );
}
