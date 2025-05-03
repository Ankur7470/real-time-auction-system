import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const AuctionDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [error, setError] = useState('');
  const stompClient = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await api.get(`/auctions/${id}`);
        setAuction(response.data);
        
        if (response.data.status === 'ACTIVE') {
          const highestBid = await api.get(`/bids/auction/${id}`);
          if (highestBid.data.length > 0) {
            setBidAmount((parseFloat(highestBid.data[0].amount) + 1).toFixed(2));
            setLeaderboard(highestBid.data);
          } else {
            setBidAmount(parseFloat(response.data.startingPrice).toFixed(2));
          }
        }
      } catch (error) {
        toast.error('Failed to load auction details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
    
    if (isAuthenticated) {
      const socket = new SockJS('/ws-auction');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onConnect: () => {
          console.log('Connected to WebSocket');
          
          stompClient.current.subscribe(`/topic/auction/${id}`, (message) => {
            const updatedLeaderboard = JSON.parse(message.body);
            setLeaderboard(updatedLeaderboard.leaderboard);
            
            if (updatedLeaderboard.length > 0) {
              setBidAmount((parseFloat(updatedLeaderboard[0].amount) + 1).toFixed(2));
            }
            
            if (currentUser && updatedLeaderboard.length > 0 && 
                updatedLeaderboard[0].username !== currentUser.username &&
                updatedLeaderboard.some(bid => bid.username === currentUser.username)) {
              toast.warning('You have been outbid!');
            }
          });
          
          stompClient.current.subscribe(`/topic/auction/${id}/complete`, () => {
            toast.info('This auction has ended');
            fetchAuction();
          });
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        }
      });
      
      stompClient.current.activate();
    }
    
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, isAuthenticated, currentUser]);
  
  useEffect(() => {
    if (auction && auction.status === 'ACTIVE') {
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

  const handleBid = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }
    
    if (auction.status !== 'ACTIVE') {
      toast.error('This auction is not active');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    
    if (isNaN(bidValue) || bidValue <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }
    
    if (leaderboard.length > 0) {
      if (bidValue <= parseFloat(leaderboard[0].amount)) {
        setError('Your bid must be higher than the current highest bid');
        return;
      }
    } else if (bidValue < parseFloat(auction.startingPrice)) {
      setError('Your bid must be at least the starting price');
      return;
    }
    
    setError('');
    
    stompClient.current.publish({
      destination: '/app/bid',
      body: JSON.stringify({
        auctionId: auction.id,
        amount: bidValue,
        userId: currentUser.id,
        username: currentUser.username
      })
    });
    
    console.log('Sending bid:', {
  auctionId: auction.id,
  amount: bidValue,
  userId: currentUser.id,
  username: currentUser.username
});
    
    toast.success('Bid placed successfully');
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
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{auction.title}</h2>
              {getStatusBadge(auction.status)}
            </div>
            
            <p className="text-gray-500 mb-4">Created by: {auction.sellerId}</p>
            
            <p className="text-gray-700 mb-6">{auction.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Starting Price:</p>
                <p>${auction.startingPrice}</p>
              </div>
              <div>
                <p className="font-semibold">Current Highest Bid:</p>
                <p>
                  ${auction.currentPrice || auction.startingPrice}
                 {auction.currentHighestBidder && (
                    <span className="text-gray-600"> by xyz</span>
                  )} 
                
                </p>
              </div>
              <div>
                <p className="font-semibold">Start Time:</p>
                <p>{new Date(auction.startTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">End Time:</p>
                <p>{new Date(auction.endTime).toLocaleString()}</p>
              </div>
            </div>
            
            {auction.status === 'ACTIVE' && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
                <p className="font-semibold text-blue-700">Time Remaining: {timeLeft}</p>
              </div>
            )}
            
            {auction.status === 'COMPLETED' && auction.winner_id && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6">
                <p className="font-semibold text-green-700">
                  Winner: {auction.winner_id} with a bid of ${auction.currentPrice}
                </p>
              </div>
            )}
          </div>
          
          {auction.status === 'ACTIVE' && isAuthenticated && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
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
                    step="0.00"
                    min={auction.startingPrice}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter an amount higher than the current highest bid
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Place Bid
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Bid History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.length === 0 ? (
                <div className="px-4 py-3 text-gray-500">No bids yet</div>
              ) : (
                leaderboard.map((bid, index) => (
                  <div 
                    key={index} 
                    className={`px-4 py-3 ${currentUser && bid.username === currentUser.username ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{bid.username}</span>
                      <span className="font-semibold">${bid.amount}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(bid.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;


// // pages/AuctionDetail.js
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/axiosConfig';

// const AuctionDetail = () => {
//   const { id } = useParams();
//   const { isAuthenticated, currentUser } = useAuth();
  
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bidAmount, setBidAmount] = useState('');
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [timeLeft, setTimeLeft] = useState('');
//   const [error, setError] = useState('');
  
//   const stompClient = useRef(null);
//   const timerRef = useRef(null);

//   const fetchAuctionData = useCallback(async () => {
//     try {
//       const [auctionRes, bidsRes] = await Promise.all([
//         api.get(`/auctions/${id}`),
//         api.get(`/bids/auction/${id}`)
//       ]);
      
//       setAuction(auctionRes.data);
//       setLeaderboard(bidsRes.data);
      
//       if (auctionRes.data.status === 'ACTIVE') {
//         setBidAmount(bidsRes.data.length > 0 
//           ? (parseFloat(bidsRes.data[0].amount) + 1).toFixed(2)
//           : parseFloat(auctionRes.data.startingPrice).toFixed(2)
//         );
//       }
//     } catch (error) {
//       toast.error('Failed to load auction details');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchAuctionData();
    
//     if (isAuthenticated) {
//       const socket = new SockJS('/ws-auction');
//       stompClient.current = new Client({
//         webSocketFactory: () => socket,
//         reconnectDelay: 5000,
//         connectHeaders: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         onConnect: () => {
//           stompClient.current.subscribe(`/topic/auction/${id}`, (message) => {
//             const updatedLeaderboard = JSON.parse(message.body);
//             setLeaderboard(updatedLeaderboard);
            
//             if (updatedLeaderboard.length > 0) {
//               setBidAmount((parseFloat(updatedLeaderboard[0].amount) + 1).toFixed(2));
//             }
            
//             if (currentUser && updatedLeaderboard.some(bid => 
//               bid.username === currentUser.username && 
//               updatedLeaderboard[0].username !== currentUser.username
//             )) {
//               toast.warning('You have been outbid!');
//             }
//           });
          
//           stompClient.current.subscribe(`/topic/auction/${id}/complete`, () => {
//             toast.info('This auction has ended');
//             fetchAuctionData();
//           });
//         },
//         onDisconnect: () => {
//           console.log('WebSocket disconnected');
//         },
//         onStompError: (frame) => {
//           console.error('STOMP error', frame);
//         }
//       });
      
//       stompClient.current.activate();
//     }
    
//     return () => {
//       if (stompClient.current) {
//         stompClient.current.deactivate();
//       }
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [id, isAuthenticated, currentUser, fetchAuctionData]);

//   useEffect(() => {
//     if (!auction || auction.status !== 'ACTIVE') return;

//     const updateTimer = () => {
//       const now = new Date();
//       const endTime = new Date(auction.endTime);
//       const diff = endTime - now;
      
//       if (diff <= 0) {
//         setTimeLeft('Auction has ended');
//         clearInterval(timerRef.current);
//         return;
//       }
      
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
//       setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
//     };
    
//     updateTimer();
//     timerRef.current = setInterval(updateTimer, 1000);
    
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [auction]);

//   const handleBid = async (e) => {
//     e.preventDefault();
    
//     if (!isAuthenticated) {
//       toast.error('Please login to place a bid');
//       return;
//     }
    
//     if (auction.status !== 'ACTIVE') {
//       toast.error('This auction is not active');
//       return;
//     }
    
//     const bidValue = parseFloat(bidAmount);
    
//     if (isNaN(bidValue) || bidValue <= 0) {
//       setError('Please enter a valid bid amount');
//       return;
//     }
    
//     if (leaderboard.length > 0 && bidValue <= parseFloat(leaderboard[0].amount)) {
//       setError('Your bid must be higher than the current highest bid');
//       return;
//     }
    
//     if (bidValue < parseFloat(auction.startingPrice)) {
//       setError('Your bid must be at least the starting price');
//       return;
//     }
    
//     setError('');
    
//     try {
//       await api.post(`/bids`, { 
//         auctionId: auction.id, 
//         amount: bidValue 
//       });
      
//       toast.success('Bid placed successfully');
//       setBidAmount((bidValue + 1).toFixed(2));
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to place bid');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
//     switch (status) {
//       case 'ACTIVE': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
//       case 'PENDING': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
//       case 'COMPLETED': return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</span>;
//       case 'CANCELLED': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
//       default: return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p>Loading auction details...</p>
//       </div>
//     );
//   }

//   if (!auction) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p>Auction not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left Column - Auction Details */}
//         <div className="w-full md:w-2/3">
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold text-gray-800">{auction.title}</h2>
//               {getStatusBadge(auction.status)}
//             </div>
            
//             <p className="text-gray-500 mb-4">Created by: {auction.createdBy}</p>
//             <p className="text-gray-700 mb-6">{auction.description}</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <p className="font-semibold">Starting Price:</p>
//                 <p>${auction.startingPrice}</p>
//               </div>
//               <div>
//                 <p className="font-semibold">Current Highest Bid:</p>
//                 <p>
//                   ${auction.currentHighestBid || auction.startingPrice}
//                   {auction.currentHighestBidder && (
//                     <span className="text-gray-600"> by {auction.currentHighestBidder}</span>
//                   )}
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">Start Time:</p>
//                 <p>{new Date(auction.startTime).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="font-semibold">End Time:</p>
//                 <p>{new Date(auction.endTime).toLocaleString()}</p>
//               </div>
//             </div>
            
//             {auction.status === 'ACTIVE' && (
//               <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
//                 <p className="font-semibold text-blue-700">Time Remaining: {timeLeft}</p>
//               </div>
//             )}
            
//             {auction.status === 'COMPLETED' && auction.currentHighestBidder && (
//               <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6">
//                 <p className="font-semibold text-green-700">
//                   Winner: {auction.currentHighestBidder} with a bid of ${auction.currentHighestBid}
//                 </p>
//               </div>
//             )}
//           </div>
          
//           {auction.status === 'ACTIVE' && isAuthenticated && (
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
//               {error && (
//                 <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-4">
//                   <p className="text-red-700">{error}</p>
//                 </div>
//               )}
//               <form onSubmit={handleBid}>
//                 <div className="mb-4">
//                   <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
//                     Your Bid Amount ($)
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min={auction.startingPrice}
//                     value={bidAmount}
//                     onChange={(e) => setBidAmount(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Enter an amount higher than the current highest bid
//                   </p>
//                 </div>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Place Bid
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
        
//         {/* Right Column - Bid History */}
//         <div className="w-full md:w-1/3">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-4 py-3 border-b border-gray-200">
//               <h3 className="text-lg font-semibold">Bid History</h3>
//             </div>
//             <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
//               {leaderboard.length === 0 ? (
//                 <div className="px-4 py-3 text-gray-500">No bids yet</div>
//               ) : (
//                 leaderboard.map((bid, index) => (
//                   <div 
//                     key={index} 
//                     className={`px-4 py-3 ${currentUser && bid.username === currentUser.username ? 'bg-gray-50' : ''}`}
//                   >
//                     <div className="flex justify-between">
//                       <span className="font-medium">{bid.username}</span>
//                       <span className="font-semibold">${bid.amount}</span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {new Date(bid.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionDetail;
