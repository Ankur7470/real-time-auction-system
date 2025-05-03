// src/components/layout/Header.jsx
/*import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHammer, FaPlus, FaUser, FaHome, FaBell } from 'react-icons/fa';
import { logout } from '../slices/authSlice';
import { markAllNotificationsAsRead } from '../slices/notificationSlice';
//import NotificationList from './NotificationList';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  
  const handleNotificationClick = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <FaHammer className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold text-blue-600">BidHub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/create-auction" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <FaPlus />
                  <span>Create Auction</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <FaHome />
                  <span>Dashboard</span>
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={handleNotificationClick}
                    className="p-1 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none"
                    aria-label="Notifications"
                  >
                    <div className="relative">
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                      <NotificationList onClose={() => setNotificationMenuOpen(false)} />
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    <FaUser />
                    <span>{user?.username || 'User'}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20">
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-800">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-gray-100">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;*/
