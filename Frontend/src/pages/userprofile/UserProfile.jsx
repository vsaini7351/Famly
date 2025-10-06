import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Mail, Phone, Cake, User, Edit2, Zap, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";

// IMPORT YOUR CUSTOM AXIOS INSTANCE (Adjust path as necessary based on your file structure)
// Assuming UserProfile.jsx is in a directory like 'pages' and axios.js is in 'utils'
import api from '../../utils/axios'; 


// ====================================================================
// FamilyNode Component: Renders a family as a single circular node
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
// FamilyTree Visualization Component (Consolidated)
// NOTE: This component is now only used internally within UserProfile
// ====================================================================
const FamilyTreeVisualization = ({ userId, fullName }) => {
    const [allFamily, setAllFamily] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading immediately
    const [error, setError] = useState(null);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);
    
    const NO_FAMILY_ERROR = "User is not a root member of any family";

    const fetchTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        setAllFamily(null); 
        setIsFullyLoaded(false);

        if (!userId) {
            setError("User ID is required to fetch the family tree.");
            setLoading(false);
            return;
        }

        try {
            let allFamilyData = [];
            
            // --- Step 1: Fetch initial data ---
            // Adjusted API call to include user_id
            const currentFamilyRes = await api.get(`/family/tree/${userId}?ancestorOffset=0&descendantOffset=0`);
            const initialData = currentFamilyRes.data;

            if (initialData.currentFamily) {
                initialData.currentFamily.depth = 0; 
                allFamilyData.push(initialData.currentFamily);
            }
            
            const initialAncestors = (initialData.ancestors || []).map(fam => ({ ...fam, depth: fam.depth }));
            const initialDescendants = (initialData.descendants || []).map(fam => ({ ...fam, depth: fam.depth }));
            
            allFamilyData.push(...initialAncestors, ...initialDescendants);


            // --- Step 2 & 3: Fetch additional generations (sequential logic) ---
            let ancestorOffset = 1;
            while (true) {
                const res = await api.get(`/family/tree/${userId}?ancestorOffset=${ancestorOffset}`);
                const newAncestors = res.data.ancestors;
                
                if (!newAncestors || newAncestors.length === 0) break;
                const ancestorsWithDepth = newAncestors.map(fam => ({ ...fam, depth: fam.depth }));
                allFamilyData = [...ancestorsWithDepth, ...allFamilyData];
                ancestorOffset += 1;
            }

            let descendantOffset = 1;
            while (true) {
                const res = await api.get(`/family/tree/${userId}?descendantOffset=${descendantOffset}`);
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
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            
            if (errorMessage.includes(NO_FAMILY_ERROR)) {
                setError("NO_FAMILY_ROOT_ERROR");
                setAllFamily({}); 
            } else {
                setError("❌ Error fetching family tree: " + errorMessage);
            }
        } finally {
            setLoading(false);
            setIsFullyLoaded(true); 
        }
    }, [userId]);

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    // --- RENDERING LOGIC ---

    if (loading) return <div className="text-center p-8 text-lg font-semibold text-purple-600">Loading Family Tree...</div>;
    if (error && error !== "NO_FAMILY_ROOT_ERROR") return <div className="text-center p-8 text-xl text-red-600 font-semibold">{error}</div>;
    
    
    // Custom empty state with personalized message
    if (error === "NO_FAMILY_ROOT_ERROR" || (isFullyLoaded && (!allFamily || Object.keys(allFamily).length === 0))) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-100 rounded-xl shadow-inner border-2 border-dashed border-gray-300">
                <Users className="h-12 w-12 text-purple-400 mb-4" />
                <p className="text-lg text-gray-600 mb-4 text-center font-medium">
                    **{fullName} doesn't have any family circle yet!** 
                </p>
               
            </div>
        );
    }
    
    const sortedDepths = Object.keys(allFamily)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="flex flex-col items-center py-6 px-4 w-full bg-white rounded-xl shadow-xl">
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
                            <div className="w-0.5 h-12 bg-gray-400 my-4"></div>
                        )}
                        
                        {/* Generation Label */}
                        <h2 className="text-base font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full shadow-sm mb-6 z-10 border border-gray-300">
                            {generationLabel}
                        </h2>

                        {/* Family Nodes at this Depth */}
                        <div className="flex flex-wrap justify-center gap-6 lg:gap-10 z-10">
                        {families.map((fam, idx) => (
                            <FamilyNode key={fam.family_id} fam={fam} depth={depth} idx={idx} />
                        ))}
                        </div>
                    </div>
                );
            })}
            
        {isFullyLoaded && (
            <p className="text-sm text-gray-500 font-medium border-t pt-4 mt-6">
                End of the explored tree.
            </p>
        )}
        </div>
    );
};


