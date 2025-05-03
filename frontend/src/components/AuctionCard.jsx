import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaGavel, FaUser } from 'react-icons/fa';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();

  if (!auction) {
    return null;
  }

  const handleClick = () => {
    navigate(`/auctions/${auction.id}`);
  };

  // Safely check if the auction has ended
  const now = new Date();
  const endTime = auction.endTime ? new Date(auction.endTime) : null;
  const isEnded = endTime ? endTime < now : false;
  const status = auction.status || (isEnded ? 'ENDED' : 'ACTIVE');

  return (
    <div 
      onClick={handleClick} 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-105"
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={auction.imageUrl || 'https://via.placeholder.com/300x140'}
          alt={auction.title || 'Auction'}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col h-64">
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'ACTIVE' ? 'Active' : 'Ended'}
          </span>
          <span className="text-xs text-gray-500 ml-2">{auction.category}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {auction.title || 'Untitled Auction'}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {auction.description || 'No description available'}
        </p>

        <div className="mt-auto">
          <div className="flex items-center text-primary font-bold mb-2">
            <FaGavel className="mr-2 text-blue-600" />
            <span className="text-blue-600">${auction.currentPrice ? auction.currentPrice.toFixed(2) : auction.startingPrice ? auction.startingPrice.toFixed(2) : '0.00'}</span>
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
            <span>{auction.seller?.email || 'Unknown seller'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
