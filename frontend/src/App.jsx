import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';;
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionDetail from './pages/AuctionDetail';
import AuctionList from './pages/AuctionList';
import CreateAuction from './pages/CreateAuction';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import EditAuction from './pages/EditAuction';
//import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
 
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<AuctionList />} />
              <Route path="auctions/:id" element={<AuctionDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="create-auction" element={<CreateAuction />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="auctions/:id/edit" element={<EditAuction />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />

    </ThemeProvider>
  );
}

export default App;
