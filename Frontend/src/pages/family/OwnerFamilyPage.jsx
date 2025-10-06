import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import { useAuth } from "../../utils/authContext";

import Overview from "../../components/DashboardComponents/Overview";
import CreateFamilyForm from "../../components/family/FamilyForm";
import AddMemberCard from "../../components/family/AddMemberForm";
import AddRootMemberCard from "../../components/family/AddRootMemberForm";
import UpdateFamilyForm from "../../components/family/UpdateFamily";
import RemoveFamilyMembersCard from "../../components/family/RemoveMember"
import DeleteFamilyCard from "../../components/family/DeleteFamilyCard";

export default function OwnerFamilyPage() {
  const { auth } = useAuth();
  const user = auth?.user;
  const currentUserUserId = user?.user_id;

  const { familyId } = useParams();
  const [familyDetails, setFamilyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComponentName, setSelectedComponentName] = useState("Overview");

  // Fetch family details
  useEffect(() => {
    if (!familyId) return;

    const fetchFamilyDetails = async () => {
      try {
        const res = await api.get(`/family/${familyId}`);
        setFamilyDetails(res.data.data);
      } catch (err) {
        console.error("Error fetching family details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyDetails();
  }, [familyId]);

  if (loading) {
    return <div className="p-8 text-center">Loading family details...</div>;
  }

  if (!familyDetails) {
    return <div className="p-8 text-center text-red-500">Family not found.</div>;
  }

  // Define dashboard menu
  const menuItems = [
    { name: "Overview", component: <Overview familyId={familyId} /> },
    { name: "Create New Family ", component: <CreateFamilyForm /> },
    { name: "Add new member ", component: <AddMemberCard familyId={familyId} /> },
    { name: "Add Root member ", component: <AddRootMemberCard  /> },
    { name: "Update Famliy Details ", component: <UpdateFamilyForm   familyId={familyId} /> },
     { name: "Manage Members", component: <RemoveFamilyMembersCard familyId={familyId} /> },
     { name: "Delete family cards", component: <DeleteFamilyCard familyId={familyId} /> },
    // You can add more sections here later
  ];

  const selectedComponent = menuItems.find(
    (item) => item.name === selectedComponentName
  )?.component;

  return (
    <div className="flex h-screen min-h-screen">
      {/* Main Dashboard Section (now on the LEFT) */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedComponent}
      </main>

      {/* Sidebar — now positioned on the RIGHT */}
      <aside className="w-72 bg-white border-l text-lg font-bold text-gray-800 p-4 border-2 border-purple-600 rounded-lg">
        <div className="rounded-lg mb-8">
          <h2 className="text-lg rounded-lg font-bold text-gray-800">
            Manage {familyDetails.family_name}
          </h2>
          <p className="text-sm rounded-lg font-semibold text-gray-500">
            Explore your family's story
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = selectedComponentName === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedComponentName(item.name)}
                className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-md"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
