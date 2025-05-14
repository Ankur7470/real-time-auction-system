import React from 'react';
import AuctionStatusBadge from './AuctionStatusBadge';

const AuctionInfo = ({ auction, timeLeft }) => {
  return (
  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="h-64 w-full">
        <img
          src={auction.imageUrl || 'https://via.placeholder.com/600x400'}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
      </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{auction.title}</h2>
        <AuctionStatusBadge status={auction.status} />
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
);
};

export default AuctionInfo;
