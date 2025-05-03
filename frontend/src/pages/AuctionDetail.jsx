import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import api from '../services/axiosConfig';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { subscribe, send } = useWebSocket();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [error, setError] = useState('');

  const timerRef = useRef(null);
  const subscriptionsRef = useRef([]);

 
  const fetchAuction = async () => {
    try {
      const auctionRes = await api.get(`/auctions/${id}`);
      setAuction(auctionRes.data);

      // Only fetch bids if authenticated
      if (isAuthenticated) {
        try {
          const bidsRes = await api.get(`/bids/auction/${id}`);
          if (bidsRes.data.length > 0) {
            setLeaderboard(bidsRes.data);
            const highestBid = parseFloat(bidsRes.data[0].amount);
            setBidAmount((highestBid + 1).toFixed(2));
            //setBidAmount((parseFloat(bidsRes.data[0].amount) + 1).toFixed(2));
            setAuction(prev => ({
              ...prev,
              currentPrice: highestBid,
              currentHighestBidder: bidsRes.data[0].username
            }));
          }
        } catch (bidsError) {
          console.log("Couldn't fetch bids (might be unauthorized)", bidsError);
        }
      }

      // Set initial bid amount based on starting price
      setBidAmount(parseFloat(auctionRes.data.currentPrice).toFixed(2));
    } catch (error) {
      if (error.response?.status === 401) {
        // This is normal for unauthorized users - just show the auction
        console.log("Unauthorized access to auction details - still showing public info");
      } else if (error.response?.status === 404) {
        toast.error('Auction not found');
      } else {
        toast.error('Failed to load auction details');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Check if current user is the highest bidder
  const isCurrentHighestBidder = isAuthenticated && 
                                leaderboard.length > 0 && 
                                leaderboard[0].username === currentUser.username;
                                
  useEffect(() => {
    fetchAuction();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, isAuthenticated]);
  
  useEffect(() => {
  if (auction && isAuthenticated) {
    // Subscribe to WebSocket updates
    const leaderboardSub = subscribe(
      `/topic/auction/${id}`,
      (message) => {
        const data = JSON.parse(message.body);
        setLeaderboard(data.leaderboard);

        if (data.leaderboard.length > 0) {
          const highestBid = data.leaderboard[0];
          // Update both bid amount and auction details
          setBidAmount((parseFloat(highestBid.amount) + 1).toFixed(2));
          
          // Update auction details for all users
          setAuction(prev => ({
            ...prev,
            currentPrice: parseFloat(highestBid.amount),
            currentHighestBidder: highestBid.username
          }));
        }

        // Notify if outbid
        if (currentUser && data.leaderboard.length > 0 &&
          data.leaderboard[0].username !== currentUser.username &&
          data.leaderboard.some(bid => bid.username === currentUser.username)) {
          toast.warning('You have been outbid!');
        }
      }
    );

    const completedSub = subscribe(
      `/topic/auction/${id}/complete`,
      () => {
        toast.info('This auction has ended');
        fetchAuction(); // This will get the final state
      }
    );

    subscriptionsRef.current = [leaderboardSub, completedSub];

    return () => {
      subscriptionsRef.current.forEach(sub => sub && sub.unsubscribe());
    };
  }
}, [auction, id, isAuthenticated, currentUser, subscribe]);

  useEffect(() => {
    if (auction?.status === 'ACTIVE') {
      const updateTimer = () => {
        const now = new Date();
        const endTime = new Date(auction.endTime);
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft('Auction has ended');
          clearInterval(timerRef.current);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [auction]);
  
  // Check if current user is the auction creator
  const isAuctionOwner = isAuthenticated && currentUser && auction && currentUser.username === auction.seller?.email;

  const handleBid = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
    toast.info('Please login to place a bid');
      navigate('/login', { state: { from: `/auctions/${id}` } });
      return;
    }
    
     if (isAuctionOwner) {
      toast.error("You cannot bid on your own auction");
      return;
    }
    
     if (isCurrentHighestBidder) {
      toast.error("You are already the highest bidder");
      return;
    }

    if (auction.status !== 'ACTIVE') {
      toast.error('This auction is not active');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const currentHighest = leaderboard.length > 0 
      ? parseFloat(leaderboard[0].amount) 
      : parseFloat(auction.startingPrice);


    if (isNaN(bidValue) || bidValue <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }


    if (bidValue <= currentHighest) {
      setError(`Your bid must be higher than $${currentHighest.toFixed(2)}`);
      return;
    }

    if (bidValue < parseFloat(auction.startingPrice)) {
      setError(`Your bid must be at least $${auction.startingPrice}`);
      return;
    }

    setError('');

    try {
      send('/app/bid', {
        auctionId: auction.id,
        amount: bidValue,
        userId: currentUser.id,
        username: currentUser.username
      });
      
      const newBid = {
        amount: bidValue,
        username: currentUser.username,
        timestamp: new Date().toISOString()
      };
      
      setLeaderboard(prev => [newBid, ...prev]);
      setAuction(prev => ({
        ...prev,
        currentPrice: bidValue,
        currentHighestBidder: currentUser.username
      }));
      

      toast.success('Bid placed successfully');
    } catch (err) {
      console.error('Failed to place bid:', err);
      toast.error('Failed to place bid');
      
      fetchAuction();
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'ACTIVE':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'PENDING':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'COMPLETED':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</span>;
      case 'CANCELLED':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading auction details...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Auction not found</p>
      </div>
    );
  }

      
      return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image and Details */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="h-64 w-full">
              <img
                src={auction.imageUrl || 'https://via.placeholder.com/600x400'}
                alt={auction.title}
                className="w-full h-full object-cover"
               // onError={(e) => {
                 // e.target.src = 'https://via.placeholder.com/600x400';
                //}}
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{auction.title}</h2>
                {getStatusBadge(auction.status)}
              </div>
              
              <p className="text-gray-500 mb-4">Created by: {auction.seller?.email}</p>
              <p className="text-gray-700 mb-6">{auction.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="font-semibold">${auction.startingPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="font-semibold">
                    ${auction.currentPrice || auction.startingPrice}
                    {auction.currentHighestBidder && (
                      <span className="text-gray-600 text-sm ml-1">by {auction.currentHighestBidder}</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p>{new Date(auction.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p>{new Date(auction.endTime).toLocaleString()}</p>
                </div>
              </div>

              {auction.status === 'ACTIVE' && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4">
                  <p className="font-semibold text-blue-700">Time Remaining: {timeLeft}</p>
                </div>
              )}

              {auction.status === 'COMPLETED' && auction.currentHighestBidder && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mt-4">
                  <p className="font-semibold text-green-700">
                    Winner: {auction.currentHighestBidder} with a bid of ${auction.currentHighestBid}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Bid Form and History */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Bid Form */}
          {auction.status === 'ACTIVE' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
              {!isAuthenticated ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
                  <p className="text-blue-700">
                    Please <button 
                      onClick={() => navigate('/login', { state: { from: `/auctions/${id}` } })}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      login
                    </button> to place a bid
                  </p>
                </div>
              ) : isAuctionOwner ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
                  <p className="text-yellow-700">
                    You cannot bid on your own auction
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  <form onSubmit={handleBid}>
                    <div className="mb-4">
                      <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Bid Amount ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={auction.startingPrice}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum bid: ${(parseFloat(leaderboard[0]?.amount || auction.startingPrice) + 1).toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Place Bid
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Bid History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Bid History</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isAuthenticated ? (
                leaderboard.length === 0 ? (
                  <div className="px-6 py-4 text-gray-500 text-center">No bids yet</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {leaderboard.map((bid, index) => (
                      <div
                        key={index}
                        className={`px-6 py-4 ${bid.username === currentUser.username ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{bid.username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(bid.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span className="font-semibold text-lg">${bid.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="px-6 py-4 text-gray-500 text-center">
                  <p>
                    Please <button
                      onClick={() => navigate('/login', { state: { from: `/auctions/${id}` } })}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      login
                    </button> to view bid history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      //);
};

      export default AuctionDetail;
