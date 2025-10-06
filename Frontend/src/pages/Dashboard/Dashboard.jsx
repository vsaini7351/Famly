import { useState } from "react";
import FamilyCircles from "../../components/DashboardComponents/FamilyCircles";
import AddMemory from "../../components/DashboardComponents/AddMemory";
import FamilyTree from "../../components/DashboardComponents/FamilyTree";
import Search from "../../components/DashboardComponents/Search";
import MemoryPrompts from "../../components/DashboardComponents/MemoryPrompts";
import AIInsights from "../../components/DashboardComponents/AIInsights";
import Overview from "../../components/DashboardComponents/Overview";
import TimelinePage from "../family/TimelinePage";

const menuItems = [
  { name: "Overview", component: <Overview /> },
  { name: "Family Circles", component: <FamilyCircles /> },
  { name: "Add Memory", component: <AddMemory familyId={2}/> },
  { name: "Timeline", component: <TimelinePage familyId={2} /> },
  { name: "Family Tree", component: <FamilyTree familyId={14} /> },
  { name: "Search", component: <Search /> },
  { name: "Memory Prompts", component: <MemoryPrompts /> },
  { name: "AI Insights", component: <AIInsights /> },
  
];

export default function DashboardLayout() {
  // Use name as state
  const [selectedComponentName, setSelectedComponentName] = useState("Overview");

  // Find the selected component from menuItems
  const selectedComponent = menuItems.find(
    (item) => item.name === selectedComponentName
  )?.component;

  return (
    <div className="flex h-screen min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r text-lg font-bold text-gray-800 p-4 border-2 border-purple-600 rounded-lg">
        <div className="rounded-lg mb-8">
          <h2 className="text-lg rounded-lg font-bold text-gray-800">Navigation</h2>
          <p className="text-sm rounded-lg border-purple font-semibold text-gray-500">
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
                className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 text-left
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-md"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
              >
                <div className={isActive ? "text-white" : "text-purple-600"}>
                  {item.icon}
                </div>
                <div>
                  <p className={`font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                    {item.name}
                  </p>
                  <p className={`text-sm ${isActive ? "text-purple-100" : "text-gray-500"}`}>
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{selectedComponent}</main>
    </div>
  );
}
