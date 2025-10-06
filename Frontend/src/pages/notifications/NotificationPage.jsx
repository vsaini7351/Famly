// pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios"; // your axios instance
import { getAuthData } from "../../utils/auth.utils";

import NotificationCard from "../../components/notifications/NotificationCards";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const auth = getAuthData();
//   const userIdstr = auth?.user?.user_id
//    const userId = parseInt(userIdstr);
//   console.log("userId " , typeof(userId))
//   // API call directly inside page
//   const fetchNotifications = async (pageNumber = 1) => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       const res = await api.get(`/notification/user`);
//       const data = res.data.data;
//       console.log("data " , data)
//       setNotifications(data.notifications);
//       setPage(data.page);
//       setTotalPages(data.totalPages);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications(page);
//   }, [page, userId]);

//   const handlePrev = () => {
//     if (page > 1) setPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (page < totalPages) setPage((prev) => prev + 1);
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-4">
//       <h1 className="text-3xl font-bold mb-6">Your Notifications</h1>

//       {loading && <p>Loading notifications...</p>}

//       {!loading && notifications.length === 0 && (
//         <p className="text-gray-500">No notifications available.</p>
//       )}

//       {notifications.map((notif) => (
//         <NotificationCard key={notif._id} notification={notif} />
//       ))}

//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-6">
//           <button
//             onClick={handlePrev}
//             disabled={page === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={handleNext}
//             disabled={page === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const auth = getAuthData();
  const userId = parseInt(auth?.user?.user_id);

  const fetchNotifications = async (pageNumber = 1) => {
    if (!userId) return;
    setLoading(true);
    try {
      // Send page param to backend
      const res = await api.get(`/notification/user?page=${pageNumber}`);
      const data = res.data.data;
      setNotifications(data.notifications);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page, userId]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Notifications</h1>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">No notifications available.</p>
      )}

      {notifications.map((notif) => (
        <NotificationCard key={notif._id} notification={notif} />
      ))}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
