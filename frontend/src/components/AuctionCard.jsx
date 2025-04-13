import { Link } from 'react-router-dom';
import { FaClock, FaGavel } from 'react-icons/fa';

export default function AuctionCard({ auction }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
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
    </div>
  );
}