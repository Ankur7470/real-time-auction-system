import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const BidForm = ({ auction, leaderboard, client }) => {
    const { isAuthenticated } = useAuth();
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [currentHighest, setCurrentHighest] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!isAuthenticated) return toast.error('Please login to place bid');
      if (auction.status !== 'ACTIVE') return toast.error('Auction not active');
  
      const bidValue = parseFloat(bidAmount);
      const highest = leaderboard[0]?.amount || auction.startingPrice;
      setCurrentHighest(highest);
  
      if (bidValue <= currentHighest) {
        return setError(`Bid must exceed $${currentHighest}`);
      }
  
      client.current.publish({
        destination: '/app/bid',
        body: JSON.stringify({
          auctionId: auction.id,
          amount: bidValue,
          userId: JSON.parse(localStorage.getItem('user')).id,
          username: JSON.parse(localStorage.getItem('user')).username
        })
      });
  
      setError('');
      toast.success('Bid placed successfully');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.00"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          min={currentHighest + 1}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Place Bid</button>
      </form>
    );
  };
  