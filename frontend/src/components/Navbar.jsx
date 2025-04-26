// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaHammer, FaPlus, FaUser, FaHome } from 'react-icons/fa';
// import { RiAuctionFill } from "react-icons/ri";
// import { MdAdminPanelSettings } from "react-icons/md";
// import NotificationBell from './NotificationBell';
// import { useAuth } from '../hooks/useAuth';

// export default function Navbar() {
//   const { isAuthenticated, currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-primary text-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-3">
//           <div className="flex items-center space-x-4">
//             <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
//               <FaHammer className="text-2xl" />
//               <span>Real-Time Auction System</span>
//             </Link>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 <Link to="/create-auction" className="flex items-center space-x-1 hover:text-gray-200">
//                   <FaPlus />
//                   <span>Create Auction</span>
//                 </Link>
//                 <Link to="/my-auctions" className="flex items-center space-x-1 hover:text-gray-200">
//                   <RiAuctionFill />
//                   <span>My Auctions</span>
//                 </Link>
//                 <Link to="/my-bids" className="flex items-center space-x-1 hover:text-gray-200">
//                   <FaGavel />
//                   <span>My Bids</span>
//                 </Link>
                
//                 <NotificationBell />
                
//                 <div className="relative">
//                   <button 
//                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                     className="flex items-center space-x-1 hover:text-gray-200 focus:outline-none"
//                   >
//                     <FaUser />
//                     <span>{currentUser?.username || 'User'}</span>
//                   </button>
                  
//                   {userMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
//                       <div className="py-2">
//                         {currentUser?.isAdmin && (
//                           <Link to="/admin" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                             <MdAdminPanelSettings className="mr-2" />
//                             Admin Panel
//                           </Link>
//                         )}
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link to="/login" className="hover:text-gray-200">Login</Link>
//                 <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100">
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
