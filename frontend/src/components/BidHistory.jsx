import React from 'react';
import { useNavigate } from 'react-router-dom';

const BidHistory = ({ isAuthenticated, leaderboard, currentUser, auctionId }) => {
  const navigate = useNavigate();

  return (
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
              Please{' '}
              <button
                onClick={() => navigate('/login', { state: { from: `/auctions/${auctionId}` } })}
                className="text-blue-600 hover:underline font-medium"
              >
                login
              </button>{' '}
              to view bid history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidHistory;
