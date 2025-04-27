// src/hooks/useBidding.js
import { useDispatch, useSelector } from 'react-redux';
import { fetchBidsByAuctionId, fetchUserBids } from '../slices/biddingSlice';

export const useBidding = () => {
  const dispatch = useDispatch();
  const { bids, userBids, loading, error } = useSelector((state) => state.bidding);

  const getBidsByAuctionId = (auctionId) => {
    return dispatch(fetchBidsByAuctionId(auctionId));
  };

  const getUserBids = () => {
    return dispatch(fetchUserBids());
  };

  return {
    bids,
    userBids,
    loading,
    error,
    getBidsByAuctionId,
    getUserBids
  };
};
