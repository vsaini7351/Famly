
// // export default function NotificationCard({ notification }) {
// //   return (
// //     <div className="bg-white shadow-md rounded-xl p-4 mb-3 hover:bg-gray-50 transition">
// //       <div className="flex justify-between items-center">
// //         <h3 className="font-semibold text-gray-800">{notification.title}</h3>
// //         <span className="text-xs text-gray-500">
// //           {new Date(notification.createdAt).toLocaleString()}
// //         </span>
// //       </div>
// //       <p className="text-gray-600 mt-2">{notification.message || notification.caption}</p>
// //     </div>
// //   );
// // }

// export default function NotificationCard({ notification }) {
//   return (
//     <div
//       className={`bg-white shadow-md rounded-xl p-4 mb-3 transition
//         ${notification.status === "unread" ? "border-l-4 border-blue-500" : ""}
//       `}
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="font-semibold text-gray-800">{notification.title}</h3>
//         <span className="text-xs text-gray-500">
//           {new Date(notification.createdAt).toLocaleString()}
//         </span>
//       </div>

//       <p className="text-gray-600 mt-2">{notification.message}</p>

//       <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
//         <span>Type: {notification.type}</span>
//         <span>User: {notification.user?.fullname || "Unknown"}</span>
//         {notification.expiresAt && (
//           <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
//         )}
//         <span>Status: {notification.status}</span>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import api from "../../utils/axios";
// import { getAuthData } from "../../utils/auth.utils";
// import { Trash2 } from "lucide-react";

// export default function NotificationCard({ notification, onDelete }) {
//   const auth = getAuthData();
//   const userId = parseInt(auth?.user?.user_id);

//   // Show delete button only if this notification was sent by the logged-in user
//   console.log("Notification:", notification);
// console.log("Current userId:", userId);
// console.log("fromUserId:", notification.meta?.fromUserId);
//   const isSender = notification.meta?.fromUserId === userId;

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) return;
//     try {
//       console.log("id" ,notification._id)
//       await api.delete(`/notification/${notification._id}`);
//       if (onDelete) onDelete(notification._id); // remove from frontend state
//     } catch (err) {
//       console.error("Failed to delete notification:", err);
//       alert("Failed to delete notification.");
//     }
//   };

//   return (
//     <div
//       className={`bg-white shadow-md rounded-xl p-4 mb-3 transition
//         ${notification.status === "unread" ? "border-l-4 border-blue-500" : ""}
//       `}
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="font-semibold text-gray-800">{notification.title}</h3>
//         <span className="text-xs text-gray-500">
//           {new Date(notification.createdAt).toLocaleString()}
//         </span>
//       </div>

//       <p className="text-gray-600 mt-2">{notification.message}</p>

//       <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
//         <span>Type: {notification.type}</span>
//         <span>User: {notification.user?.fullname || "Unknown"}</span>
//         {notification.expiresAt && (
//           <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
//         )}
//         {/* <span>Status: {notification.status}</span> */}
//       </div>

//       {isSender && (
//         <button
//           onClick={handleDelete}
//           className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
//         >
//           <Trash2 size={16} /> Delete
//         </button>
//       )}
//     </div>
//   );
// }


// import React from "react";
// // NOTE: In a single-file environment, api and auth must be defined globally or passed down.
// // Since this is a separate component file, we assume 'api' and the lucide icons are available
// // via the environment, but auth is explicitly passed as a prop.
// import api from "../../utils/axios";
// import { Trash2, User, Clock, Tag } from "lucide-react";

// export default function NotificationCard({ notification, onDelete, auth }) {
//   // Use auth passed as prop to preserve original variable access pattern
//   const userId = parseInt(auth?.user?.user_id);

//   // Show delete button only if this notification was sent by the logged-in user
//   const isSender = notification.meta?.fromUserId === userId;

//   const handleDelete = async () => {
//     // Replacing window.confirm/alert with console.warn/error as per platform guidelines
//     console.warn("Attempting to delete notification. For a live app, this would use a custom modal for confirmation.");
//     try {
//       // api is assumed to be available from the module scope in a real environment
//       await api.delete(`/notification/${notification._id}`);
//       if (onDelete) onDelete(notification._id); // remove from frontend state
//     } catch (err) {
//       console.error("Failed to delete notification:", err.response?.data?.message || "Error deleting notification.");
//     }
//   };

