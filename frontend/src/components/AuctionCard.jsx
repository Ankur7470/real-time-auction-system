// import { Card } from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaGavel } from 'react-icons/fa';

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
    // <div 
    //   onClick={handleClick}
    //   className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 h-full flex flex-col"
    // >
    <div onClick={handleClick} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointe hover:shadow-lg transition-transform hover:scale-105">
      {/* <div 
onClick={handleClick}
className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 h-full flex flex-col"
> */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={auction.imageUrl || 'https://via.placeholder.com/300x140'}
          alt={auction.title || 'Auction'}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {auction.title || 'Untitled Auction'}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {auction.description || 'No description available'}
        </p>

        <div className="mt-auto">
          <div className="flex items-center text-primary font-bold mb-2">
            <FaGavel className="mr-2" />
            <span>${auction.currentPrice ? auction.currentPrice.toFixed(2) : '0.00'}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FaClock className="mr-2" />
            <span>
              {endTime
                ? (isEnded ? 'Auction ended' : `Ends ${moment(endTime).fromNow()}`)
                : 'End time not specified'}
            </span>
          </div>

          <span className={`inline-block px-2 py-1 text-xs rounded-full ${status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
            {status === 'ACTIVE' ? 'Active' : 'Ended'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
{/* <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
<div className="h-48 bg-gray-200 overflow-hidden">
  <img 
    src={auction.image} 
    alt={auction.title}
    className="w-full h-full object-cover"
  />
</div>
<div className="p-4">
  <h3 className="font-bold text-lg mb-2 truncate">{auction.title}</h3>
  <div className="flex justify-between items-center mb-3">
    <span className="font-bold text-blue-600">${auction.currentBid.toLocaleString()}</span>
    <div className="flex items-center text-sm text-gray-500">
      <FaClock className="mr-1" />
      <span>Ends in 2h 15m</span>
    </div>
  </div>
  <Link 
    to={`/auctions/${auction.id}`}
    className="w-full py-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
  >
    <FaGavel className="mr-2" />
    Place Bid
  </Link>
</div>
</div> */}