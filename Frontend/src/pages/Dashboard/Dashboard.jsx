// DashboardLayout.jsx
import { useState } from "react";
import FamilyCircles from "../../components/DashboardComponents/FamilyCircles";
import AddMemory from "../../components/DashboardComponents/AddMemory";
import Timeline from "../../components/DashboardComponents/Timeline";
import FamilyTree from "../../components/DashboardComponents/FamilyTree";
import Search from "../../components/DashboardComponents/Search";
import MemoryPrompts from "../../components/DashboardComponents/MemoryPrompts";
import AIInsights from "../../components/DashboardComponents/AIInsights";

const menuItems = [
  { name: "Family Circles", component: <FamilyCircles /> },
  { name: "Add Memory", component: <AddMemory /> },
  { name: "Timeline", component: <Timeline /> },
  { name: "Family Tree", component: <FamilyTree /> },
  { name: "Search", component: <Search /> },
  { name: "Memory Prompts", component: <MemoryPrompts /> },
  { name: "AI Insights", component: <AIInsights /> },
];

export default function DashboardLayout() {
  const [selectedComponent, setSelectedComponent] = useState(<FamilyCircles />);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-100 p-4">
        <h1 className="text-xl font-bold text-purple-600 mb-6">Famly</h1>
        <nav>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedComponent(item.component)}
              className="block text-purple-600 hover:bg-purple-300 rounded-lg p-3 mb-2 w-full text-left"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        {selectedComponent}
      </main>
    </div>
  );
}
