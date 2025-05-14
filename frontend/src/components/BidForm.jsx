import React from 'react';
import { useNavigate } from 'react-router-dom';

const BidForm = ({
  auction,
  isAuthenticated,
  isAuctionOwner,
  bidAmount,
  setBidAmount,
  error,
  handleBid,
  leaderboard
}) => {
  const navigate = useNavigate();

  if (!auction.status === 'ACTIVE') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
      {!isAuthenticated ? (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
          <p className="text-blue-700">
            Please{' '}
            <button
              onClick={() => navigate('/login', { state: { from: `/auctions/${auction.id}` } })}
              className="text-blue-600 hover:underline font-medium"
            >
              login
            </button>{' '}
            to place a bid
          </p>
        </div>
      ) : isAuctionOwner ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
          <p className="text-yellow-700">You cannot bid on your own auction</p>
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
  );
};

export default BidForm;
