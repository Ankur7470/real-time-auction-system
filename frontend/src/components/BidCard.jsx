import { FaGavel, FaClock, FaMoneyBillWave, FaAward, FaUser } from 'react-icons/fa';
import moment from 'moment';

const BidCard = ({ bid }) => {
  if (!bid) return null;

  // Safely extract properties with comprehensive fallbacks
  const auction = bid.auction || {
    id: bid.auctionId,
    title: `Auction ${bid.auctionId}`,
    status: 'ACTIVE',
    endTime: new Date(Date.now() + 86400000).toISOString(),
    imageUrl: 'https://via.placeholder.com/300x140',
    currentPrice: bid.amount
  };

  const amount = bid.amount ? Number(bid.amount) : 0;
  const timestamp = bid.timestamp ? new Date(bid.timestamp) : new Date();
  const user = bid.user || { id: bid.userId, email: 'Unknown User' };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full h-32 flex hover:shadow-lg transition-shadow">
      {/* Left side - Auction Image */}
      <div className="w-1/4 h-full bg-gray-200 overflow-hidden">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x140';
          }}
        />
      </div>

      {/* Right side - Bid Details */}
      <div className="w-3/4 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {auction.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            auction.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {auction.status}
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-2 text-blue-500" />
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2" />
            <span className="text-sm">
              {moment(timestamp).format('MMM D, h:mm A')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="flex items-center">
              <FaUser className="mr-1" />
              {user.email || `User ${user.id}`}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {auction.endTime ? (
              moment(auction.endTime).isBefore(moment()) ? (
                'Auction ended'
              ) : (
                `Ends ${moment(auction.endTime).fromNow()}`
              )
            ) : 'Ongoing'}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BidCard;

