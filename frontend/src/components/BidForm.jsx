import React from 'react'
import { useState } from 'react';

export default function BidForm() {
    const [currentBid, setCurrentBid] = useState(0);
    return (
      <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
        <h3 className="text-xl font-bold mb-4 text-center">Place Your Bid</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Bid:</span>
            <span className="text-2xl font-bold text-blue-600">${currentBid}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="bidAmount" className="text-sm font-medium">
              Your Bid (Minimum ${currentBid + 1})
            </label>
            <input
              id="bidAmount"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md"
              min={currentBid + 1}
            />
          </div>
          
          <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
            Place Bid
          </button>
        </div>
      </div>
    );
  }