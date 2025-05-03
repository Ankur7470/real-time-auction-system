
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import api from '../services/axiosConfig';
// import { 
//   AUCTIONS_ENDPOINT, 
//   AUCTION_BY_ID_ENDPOINT, 
//   USER_AUCTIONS_ENDPOINT, 
//   WON_AUCTIONS_ENDPOINT, 
//   //PLACE_BID_ENDPOINT 
// } from '../constants/apiEndpoints';

// const initialState = {
//   auctions: [],
//   auction: null,
//   userAuctions: [],
//   wonAuctions: [],
//   loading: false,
//   error: null,
// };

// export const fetchAuctions = createAsyncThunk(
//   'auctions/fetchAuctions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get(AUCTIONS_ENDPOINT);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to fetch auctions' }
//       );
//     }
//   }
// );

// export const fetchAuctionById = createAsyncThunk(
//   'auctions/fetchAuctionById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.get(AUCTION_BY_ID_ENDPOINT(id));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to fetch auction details' }
//       );
//     }
//   }
// );

// export const createAuction = createAsyncThunk(
//   'auctions/createAuction',
//   async (auctionData, { rejectWithValue }) => {
//     try {
//       const response = await api.post(AUCTIONS_ENDPOINT, auctionData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to create auction' }
//       );
//     }
//   }
// );

// export const fetchUserAuctions = createAsyncThunk(
//   'auctions/fetchUserAuctions',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState();
//       const userId = auth.user?.id;
      
//       if (!userId) {
//         return rejectWithValue({ message: 'User not authenticated' });
//       }
      
//       const response = await api.get(USER_AUCTIONS_ENDPOINT(userId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to fetch your auctions' }
//       );
//     }
//   }
// );

// export const fetchWonAuctions = createAsyncThunk(
//   'auctions/fetchWonAuctions',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState();
//       const userId = auth.user?.id;
      
//       if (!userId) {
//         return rejectWithValue({ message: 'User not authenticated' });
//       }
      
//       const response = await api.get(WON_AUCTIONS_ENDPOINT(userId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to fetch won auctions' }
//       );
//     }
//   }
// );

// export const updateAuction = createAsyncThunk(
//   'auctions/updateAuction',
//   async ({ id, auctionData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(AUCTION_BY_ID_ENDPOINT(id), auctionData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to update auction' }
//       );
//     }
//   }
// );

// /*
// export const placeBid = createAsyncThunk(
//   'auctions/placeBid',
//   async ({ auctionId, amount }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(PLACE_BID_ENDPOINT, { amount, auctionId });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: 'Failed to place bid' }
//       );
//     }
//   }
// );
// */
// const auctionSlice = createSlice({
//   name: 'auctions',
//   initialState,
//   reducers: {
//     // updateAuctionInList: (state, action) => {
//     //   const updatedAuction = action.payload;
      
//     //   // Update in auctions list if it exists
//     //   const index = state.auctions.findIndex(a => a.id === updatedAuction.id);
//     //   if (index !== -1) {
//     //     state.auctions[index] = updatedAuction;
//     //   }
      
//     //   // Update current auction if it matches
//     //   if (state.auction && state.auction.id === updatedAuction.id) {
//     //     state.auction = updatedAuction;
//     //   }
      
//     //   // Update in userAuctions if it exists
//     //   const userIndex = state.userAuctions.findIndex(a => a.id === updatedAuction.id);
//     //   if (userIndex !== -1) {
//     //     state.userAuctions[userIndex] = updatedAuction;
//     //   }
      
//     //   // Update in wonAuctions if it exists
//     //   const wonIndex = state.wonAuctions.findIndex(a => a.id === updatedAuction.id);
//     //   if (wonIndex !== -1) {
//     //     state.wonAuctions[wonIndex] = updatedAuction;
//     //   }
//     // },
//     updateAuctionInList: (state, action) => {
//       const updatedAuction = action.payload;
      
//       // Helper function to update auction in an array
//       const updateInArray = (array) => {
//         const index = array.findIndex(a => a.id === updatedAuction.id);
//         if (index !== -1) {
//           array[index] = { ...array[index], ...updatedAuction };
//         }
//       };
      
//       // Update in all relevant arrays
//       updateInArray(state.auctions);
      
//       if (state.auction?.id === updatedAuction.id) {
//         state.auction = { ...state.auction, ...updatedAuction };
//       }
      
//       updateInArray(state.userAuctions);
//       updateInArray(state.wonAuctions);
//     },
//     updateCurrentPrice: (state, action) => {
//       const { auctionId, amount } = action.payload;
      
//       // Helper function to update price in an array
//       const updatePriceInArray = (array) => {
//         const index = array.findIndex(a => a.id === auctionId);
//         if (index !== -1) {
//           array[index].currentPrice = amount;
//         }
//       };
      
//       // Update in all relevant arrays
//       updatePriceInArray(state.auctions);
      
//       if (state.auction?.id === auctionId) {
//         state.auction.currentPrice = amount;
//       }
      
//       updatePriceInArray(state.userAuctions);
//       updatePriceInArray(state.wonAuctions);
//     },
//     clearAuctionError: (state) => {
//       state.error = null;
//     },
//     clearAuctionData: (state) => {
//       state.auction = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAuctions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAuctions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.auctions = action.payload;
//       })
//       .addCase(fetchAuctions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchAuctionById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAuctionById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.auction = action.payload;
//       })
//       .addCase(fetchAuctionById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createAuction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createAuction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.auctions.unshift(action.payload);
//         state.userAuctions.unshift(action.payload);
//       })
//       .addCase(createAuction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchUserAuctions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserAuctions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userAuctions = action.payload;
//       })
//       .addCase(fetchUserAuctions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchWonAuctions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWonAuctions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.wonAuctions = action.payload;
//       })
//       .addCase(fetchWonAuctions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//     /*  .addCase(placeBid.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(placeBid.fulfilled, (state, action) => {
//         state.loading = false;
        
//         // Update auction if it matches
//         if (state.auction && state.auction.id === action.payload.auctionId) {
//           state.auction = {
//             ...state.auction,
//             currentPrice: action.payload.amount
//           };
//         }
        
//         // Update in auctions list if it exists
//         const index = state.auctions.findIndex(a => a.id === action.payload.auctionId);
//         if (index !== -1) {
//           state.auctions[index] = {
//             ...state.auctions[index],
//             currentPrice: action.payload.amount
//           };
//         }
//       })
//       .addCase(placeBid.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });*/
//   },
// });

// export const { updateAuctionInList, clearAuctionError, updateCurrentPrice, clearAuctionData } = auctionSlice.actions;
// export default auctionSlice.reducer;
