import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios";

// ====================================================================
// FamilyNode Component: Renders a family as a single circular node
// ====================================================================
const FamilyNode = ({ fam, depth, idx }) => {
    // Determine the style based on depth
    const isCurrent = depth === 0;
    const isAncestor = depth > 0;
    
    // Determine labels
    let mainLabel = fam.family_name;
    let subLabel = "";

    if (isCurrent) {
        subLabel = "Your Family";
    } else if (isAncestor) {
        subLabel = `Ancestor (Depth +${depth})`;
    } else { // Descendant
        subLabel = `Descendant (Depth ${depth})`;
    }

    return (
        <motion.div
            key={fam.family_id}
            initial={{ opacity: 0, y: isAncestor ? -20 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            layout
            className="flex flex-col items-center w-36 text-center"
        >
            {/* The Main Circle Node: Image/Icon and Member Count */}
            <div
                className={`w-24 h-24 rounded-full flex items-center justify-center 
                            font-bold text-xl mb-2 relative shadow-lg transition-all 
                            ${isCurrent ? 'bg-purple-600 border-4 border-fuchsia-300' 
                             : isAncestor ? 'bg-yellow-300 border-2 border-yellow-500' 
                             : 'bg-green-300 border-2 border-green-500'}`}
                title={`${fam.family_name} (${fam.members.length} members)`}
            >
                {fam.familyPhoto ? (
                    <img
                        src={fam.familyPhoto}
                        alt={fam.family_name.charAt(0)}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    // Fallback initial if no photo
                    <span className="text-white text-3xl">{fam.family_name.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Member Count Badge */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-white text-xs text-gray-700 rounded-full border border-gray-400 flex items-center justify-center font-medium">
                    {fam.members.length}
                </div>
            </div>

            {/* Labels below the circle */}
            <p className="font-semibold text-sm text-gray-800">{mainLabel}</p>
            <p className="text-xs text-gray-500">{subLabel}</p>
        </motion.div>
    );
};


// ====================================================================
// FamilyTree Component (Data fetching logic is preserved)
// ====================================================================
const FamilyTree = ({ familyId }) => {
  const [allFamily, setAllFamily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Fetch current family, ancestors, and descendants (Preserving your logic)
  const fetchTree = async () => {
    setLoading(true);
    setError(null);
    setIsFullyLoaded(false); 

    try {
      // Step 1: Fetch initial data
      const currentFamilyRes = await api.get(`/family/tree?ancestorOffset=0&descendantOffset=0`);
      const initialData = currentFamilyRes.data;

      let allFamilyData = [];
      if (initialData.currentFamily) {
          initialData.currentFamily.depth = 0;
          allFamilyData.push(initialData.currentFamily);
      }
      allFamilyData.push(...initialData.ancestors, ...initialData.descendants);

      // Step 2: Fetch additional ancestors
      let ancestorOffset = 1;
      while (true) {
        const res = await api.get(`/family/tree?ancestorOffset=${ancestorOffset}`);
        const newAncestors = res.data.ancestors;
        
        if (!newAncestors || newAncestors.length === 0) break;
        allFamilyData = [...newAncestors, ...allFamilyData];
        ancestorOffset += 1;
      }

      // Step 3: Fetch additional descendants
      let descendantOffset = 1;
      while (true) {
        const res = await api.get(`/family/tree?descendantOffset=${descendantOffset}`);
        const newDescendants = res.data.descendants;
        
        if (!newDescendants || newDescendants.length === 0) break;
        allFamilyData = [...allFamilyData, ...newDescendants];
        descendantOffset += 1;
      }

      // Step 4: Remove duplicates and sort by depth
       const uniqueFamilyMap = new Map();
       allFamilyData.forEach(fam => {
           if (!uniqueFamilyMap.has(fam.family_id)) {
               uniqueFamilyMap.set(fam.family_id, fam);
           }
       });
       const uniqueFamilies = Array.from(uniqueFamilyMap.values());
      uniqueFamilies.sort((a, b) => b.depth - a.depth); 

      // Step 5: Group families by depth
      const familiesByDepth = uniqueFamilies.reduce((acc, fam) => {
        if (!acc[fam.depth]) {
          acc[fam.depth] = [];
        }
        acc[fam.depth].push(fam);
        return acc;
      }, {});

      setAllFamily(familiesByDepth);
    } catch (err) {
      setError("❌ Error fetching family tree: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
      setIsFullyLoaded(true); 
    }
  };

  useEffect(() => {
    fetchTree();
  }, [familyId]);

  if (loading && !allFamily) return <div className="text-center mt-10 text-xl font-semibold text-purple-600">Loading Family Tree...</div>;
  if (error) return <div className="text-center mt-10 text-xl text-red-600 font-semibold">{error}</div>;
  
  if (isFullyLoaded && (!allFamily || Object.keys(allFamily).length === 0)) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <p className="text-lg text-gray-600 mb-4">Create your family fast — before it’s too late in life!</p>
          <button className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
            Create Family
          </button>
        </div>
    );
  }
  
  if (!allFamily) return null;

  const sortedDepths = Object.keys(allFamily)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen">
      {/* Render All Family Members Grouped by Depth */}
      {sortedDepths.map((depth, sectionIndex) => (
        <div key={depth} className="flex flex-col items-center w-full max-w-5xl relative">
            
            {/* Horizontal Line above the section if it's not the top section */}
            {sectionIndex > 0 && (
                <div className="w-1/2 h-0.5 bg-gray-400 my-8"></div>
            )}
            
            {/* Generation Label */}
            <h2 className="text-xl font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm mb-6 z-10">
                {depth > 0 ? `Ancestors` : depth < 0 ? `Descendants` : "Your Generation"}
            </h2>

            {/* Family Nodes at this Depth */}
            <div className="flex flex-wrap justify-center gap-16 z-10">
            {allFamily[depth].map((fam, idx) => (
                <FamilyNode key={fam.family_id} fam={fam} depth={depth} idx={idx} />
            ))}
            </div>
             {/* Vertical Line connecting this section to the next section */}
            {sectionIndex < sortedDepths.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-400 absolute bottom-0"></div>
            )}
        </div>
      ))}
        
    {/* Termination Message */}
    {isFullyLoaded && (
        <p className="text-lg text-gray-500 font-medium border-t pt-4 mt-6">
            No more families
        </p>
    )}
    </div>
  );
};

export default FamilyTree;