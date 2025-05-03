

// // src/slices/biddingSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../services/axiosConfig';
// import { BIDS_BY_AUCTION_ENDPOINT } from '../constants/apiEndpoints';

// export const fetchBidsByAuctionId = createAsyncThunk(
//   'bidding/fetchBidsByAuctionId',
//   async (auctionId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(BIDS_BY_AUCTION_ENDPOINT(auctionId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: 'Failed to fetch bids' });
//     }
//   }
// );

// const biddingSlice = createSlice({
//   name: 'bidding',
//   initialState: { 
//     bids: [], 
//     loading: false, 
//     error: null,
//     currentAuctionId: null 
//   },
//   reducers: {
//     addNewBid: (state, action) => {
//       // Check if bid already exists to prevent duplicates
//       const existingIndex = state.bids.findIndex(bid => bid.id === action.payload.id);
//       if (existingIndex === -1) {
//         state.bids.unshift(action.payload);
        
//         // Keep only the latest 50 bids to prevent memory issues
//         if (state.bids.length > 50) {
//           state.bids = state.bids.slice(0, 50);
//         }
//       }
//     },
//     setCurrentAuction: (state, action) => {
//       state.currentAuctionId = action.payload;
//     },
//     clearBids: (state) => {
//       state.bids = [];
//       state.currentAuctionId = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBidsByAuctionId.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchBidsByAuctionId.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bids = action.payload;
//       })
//       .addCase(fetchBidsByAuctionId.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { addNewBid, setCurrentAuction, clearBids } = biddingSlice.actions;
// export default biddingSlice.reducer;