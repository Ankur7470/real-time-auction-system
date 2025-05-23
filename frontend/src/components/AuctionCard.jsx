import { useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaClock, FaGavel, FaUser, FaTrash, FaEdit } from 'react-icons/fa';

const AuctionCard = ({ auction, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  if (!auction) {
    return null;
  }

  const handleClick = () => {
    navigate(`/auctions/${auction.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); 
    navigate(`/auctions/${auction.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    if (window.confirm('Are you sure you want to delete this auction?')) {
      if (onDelete) {
        onDelete(auction.id);
      }
    }
  };


  const now = new Date();
  const endTime = auction.endTime ? new Date(auction.endTime) : null;
  const isEnded = endTime ? endTime < now : false;
  const status = auction.status || (isEnded ? 'ENDED' : 'ACTIVE');
  const isOwner = isAuthenticated && currentUser && auction.seller?.email === currentUser.username;

  const currentPrice = auction.currentPrice || auction.startingPrice || 0;
  const formattedPrice = currentPrice.toFixed(2);

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={auction.imageUrl || 'https://via.placeholder.com/300x140'}
          alt={auction.title || 'Auction'}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col h-64">
        <div className="mb-2 flex items-center justify-between">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
            {status === 'ACTIVE' ? 'Active' : 'Ended'}
          </span>
          {auction.category && (
            <span className="text-xs text-gray-500">{auction.category}</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {auction.title || 'Untitled Auction'}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {auction.description || 'No description available'}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-primary font-bold mb-2">
            <div className="flex items-center">
              <FaGavel className="mr-2 text-blue-600" />
              <span className="text-blue-600">
                ${formattedPrice}
              </span>
            </div>
            {isOwner && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Your Auction
              </span>
            )}
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FaClock className="mr-2" />
            <span>
              {endTime
                ? (isEnded ? 'Auction ended' : `Ends ${moment(endTime).fromNow()}`)
                : 'End time not specified'}
            </span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <FaUser className="mr-2" />
            <span className="truncate">
              {auction.seller?.email || 'Unknown seller'}
            </span>
          </div>
          {isOwner && hovered && (
            <div className="absolute top-2 right-2 flex space-x-2 bg-white p-1 rounded-md shadow-md z-10">
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-white hover:bg-blue-600 p-2 rounded transition-colors"
                title="Edit Auction"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded transition-colors"
                title="Delete Auction"
              >
                <FaTrash />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
