import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios"; // Adjust the import path to where your axios instance is located

const FamilyTree = ({ familyId }) => {
  const [data, setData] = useState(null);
  const [ancestorOffset, setAncestorOffset] = useState(0);
  const [descendantOffset, setDescendantOffset] = useState(0);
  const [loading, setLoading] = useState(false);


  const fetchTree = async () => {
    setLoading(true);
    try {
     const res = await api.get(`/family/tree/${familyId}?ancestorOffset=0&descendantOffset=0`);

      console.log("✅ Family tree response:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("❌ Error fetching family tree:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [familyId, ancestorOffset, descendantOffset]); // Refetch when any of the dependencies change

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!data) return null;

  const { currentFamily, ancestors, descendants } = data;

  if (!currentFamily && ancestors.length === 0 && descendants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-gray-600 mb-4">Create your family fast — before it’s too late in life!</p>
        <button className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
          Create Family
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      {/* Ancestors */}
      <section className="flex flex-col items-center gap-4">
        {ancestors.length > 0 ? (
          ancestors.map((fam, idx) => (
            <motion.div
              key={fam.family_id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-yellow-100 p-4 rounded-2xl shadow-lg flex flex-col items-center w-64"
            >
              <img src={fam.familyPhoto} alt={fam.family_name} className="w-20 h-20 rounded-full mb-3" />
              <h3 className="font-bold text-purple-700">{fam.family_name}</h3>
              <p className="text-xs text-gray-600">Depth: {fam.depth}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 italic">No more ancestors available</p>
        )}
      </section>

      {/* Current Family */}
      <motion.div
        layout
        className="bg-gradient-to-r from-purple-100 to-white shadow-xl rounded-2xl p-6 w-80 flex flex-col items-center"
      >
        <img src={currentFamily.familyPhoto} alt={currentFamily.family_name} className="w-24 h-24 rounded-full mb-4" />
        <h2 className="text-xl font-bold text-purple-800">{currentFamily.family_name}</h2>
        <div className="flex gap-3 mt-3">
          {currentFamily.rootMembers.male && (
            <img src={currentFamily.rootMembers.male.profilePhoto} className="w-10 h-10 rounded-full" />
          )}
          {currentFamily.rootMembers.female && (
            <img src={currentFamily.rootMembers.female.profilePhoto} className="w-10 h-10 rounded-full" />
          )}
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {currentFamily.members.length} members
        </p>
      </motion.div>

      {/* Descendants */}
      <section className="flex flex-col items-center gap-4">
        {descendants.length > 0 ? (
          descendants.map((fam, idx) => (
            <motion.div
              key={fam.family_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-yellow-100 p-4 rounded-2xl shadow-lg flex flex-col items-center w-64"
            >
              <img src={fam.familyPhoto} alt={fam.family_name} className="w-20 h-20 rounded-full mb-3" />
              <h3 className="font-bold text-purple-700">{fam.family_name}</h3>
              <p className="text-xs text-gray-600">Depth: {fam.depth}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 italic">No more descendants yet</p>
        )}
      </section>
    </div>
  );
};

export default FamilyTree;


// import { useEffect, useState } from "react";
// import api from "../../utils/axios";

// const FamilyTree = ({ familyId }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchTree = async () => {
//     setLoading(true);
//     try {
//      const res = await api.get(`/family/tree/${familyId}?ancestorOffset=0&descendantOffset=0`);

//       console.log("✅ Family tree response:", res.data);
//       setData(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching family tree:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTree();
//   }, [familyId]);

//   if (loading) return <div>Loading...</div>;
//   if (!data) return <div>No data found</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Family Tree Data:</h2>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default FamilyTree;

