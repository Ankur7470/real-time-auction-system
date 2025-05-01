// Auth endpoints
export const LOGIN_ENDPOINT = '/auth/login';
export const REGISTER_ENDPOINT = '/auth/register';
export const CURRENT_USER_ENDPOINT = '/auth/verify';

// Auction endpoints
export const AUCTIONS_ENDPOINT = '/auctions'; //to fetch all auctions
export const AUCTION_BY_ID_ENDPOINT = (id) => `/auctions/${id}`;   //to fetch details of a particular auction by its auctionId
export const USER_AUCTIONS_ENDPOINT = (userId) => `/auctions/seller/${userId}`;  //fetch auctions created by a user
export const WON_AUCTIONS_ENDPOINT = (userId) => `/auctions/winner/${userId}`;  //fetch auctions won by the user

// Bidding endpoints
export const PLACE_BID_ENDPOINT = '/bids';    //to place bid on a auction
export const BIDS_BY_AUCTION_ENDPOINT = (auctionId) => `/bids/auction/${auctionId}`;  //to fetch bids details on a particular auction by auctionId
export const USER_BIDS_ENDPOINT = (userId) => `/bids/user/${userId}`;    //to fetch bids by user        
