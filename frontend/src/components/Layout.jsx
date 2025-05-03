
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHammer, FaPlus, FaUser, FaHome, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';


const Layout = () => {

  const navigate = useNavigate();
 
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
 // const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary shadow-md">
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
                  <Link to="/create-auction" className="flex items-center space-x-2">
                    <FaPlus />
                    <span>Create Auction</span>
                  </Link>
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <FaHome />
                    <span>Dashboard</span>
                  </Link>
                  
                
                  <div className="relative">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <FaUser />
                      <span>{currentUser?.username || 'User'}</span>
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
                  <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-300">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Real-Time Auction System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
