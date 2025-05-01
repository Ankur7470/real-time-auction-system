// import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Route, Routes } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
// import AuctionDetail from './pages/AuctionDetail';
// import AuctionList from './pages/AuctionList';
// import CreateAuction from './pages/CreateAuction';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import NotFound from './pages/NotFound';
// import Register from './pages/Register';
// import ErrorBoundary from './components/ErrorBoundary';
// import { checkAuthStatus } from './slices/authSlice';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1e88e5',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });


// function App() {
//   const dispatch = useDispatch();

//  const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(checkAuthStatus())
//       .unwrap()
//       .catch((err) => {
//         console.error('Auth check failed:', err);
//       });
//   }, [dispatch]); 

//   if (loading && !isAuthenticated) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <ErrorBoundary>
//       {/* <ToastContainer position="top-right" autoClose={3000} /> */}
//       <div className="min-h-screen bg-gray-100">

//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<AuctionList />} />
//           <Route path="auctions/:id" element={<AuctionDetail />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route element={<ProtectedRoute />}>
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="create-auction" element={<CreateAuction />} />
//           </Route>
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//       </div>
//       </ErrorBoundary>
//       <ToastContainer position="top-right" autoClose={3000} />

//     </ThemeProvider>
//   );
// }

// export default App;



// src/App.js
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionDetail from './pages/AuctionDetail';
import AuctionList from './pages/AuctionList';
import CreateAuction from './pages/CreateAuction';
//import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import { checkAuthStatus } from './slices/authSlice';
import { connectWebSocket } from './services/websocket';
import NotificationList from './components/NotificationList';

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus())
      .unwrap()
      .catch((err) => {
        console.error('Auth check failed:', err);
      });
  }, [dispatch]);

  // Connect WebSocket on login
  useEffect(() => {
    if (isAuthenticated && user) {
      connectWebSocket(dispatch, user.id);
    }
  }, [isAuthenticated, user, dispatch]);

  if (loading && !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        {/* NotificationList can be in your Layout/Header for global access */}
        {/* <NotificationList /> */}
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<AuctionList />} />
              <Route path="auctions/:id" element={<AuctionDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
            
                <Route path="create-auction" element={<CreateAuction />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </ErrorBoundary>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
