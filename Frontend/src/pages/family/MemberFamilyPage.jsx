// AIInsights.jsx
import React from 'react';
import CreateFamilyForm from '../../components/family/FamilyForm'
import { useState } from 'react';
const MemberFamilyPage = () => {
  const menuItems = [
   { name: "Create New Family", component: <CreateFamilyForm /> },
];
  
 // Use name as state
  const [selectedComponentName, setSelectedComponentName] = useState("Overview");
  // Find the selected component from menuItems
  const selectedComponent = menuItems.find(
    (item) => item.name === selectedComponentName
  )?.component;

  
  return (
    <div>MemberFamilyPage</div>
  );
};

export default MemberFamilyPage;