// ====================================================================
// Utility functions and Helper Components for Profile Info (Unchanged)
// ====================================================================

// Utility function to calculate age from a DOB string (YYYY-MM-DD)
const calculateAge = (dobString) => {
    if (!dobString) return null;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Helper Card Component for Contact Info
const ContactCard = ({ icon: Icon, title, value, isLink = false }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 transition duration-300 hover:shadow-md border border-gray-100">
        <div className={`p-3 rounded-xl ${title === 'Email' ? 'bg-purple-100 text-purple-600' : 
                                           title === 'Phone' ? 'bg-pink-100 text-pink-600' :
                                           title === 'Birthday' ? 'bg-green-100 text-green-600' :
                                           'bg-blue-100 text-blue-600'}`}>
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500">{title}</p>
            {isLink ? (
                <a href={`${title === 'Email' ? 'mailto:' : 'tel:'}${value}`} 
                   className="font-semibold text-gray-800 hover:text-indigo-600 transition">
                    {value}
                </a>
            ) : (
                <p className="font-semibold text-gray-800">{value}</p>
            )}
        </div>
    </div>
);

// Helper to get initials for the avatar if no photo is available
const getInitials = (fullname, username) => {
    const nameParts = fullname?.split(' ');
    if (nameParts?.length >= 2) {
        return nameParts[0][0] + nameParts[nameParts.length - 1][0];
    }
    return fullname ? fullname[0].toUpperCase() : (username ? username[0].toUpperCase() : 'JD');
}


// ====================================================================
// Main UserProfile Component
// ====================================================================
const UserProfile = () => {
    const { user_id } = useParams(); 
    const [profileData, setProfileData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch user profile using your configured axios instance
    const fetchUserProfile = async () => {
        if (!user_id) {
            setError("User ID is missing from the route parameters.");
            setLoading(false);
            return;
        }

        setLoading(true);
        const API_URL = `/user/${user_id}/profile`; 
        
        try {
            const response = await api.get(API_URL);
            
            if (response.data.success && response.data.data) {
                setProfileData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch profile data.');
            }
            
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(`Error fetching profile: ${err.message || 'Check network or server.'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user_id]); 

    // Extract user data
    const user = profileData?.user;
    
    // Calculate derived values for display using useMemo
    const age = useMemo(() => {
        return user?.dob ? calculateAge(user.dob) : 'N/A';
    }, [user?.dob]);

    const formattedDOB = useMemo(() => {
        return user?.dob ? new Date(user.dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }) : 'N/A';
    }, [user?.dob]);

    // --- Loading and Error States for Profile ---
    if (loading) return <div className="text-center p-12 text-lg text-indigo-600 font-semibold">Loading user profile...</div>;
    if (error) return <div className="text-center p-12 text-xl text-red-600 font-bold bg-red-50 rounded-xl shadow-lg m-4">Error: {error}</div>;
    if (!user) return <div className="text-center p-12 text-lg text-gray-500">No user data available.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                
                {/* Header/Banner Section (Gradient) */}
                <header className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white mb-8 flex justify-between items-center relative overflow-hidden">
                    <div className="flex items-center space-x-6">
                        {/* Profile Photo/Initial Circle */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600 flex-shrink-0 border-4 border-white overflow-hidden">
                            {user.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                getInitials(user.fullname, user.username)
                            )}
                        </div>
                        
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold">{user.fullname}</h1>
                            <p className="text-base font-light opacity-80 mt-1">@{user.username}</p>
                            <div className="mt-2 text-sm font-medium space-x-4 flex">
                                <span className="flex items-center">
                                    <Zap className="h-4 w-4 mr-1" />
                                    {age} years old
                                </span>
                                <span className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    {user.gender}
                                </span>
                            </div>
                        </div>
                    </div>

                    
                </header>

                {/* Contact Information Section */}
                <section className="space-y-4 mb-10">
                    <h2 className="text-xl font-bold text-gray-700 flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-indigo-600" />
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ContactCard icon={Mail} title="Email" value={user.email} isLink={true} />
                        <ContactCard icon={Phone} title="Phone" value={`+${user.phone_no}`} isLink={true} />
                        <ContactCard icon={Cake} title="Birthday" value={formattedDOB} />
                        <ContactCard icon={User} title="Gender" value={user.gender} />
                    </div>
                </section>

                {/* Family Tree Section (Centric and Non-Stretched) */}
                <section>
                    <h2 className="text-xl font-bold text-gray-700 flex items-center mb-4">
                        <Users className="h-5 w-5 mr-2 text-indigo-600" />
                        Family Tree
                    </h2>
                    {/* Render the internal FamilyTreeVisualization component */}
                    <div className="max-w-full mx-auto">
                        <FamilyTreeVisualization userId={user.user_id} fullName={user.fullname} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfile;