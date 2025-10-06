import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios";

// ====================================================================
// FamilyNode Component: Renders a family as a single circular node
// (Unchanged)
// ====================================================================
const FamilyNode = ({ fam, depth, idx }) => {
    const isCurrent = depth === 0;
    const isAncestor = depth > 0;
    
    let mainLabel = fam.family_name;
    let subLabel = "";

    if (isCurrent) {
        subLabel = "Your Family";
    } else if (depth > 0) {
        subLabel = `Ancestor (Gen +${depth})`;
    } else { 
        subLabel = `Descendant (Gen ${Math.abs(depth)})`;
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
            {/* The Main Circle Node */}
            <div
                className={`w-24 h-24 rounded-full flex items-center justify-center 
                            font-bold text-xl mb-2 relative shadow-lg transition-all 
                            ${isCurrent ? 'bg-purple-600 border-4 border-fuchsia-300 text-white' 
                             : isAncestor ? 'bg-yellow-300 border-2 border-yellow-500 text-gray-800' 
                             : 'bg-green-300 border-2 border-green-500 text-gray-800'}`}
                title={`${fam.family_name} (${fam.members.length} members)`}
            >
                {fam.familyPhoto ? (
                    <img
                        src={fam.familyPhoto}
                        alt={fam.family_name.charAt(0)}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    <span className="text-3xl" style={{ color: isCurrent ? 'white' : 'gray-800' }}>{fam.family_name.charAt(0).toUpperCase()}</span>
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
// FamilyTree Component (Logic updated for specific "not a root member" error)
// ====================================================================
const FamilyTree = () => {
    const [allFamily, setAllFamily] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);
    
    // Define the specific backend error message to check for
    const NO_FAMILY_ERROR = "User is not a root member of any family";

    const fetchTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        setAllFamily(null); // Clear previous data on fetch start
        setIsFullyLoaded(false);

        try {
            let allFamilyData = [];
            
            // --- Step 1: Fetch initial data ---
            const currentFamilyRes = await api.get(`/family/tree?ancestorOffset=0&descendantOffset=0`);
            const initialData = currentFamilyRes.data;

            if (initialData.currentFamily) {
                initialData.currentFamily.depth = 0; 
                allFamilyData.push(initialData.currentFamily);
            }
            
            const initialAncestors = (initialData.ancestors || []).map(fam => ({ ...fam, depth: fam.depth }));
            const initialDescendants = (initialData.descendants || []).map(fam => ({ ...fam, depth: fam.depth }));
            
            allFamilyData.push(...initialAncestors, ...initialDescendants);


            // --- Step 2 & 3: Fetch additional generations (using your sequential logic) ---
            let ancestorOffset = 1;
            while (true) {
                const res = await api.get(`/family/tree?ancestorOffset=${ancestorOffset}`);
                const newAncestors = res.data.ancestors;
                
                if (!newAncestors || newAncestors.length === 0) break;
                const ancestorsWithDepth = newAncestors.map(fam => ({ ...fam, depth: fam.depth }));
                allFamilyData = [...ancestorsWithDepth, ...allFamilyData];
                ancestorOffset += 1;
            }

            let descendantOffset = 1;
            while (true) {
                const res = await api.get(`/family/tree?descendantOffset=${descendantOffset}`);
                const newDescendants = res.data.descendants;
                
                if (!newDescendants || newDescendants.length === 0) break;
                const descendantsWithDepth = newDescendants.map(fam => ({ ...fam, depth: fam.depth }));
                allFamilyData = [...allFamilyData, ...descendantsWithDepth];
                descendantOffset += 1;
            }

            // --- Step 4 & 5: Process and Group Data ---
            const uniqueFamilyMap = new Map();
            allFamilyData.forEach(fam => {
                if (!uniqueFamilyMap.has(fam.family_id) || Math.abs(fam.depth) < Math.abs(uniqueFamilyMap.get(fam.family_id).depth)) {
                    uniqueFamilyMap.set(fam.family_id, fam);
                }
            });
            const uniqueFamilies = Array.from(uniqueFamilyMap.values());

            const familiesByDepth = uniqueFamilies.reduce((acc, fam) => {
                if (!acc[fam.depth]) {
                    acc[fam.depth] = [];
                }
                acc[fam.depth].push(fam);
                return acc;
            }, {});

            setAllFamily(familiesByDepth);
        } catch (err) {
            // --- CRITICAL FIX: Check for the specific backend error message ---
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            
            if (errorMessage.includes(NO_FAMILY_ERROR)) {
                // Set a custom error message to trigger the specific CTA display
                setError("NO_FAMILY_ROOT_ERROR");
                setAllFamily({}); // Set to an empty object to avoid the 'loading' screen
            } else {
                setError("❌ Error fetching family tree: " + errorMessage);
            }
        } finally {
            setLoading(false);
            setIsFullyLoaded(true); 
        }
    }, []);

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    // --- RENDERING LOGIC ---

    if (loading && !allFamily) return <div className="text-center mt-10 text-xl font-semibold text-purple-600">Loading Family Tree...</div>;
    if (error && error !== "NO_FAMILY_ROOT_ERROR") return <div className="text-center mt-10 text-xl text-red-600 font-semibold">{error}</div>;
    
    // Check for the "NO_FAMILY_ROOT_ERROR" or if fully loaded with no family data
    if (error === "NO_FAMILY_ROOT_ERROR" || (isFullyLoaded && (!allFamily || Object.keys(allFamily).length === 0))) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <p className="text-lg text-gray-600 mb-4">
                    **You haven't started your family circle yet!** Create your family fast — before it’s too late in life!
                </p>
                <button className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
                    Create Family
                </button>
            </div>
        );
    }
    
    if (!allFamily) return null; // Should be covered by the loading state, but kept as a safeguard

    const sortedDepths = Object.keys(allFamily)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="flex flex-col items-center py-10 px-4 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Family Tree Visualization</h1>
            {/* Render All Family Members Grouped by Depth */}
            {sortedDepths.map((depth, sectionIndex) => {
                const families = allFamily[depth];
                
                let generationLabel = "";
                if (depth === 0) {
                    generationLabel = "Your Generation (Current Family)";
                } else if (depth > 0) {
                    generationLabel = `Ancestors (Generation +${depth})`;
                } else {
                    generationLabel = `Descendants (Generation ${Math.abs(depth)})`;
                }

                return (
                    <div key={depth} className="flex flex-col items-center w-full max-w-5xl relative">
                        
                        {/* Vertical Line connector */}
                        {sectionIndex > 0 && (
                            <div className="w-0.5 h-16 bg-gray-400 my-4"></div>
                        )}
                        
                        {/* Generation Label */}
                        <h2 className="text-xl font-bold text-gray-700 bg-gray-100 px-4 py-1 rounded-full shadow-sm mb-6 z-10 border border-gray-300">
                            {generationLabel}
                        </h2>

                        {/* Family Nodes at this Depth */}
                        <div className="flex flex-wrap justify-center gap-10 lg:gap-16 z-10">
                        {families.map((fam, idx) => (
                            <FamilyNode key={fam.family_id} fam={fam} depth={depth} idx={idx} />
                        ))}
                        </div>
                    </div>
                );
            })}
            
        {/* Termination Message */}
        {isFullyLoaded && (
            <p className="text-lg text-gray-500 font-medium border-t pt-4 mt-6">
                End of the explored tree.
            </p>
        )}
        </div>
    );
};

export default FamilyTree;