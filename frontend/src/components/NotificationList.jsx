import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { clearNotifications } from '../slices/notificationSlice';

const NotificationList = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state.notifications);

  const handleClearAll = () => {
    dispatch(clearNotifications());
    onClose();
  };

  const handleNotificationClick = (notification) => {
    onClose();
    
    // Navigate to auction if auctionId is available
    if (notification.auctionId) {
      navigate(`/auctions/${notification.auctionId}`);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-auto">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium">Notifications</h3>
        <button 
          onClick={handleClearAll}
          className="text-sm text-primary hover:text-blue-700"
        >
          Clear All
        </button>
      </div>
      <ul>
        {notifications.map((notification) => (
          <li 
            key={notification.id} 
            onClick={() => handleNotificationClick(notification)}
            className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              notification.read ? '' : 'bg-blue-50'
            }`}
          >
            <p className="text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {moment(notification.timestamp).fromNow()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
