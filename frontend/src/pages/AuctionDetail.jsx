import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import api from '../services/axiosConfig';
import AuctionInfo from '../components/AuctionInfo';
import BidForm from '../components/BidForm';
import BidHistory from '../components/BidHistory';

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

      if (isAuthenticated) {
        try {
          const bidsRes = await api.get(`/bids/auction/${id}`);
          if (bidsRes.data.length > 0) {
            setLeaderboard(bidsRes.data);
            const highestBid = parseFloat(bidsRes.data[0].amount);
            setBidAmount((highestBid + 1).toFixed(2));
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

      setBidAmount(parseFloat(auctionRes.data.currentPrice).toFixed(2));
    } catch (error) {
      if (error.response?.status === 401) {
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

  // Check if current user is the auction creator
  const isAuctionOwner = isAuthenticated && currentUser && auction && currentUser.username === auction.seller?.email;

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
      const leaderboardSub = subscribe(
        `/topic/auction/${id}`,
        (message) => {
          const data = JSON.parse(message.body);
          setLeaderboard(data.leaderboard);

          if (data.leaderboard.length > 0) {
            const highestBid = data.leaderboard[0];
            setBidAmount((parseFloat(highestBid.amount) + 1).toFixed(2));
            setAuction(prev => ({
              ...prev,
              currentPrice: parseFloat(highestBid.amount),
              currentHighestBidder: highestBid.username
            }));
          }

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
          fetchAuction();
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
        {/* Left Column - Product Details */}
        <div className="w-full lg:w-1/2">
          <AuctionInfo
            auction={auction}
            timeLeft={timeLeft}
          />
        </div>

        {/* Right Column - Bid Form and History */}
        <div className="w-full lg:w-1/2 space-y-6">
          {auction.status === 'ACTIVE' && (
            <BidForm
              auction={auction}
              isAuthenticated={isAuthenticated}
              isAuctionOwner={isAuctionOwner}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              error={error}
              handleBid={handleBid}
              leaderboard={leaderboard}
            />
          )}

          <BidHistory
            isAuthenticated={isAuthenticated}
            leaderboard={leaderboard}
            currentUser={currentUser}
            auctionId={id}
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
