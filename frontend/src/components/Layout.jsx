// import {
//   AppBar,
//   Badge,
//   Box,
//   Button,
//   Container,
//   IconButton,
//   Menu,
//   MenuItem,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import { AccountCircle, Notifications } from '@mui/icons-material';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { logout } from '../slices/authSlice';
// import { markAllNotificationsAsRead } from '../slices/notificationSlice';
// import NotificationList from './NotificationList';

// const Layout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const { unreadCount } = useSelector((state) => state.notifications);
  
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleNotificationMenu = (event) => {
//     setNotificationAnchorEl(event.currentTarget);
//     // Mark notifications as read when opened
//     if (unreadCount > 0) {
//       dispatch(markAllNotificationsAsRead());
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNotificationClose = () => {
//     setNotificationAnchorEl(null);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     handleClose();
//     navigate('/');
//     toast.success('You have been logged out');
//   };

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
//             Real-Time Auction System
//           </Typography>
          
//           {isAuthenticated ? (
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Button color="inherit" component={Link} to="/create-auction">
//                 Create Auction
//               </Button>
//               <Button color="inherit" component={Link} to="/dashboard">
//                 Dashboard
//               </Button>
              
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={handleNotificationMenu}
//                 aria-label={`${unreadCount} unread notifications`}
//               >
//                 <Badge badgeContent={unreadCount} color="error">
//                   <Notifications />
//                 </Badge>
//               </IconButton>
//               <Menu
//                 id="notification-menu"
//                 anchorEl={notificationAnchorEl}
//                 anchorOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 open={Boolean(notificationAnchorEl)}
//                 onClose={handleNotificationClose}
//               >
//                 <NotificationList onClose={handleNotificationClose} />
//               </Menu>
              
//               <IconButton
//                 size="large"
//                 onClick={handleMenu}
//                 color="inherit"
//                 aria-label="account menu"
//               >
//                 <AccountCircle />
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorEl}
//                 anchorOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//               >
//                 <MenuItem disabled>{user?.username}</MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </Box>
//           ) : (
//             <Box>
//               <Button color="inherit" component={Link} to="/login">
//                 Login
//               </Button>
//               <Button color="inherit" component={Link} to="/register">
//                 Register
//               </Button>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>
//       <Container sx={{ py: 4 }}>
//         <Outlet />
//       </Container>
//     </>
//   );
// };

// export default Layout;
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHammer, FaPlus, FaUser, FaHome, FaBell } from 'react-icons/fa';
import { logout } from '../slices/authSlice';
import { markAllNotificationsAsRead } from '../slices/notificationSlice';
import NotificationList from './NotificationList';

const Layout = () => {
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
                      onClick={handleNotificationClick}
                      className="p-1 rounded-full hover:text-blue-600 focus:outline-none"
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
                      className="flex items-center space-x-1 focus:outline-none"
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
