import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaClock, FaGavel, FaUser } from 'react-icons/fa';
import { fetchAuctionById, placeBid } from '../slices/auctionSlice';
import { fetchBidsByAuctionId } from '../slices/biddingSlice';
import { subscribeToAuction } from '../services/websockerService';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auction, loading: auctionLoading, error: auctionError } = useSelector((state) => state.auctions);
  const { bids, loading: bidsLoading, error: bidsError } = useSelector((state) => state.bidding);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [, setSubscriptions] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);

  // Fetch auction details and bids
  useEffect(() => {
    dispatch(fetchAuctionById(id));
    dispatch(fetchBidsByAuctionId(id));
  }, [dispatch, id]);

  // Subscribe to WebSocket updates
  useEffect(() => {
    if (auction && user) {
      const subs = subscribeToAuction(id, dispatch, user.id);
      setSubscriptions(subs);
      
      return () => {
        // Unsubscribe when component unmounts
        if (subs && subs.auctionSubscription) {
          subs.auctionSubscription.unsubscribe();
        }
        if (subs && subs.bidsSubscription) {
          subs.bidsSubscription.unsubscribe();
        }
      };
    }
  }, [auction, user, id, dispatch]);

  // Update time left countdown
  useEffect(() => {
    if (auction) {
      const updateTimeLeft = () => {
        const end = moment(auction.endTime);
        const now = moment();
        
        if (now.isAfter(end)) {
          setTimeLeft('Auction has ended');
          setIsEnded(true);
        } else {
          const duration = moment.duration(end.diff(now));
          const days = Math.floor(duration.asDays());
          const hours = duration.hours();
          const minutes = duration.minutes();
          const seconds = duration.seconds();
          
          let timeString = '';
          if (days > 0) timeString += `${days}d `;
          if (hours > 0) timeString += `${hours}h `;
          if (minutes > 0) timeString += `${minutes}m `;
          timeString += `${seconds}s`;
          
          setTimeLeft(timeString);
          setIsEnded(false);
        }
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      
      return () => clearInterval(interval);
    }
  }, [auction]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setBidError('');
    setBidLoading(true);
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      setBidError('Please enter a valid amount');
      setBidLoading(false);
      return;
    }
    
    if (!auction || !auction.currentPrice) {
      setBidError('Cannot determine current price');
      setBidLoading(false);
      return;
    }
    
    if (amount <= auction.currentPrice) {
      setBidError(`Bid must be higher than current price: $${auction.currentPrice.toFixed(2)}`);
      setBidLoading(false);
      return;
    }
    
    dispatch(placeBid({ auctionId: id, amount }))
      .unwrap()
      .then(() => {
        setBidAmount('');
        toast.success('Bid placed successfully!');
      })
      .catch((error) => {
        setBidError(error.message || 'Failed to place bid');
      })
      .finally(() => {
        setBidLoading(false);
      });
  };

  if (auctionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
      </div>
    );
  }

  if (auctionError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {auctionError.message || 'Error loading auction details'}
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        Auction not found
      </div>
    );
  }

  // Determine if current user is the seller
  const isSeller = user && auction.seller && user.id === auction.seller.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-12xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Auction Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-2/5 bg-gray-100 flex items-center justify-center">
              <img
                src={auction.imageUrl || 'https://via.placeholder.com/400x300'}
                alt={auction.title}
                className="object-cover w-full h-56 md:h-72 rounded-t-xl md:rounded-t-none md:rounded-l-xl"
              />
            </div>
            {/* Info */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{auction.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  isEnded ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'
                }`}>
                  {isEnded ? 'Ended' : 'Active'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{auction.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FaUser className="mr-2" />
                    Seller
                  </div>
                  <div className="font-medium text-gray-800">{auction.seller?.email || 'Unknown'}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FaGavel className="mr-2" />
                    Starting Price
                  </div>
                  <div className="font-medium text-gray-800">${auction.startingPrice?.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FaGavel className="mr-2" />
                    Current Bid
                  </div>
                  <div className="text-lg font-bold text-blue-700">${auction.currentPrice?.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FaClock className="mr-2" />
                    Time Left
                  </div>
                  <div className={`font-medium ${isEnded ? 'text-red-600' : 'text-gray-800'}`}>{timeLeft}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Bid + History */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Place Bid */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Place a Bid</h2>
            {!isAuthenticated ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-700">
                  Please <button onClick={() => navigate('/login')} className="font-bold underline">login</button> to place a bid
                </p>
              </div>
            ) : isEnded ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-700">This auction has ended</p>
              </div>
            ) : isSeller ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-700">You cannot bid on your own auction</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <div className="mb-4">
                  <label htmlFor="bidAmount" className="block text-gray-700 text-sm font-bold mb-2">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      bidError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={auction.currentPrice + 0.01}
                    step="0.01"
                    disabled={bidLoading}
                    placeholder={`Min: $${(auction.currentPrice + 0.01).toFixed(2)}`}
                  />
                  {bidError && <p className="text-red-500 text-xs mt-1">{bidError}</p>}
                </div>
                <button
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    bidLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={!isAuthenticated || isEnded || isSeller || bidLoading}
                >
                  {bidLoading ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            )}
          </div>
          
          {/* Bid History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Bid History</h2>
            {bidsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : bidsError ? (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">Error loading bids</p>
              </div>
            ) : bids.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No bids yet</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {bids.map((bid) => (
                  <div key={bid.id} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-700">
                        ${bid.amount?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {bid.user?.username || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {moment(bid.timestamp).format('MMM D, YYYY h:mm A')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
