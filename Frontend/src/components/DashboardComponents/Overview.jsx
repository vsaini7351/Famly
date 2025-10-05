// src/components/DashboardComponents/Overview.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authContext"; // adjust if in another folder
import api from "../../utils/axios";

 const Overview=()=> {
  const { auth } = useAuth();
  const user = auth?.user;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("user not present ")
    if (!user?.user_id) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/${user.user_id}/profile`);
        console.log(res.data.data)
        setProfileData(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.user_id]);

  if (loading) {
    return (
      <div className="p-6 bg-purple-50 min-h-screen flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const family = profileData?.families?.[0];
  const familyMemberCount = family ? profileData?.families?.length : 0;

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      {/* Top Welcome Section */}
     
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.fullname?.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm text-purple-100 mt-1">
            Ready to preserve more family memories today?
          </p>
          {family && (
            <p className="mt-2 text-purple-100">
              You’re part of the <span className="font-semibold">{family.family_name}</span> —{" "}
              <span className="font-bold">{familyMemberCount}</span> members strong 💜
            </p>
          )}
        </div>

        {/* Profile Photo */}
        <div className="flex items-center space-x-3">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
              {user?.fullname?.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview