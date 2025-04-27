// src/constants/actionTypes.js
// Auth action types
export const LOGIN = 'auth/login';
export const REGISTER = 'auth/register';
export const LOGOUT = 'auth/logout';
export const CHECK_AUTH = 'auth/checkStatus';

// Auction action types
export const FETCH_AUCTIONS = 'auctions/fetchAuctions';
export const FETCH_AUCTION_BY_ID = 'auctions/fetchAuctionById';
export const CREATE_AUCTION = 'auctions/createAuction';
export const FETCH_USER_AUCTIONS = 'auctions/fetchUserAuctions';
export const FETCH_WON_AUCTIONS = 'auctions/fetchWonAuctions';
export const UPDATE_AUCTION = 'auctions/updateAuction';
export const PLACE_BID = 'auctions/placeBid';

// Bidding action types
export const FETCH_BIDS_BY_AUCTION = 'bidding/fetchBidsByAuctionId';
export const FETCH_USER_BIDS = 'bidding/fetchUserBids';
