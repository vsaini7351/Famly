// components/family/DeleteFamilyCard.jsx
import React, { useState } from "react";
import api from "../../utils/axios";

export default function DeleteFamilyCard({ familyId }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleDelete = async () => {
    if (!familyId) return;

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      await api.delete(`/family/delete-family/${familyId}`);

      setMessage({ type: "success", text: "Family deleted successfully!" });
      setConfirm(false);
      console.log("Family deleted");
    } catch (err) {
      console.error("Error deleting family:", err);
      const msg =
        err.response?.data?.message || "Failed to delete family. Try again.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Delete Family
      </h2>
      <p className="text-gray-700 text-center mb-4">
        Deleting a family is irreversible. All members and data will be removed.
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

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200"
        >
          Delete Family
        </button>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete this family?
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
