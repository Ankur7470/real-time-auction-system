// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import moment from 'moment';
// import { clearNotifications } from '../slices/notificationSlice';

// const NotificationList = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { notifications } = useSelector((state) => state.notifications);

//   const handleClearAll = () => {
//     dispatch(clearNotifications());
//     onClose();
//   };

//   const handleNotificationClick = (notification) => {
//     onClose();
    
//     // Navigate to auction if auctionId is available
//     if (notification.auctionId) {
//       navigate(`/auctions/${notification.auctionId}`);
//     }
//   };

//   if (notifications.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         No notifications
//       </div>
//     );
//   }

//   return (
//     <div className="max-h-96 overflow-auto">
//       <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
//         <h3 className="font-medium">Notifications</h3>
//         <button 
//           onClick={handleClearAll}
//           className="text-sm text-primary hover:text-blue-700"
//         >
//           Clear All
//         </button>
//       </div>
//       <ul>
//         {notifications.map((notification) => (
//           <li 
//             key={notification.id} 
//             onClick={() => handleNotificationClick(notification)}
//             className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
//               notification.read ? '' : 'bg-blue-50'
//             }`}
//           >
//             <p className="text-gray-800">{notification.message}</p>
//             <p className="text-xs text-gray-500 mt-1">
//               {moment(notification.timestamp).fromNow()}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationList;


// src/components/layout/NotificationList.jsx
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FaBell, FaTrash } from 'react-icons/fa';
// import moment from 'moment';
// import { markNotificationAsRead, clearNotifications } from '../slices/notificationSlice';

// const NotificationList = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { notifications } = useSelector((state) => state.notifications);

//   const handleNotificationClick = (notification) => {
//     dispatch(markNotificationAsRead(notification.id));
    
//     // Navigate to relevant page if applicable
//     if (notification.type === 'bid' && notification.auctionId) {
//       navigate(`/auctions/${notification.auctionId}`);
//     }
    
//     if (onClose) {
//       onClose();
//     }
//   };

//   const handleClearAll = () => {
//     dispatch(clearNotifications());
//     if (onClose) {
//       onClose();
//     }
//   };

//   return (
//     <div className="bg-white rounded-md shadow-lg overflow-hidden">
//       <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//         <div className="flex items-center">
//           <FaBell className="mr-2" />
//           <h3 className="font-semibold">Notifications</h3>
//         </div>
//         <button 
//           onClick={handleClearAll}
//           className="text-white hover:text-red-200 focus:outline-none"
//           title="Clear all notifications"
//         >
//           <FaTrash />
//         </button>
//       </div>
      
//       <div className="max-h-80 overflow-y-auto">
//         {notifications.length === 0 ? (
//           <div className="p-4 text-center text-gray-500">
//             No notifications
//           </div>
//         ) : (
//           <ul>
//             {notifications.map((notification) => (
//               <li 
//                 key={notification.id}
//                 className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
//                   !notification.read ? 'bg-blue-50' : ''
//                 }`}
//                 onClick={() => handleNotificationClick(notification)}
//               >
//                 <div className="text-sm font-medium text-gray-800">
//                   {notification.message}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {moment(notification.timestamp).fromNow()}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationList;


// src/components/NotificationList.js
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import {
  markNotificationAsRead,
  clearNotifications,
} from '../slices/notificationSlice';

const NotificationList = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const handleNotificationClick = (notification) => {
    dispatch(markNotificationAsRead(notification.id));
    if (notification.type === 'bid' && notification.auctionId) {
      navigate(`/auctions/${notification.auctionId}`);
    }
    if (onClose) onClose();
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden w-96">
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <FaBell className="mr-2" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleClearAll}
          className="text-white hover:text-red-200 focus:outline-none"
          title="Clear all notifications"
        >
          <FaTrash />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="text-sm font-medium text-gray-800">
                  {notification.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {moment(notification.timestamp).fromNow()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
