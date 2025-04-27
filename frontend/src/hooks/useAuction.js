// src/hooks/useAuction.js
// import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAuctions, 
  fetchAuctionById, 
  fetchUserAuctions, 
  fetchWonAuctions,
  createAuction,
  placeBid
} from '../slices/auctionSlice';

export const useAuction = () => {
  const dispatch = useDispatch();
  const { 
    auctions, 
    auction, 
    userAuctions, 
    wonAuctions, 
    loading, 
    error 
  } = useSelector((state) => state.auctions);

  const getAllAuctions = () => {
    return dispatch(fetchAuctions());
  };

  const getAuctionById = (id) => {
    return dispatch(fetchAuctionById(id));
  };

  const getUserAuctions = () => {
    return dispatch(fetchUserAuctions());
  };

  const getWonAuctions = () => {
    return dispatch(fetchWonAuctions());
  };

  const createNewAuction = (auctionData) => {
    return dispatch(createAuction(auctionData));
  };

  const submitBid = (auctionId, amount) => {
    return dispatch(placeBid({ auctionId, amount }));
  };

  return {
    auctions,
    auction,
    userAuctions,
    wonAuctions,
    loading,
    error,
    getAllAuctions,
    getAuctionById,
    getUserAuctions,
    getWonAuctions,
    createNewAuction,
    submitBid
  };
};
