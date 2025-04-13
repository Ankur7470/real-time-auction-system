import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { FaHammer } from 'react-icons/fa';

export default function Navbar() {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <FaHammer className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold text-blue-800">BidHub</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/auctions" className="text-gray-700 hover:text-blue-600">Auctions</Link>
            </nav>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
    );
  }