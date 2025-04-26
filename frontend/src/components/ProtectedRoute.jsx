// import { Navigate, Outlet, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';


// // const ProtectedRoute = ({ isAuthenticated }) => {
// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return <Outlet />;
// // };

// // export default ProtectedRoute;

// export const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   useEffect(() => {
//     // Check token expiration
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const expiry = payload.exp * 1000; // Convert to milliseconds
        
//         if (Date.now() >= expiry) {
//           // Token expired
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           navigate('/login', { state: { from: location, message: 'Your session has expired. Please login again.' }});
//         }
//       } catch(e) {
//         // Invalid token format
//         console.log(e);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//       }
//     }
//   }, [navigate, location]);
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
  
//   return <Outlet />;
// };

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      toast.error('Please log in to access this page');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
