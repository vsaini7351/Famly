// components/family/JoinFamilyCard.jsx
import React, { useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
export default function JoinFamilyCard() {
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleJoinFamily = async (e) => {
    e.preventDefault();

    if (!invitationCode.trim()) {
      setMessage({ type: "error", text: "Please enter a valid invitation code" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Call backend to join family
      const res = await api.post("/family/join-family", {
        invitation_code: invitationCode.trim(),
      });

      setMessage({ type: "success", text: "Joined family successfully!" });
      setInvitationCode("");
      console.log("Joined family:", res.data.data);
      navigate("/Dashboard")
    } catch (err) {
      console.error("Error joining family:", err);
      const msg =
        err.response?.data?.message || "Failed to join family. Try again.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Join a Family
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your family invitation code to join a family.
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

      <form onSubmit={handleJoinFamily} className="space-y-4">
        <div>
          <label
            htmlFor="invitationCode"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Invitation Code
          </label>
          <input
            id="invitationCode"
            type="text"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            placeholder="e.g., FAM-APCGCX"
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
          {loading ? "Joining..." : "Join Family"}
        </button>
      </form>
    </div>
  );
}