//   const formattedDate = new Date(notification.createdAt).toLocaleString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   // Determine color based on type for visual flair
//   const typeColor = {
//     general: 'bg-indigo-500',
//     birthday: 'bg-pink-500',
//     anniversary: 'bg-green-500',
//   }[notification.type] || 'bg-gray-500';

//   const senderName = notification.user?.fullname || "System";
//   // Assuming the receiver is the current authenticated user for this page
//   const toReceiverAddress = auth?.user?.fullname || "You (Current User)"; 

//   return (
//     <div
//       className={`bg-white rounded-2xl p-5 mb-5 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-300 ease-in-out border-l-4 ${
//         notification.status === "unread" ? "border-blue-500" : "border-gray-200"
//       }`}
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* 1. Type at the top */}
//       <div className="flex items-center justify-between mb-3 border-b pb-2">
//         <span
//           className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full ${typeColor} shadow-md`}
//         >
//           <Tag size={12} className="inline mr-1 -mt-0.5" />
//           {notification.type}
//         </span>
//         {isSender && (
//           <button
//             onClick={handleDelete}
//             title="Delete Notification"
//             className="text-red-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-100"
//           >
//             <Trash2 size={18} />
//           </button>
//         )}
//       </div>

//       {/* 2. Title in bold */}
//       <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
//         {notification.title}
//       </h3>

//       {/* 3. Sender name: message in good font */}
//       <div className="text-gray-700 text-base mb-3 font-medium">
//         <span className="font-semibold text-gray-800 flex items-center mb-1 text-lg">
//           <User size={16} className="mr-2 text-indigo-500" />
//           {senderName}:
//         </span>
//         <p className="pl-6 text-gray-700 font-serif italic text-lg leading-relaxed">
//           "{notification.message}"
//         </p>
//       </div>

//       {/* 4. To receiver address */}
//       <div className="text-sm text-gray-500 mb-3 border-t pt-3">
//         <span className="font-medium text-indigo-600">
//           To Address: {toReceiverAddress}
//         </span>
//       </div>

//       {/* 5. Date and Time below it */}
//       <div className="flex items-center text-xs text-gray-500 mt-2">
//         <Clock size={12} className="mr-1" />
//         <time dateTime={notification.createdAt}>{formattedDate}</time>
//       </div>
//     </div>
//   );
// }


import React from "react";
import api from "../../utils/axios";
import { Trash2, User, Clock, Tag } from "lucide-react";

export default function NotificationCard({ notification, onDelete, auth }) {
  const userId = parseInt(auth?.user?.user_id);
  const isSender = notification.meta?.fromUserId === userId;

  const handleDelete = async () => {
    // Confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmed) return;

    try {
      await api.delete(`/notification/${notification._id}`);
      if (onDelete) onDelete(notification._id); // remove from frontend state
    } catch (err) {
      console.error("Failed to delete notification:", err.response?.data?.message || "Error deleting notification.");
    }
  };

  const formattedDate = new Date(notification.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const typeColor = {
    general: 'bg-indigo-500',
    birthday: 'bg-pink-500',
    anniversary: 'bg-green-500',
  }[notification.type] || 'bg-gray-500';

  const senderName = notification.user?.fullname || "System";
  const toReceiverAddress = auth?.user?.fullname || "You (Current User)"; 

  return (
    <div
      className={`bg-white rounded-2xl p-5 mb-5 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-300 ease-in-out border-l-4 ${
        notification.status === "unread" ? "border-blue-500" : "border-gray-200"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <span
          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full ${typeColor} shadow-md`}
        >
          <Tag size={12} className="inline mr-1 -mt-0.5" />
          {notification.type}
        </span>
        {isSender && (
          <button
            onClick={handleDelete}
            title="Delete Notification"
            className="text-red-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
        {notification.title}
      </h3>

      <div className="text-gray-700 text-base mb-3 font-medium">
        <span className="font-semibold text-gray-800 flex items-center mb-1 text-lg">
          <User size={16} className="mr-2 text-indigo-500" />
          {senderName}:
        </span>
        <p className="pl-6 text-gray-700 font-serif italic text-lg leading-relaxed">
          "{notification.message}"
        </p>
      </div>

      <div className="text-sm text-gray-500 mb-3 border-t pt-3">
        <span className="font-medium text-indigo-600">
          To Address: {toReceiverAddress}
        </span>
      </div>

      <div className="flex items-center text-xs text-gray-500 mt-2">
        <Clock size={12} className="mr-1" />
        <time dateTime={notification.createdAt}>{formattedDate}</time>
      </div>
    </div>
  );
}
