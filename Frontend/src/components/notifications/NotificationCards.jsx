
// export default function NotificationCard({ notification }) {
//   return (
//     <div className="bg-white shadow-md rounded-xl p-4 mb-3 hover:bg-gray-50 transition">
//       <div className="flex justify-between items-center">
//         <h3 className="font-semibold text-gray-800">{notification.title}</h3>
//         <span className="text-xs text-gray-500">
//           {new Date(notification.createdAt).toLocaleString()}
//         </span>
//       </div>
//       <p className="text-gray-600 mt-2">{notification.message || notification.caption}</p>
//     </div>
//   );
// }

export default function NotificationCard({ notification }) {
  return (
    <div
      className={`bg-white shadow-md rounded-xl p-4 mb-3 transition
        ${notification.status === "unread" ? "border-l-4 border-blue-500" : ""}
      `}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
        <span className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-gray-600 mt-2">{notification.message}</p>

      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
        <span>Type: {notification.type}</span>
        <span>User: {notification.user?.fullname || "Unknown"}</span>
        {notification.expiresAt && (
          <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
        )}
        <span>Status: {notification.status}</span>
      </div>
    </div>
  );
}
