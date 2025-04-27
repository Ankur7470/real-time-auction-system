// src/constants/apiEndpoints.js
// Auth endpoints
export const LOGIN_ENDPOINT = '/auth/login';
export const REGISTER_ENDPOINT = '/auth/register';
export const CURRENT_USER_ENDPOINT = '/auth/verify';

// Auction endpoints
export const AUCTIONS_ENDPOINT = '/auctions';
export const AUCTION_BY_ID_ENDPOINT = (id) => `/auctions/${id}`;
export const USER_AUCTIONS_ENDPOINT = (userId) => `/auctions/seller/${userId}`;
export const WON_AUCTIONS_ENDPOINT = (userId) => `/auctions/winner/${userId}`;

// Bidding endpoints
export const PLACE_BID_ENDPOINT = '/bids';
export const BIDS_BY_AUCTION_ENDPOINT = (auctionId) => `/bids/auction/${auctionId}`;
export const USER_BIDS_ENDPOINT = (userId) => `/bids/user/${userId}`;
