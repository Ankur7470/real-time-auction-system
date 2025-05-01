
// src/store/slices/biddingSlice.js
/*import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/axiosConfig';
import { 
  BIDS_BY_AUCTION_ENDPOINT, 
  USER_BIDS_ENDPOINT 
} from '../constants/apiEndpoints';

const initialState = {
  bids: [],
  userBids: [],
  loading: false,
  error: null,
};

export const fetchBidsByAuctionId = createAsyncThunk(
  'bidding/fetchBidsByAuctionId',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await api.get(BIDS_BY_AUCTION_ENDPOINT(auctionId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch bids' }
      );
    }
  }
);

export const fetchUserBids = createAsyncThunk(
  'bidding/fetchUserBids',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        return rejectWithValue({ message: 'User not authenticated' });
      }
      
      const response = await api.get(USER_BIDS_ENDPOINT(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch your bids' }
      );
    }
  }
);

const biddingSlice = createSlice({
  name: 'bidding',
  initialState,
  reducers: {
    addNewBid: (state, action) => {
    state.bids.unshift(action.payload);
            //state.bids = [action.payload, ...state.bids]; // Prepend new bid
     },
    clearBiddingError: (state) => {
      state.error = null;
    },
    clearBids: (state) => {
      state.bids = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsByAuctionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsByAuctionId.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsByAuctionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBids.fulfilled, (state, action) => {
        state.loading = false;
        state.userBids = action.payload;
      })
      .addCase(fetchUserBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewBid, clearBiddingError, clearBids } = biddingSlice.actions;
export default biddingSlice.reducer; */

// src/slices/biddingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axiosConfig';
import { BIDS_BY_AUCTION_ENDPOINT } from '../constants/apiEndpoints';

export const fetchBidsByAuctionId = createAsyncThunk(
  'bidding/fetchBidsByAuctionId',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await api.get(BIDS_BY_AUCTION_ENDPOINT(auctionId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch bids' });
    }
  }
);

const biddingSlice = createSlice({
  name: 'bidding',
  initialState: { bids: [], loading: false, error: null },
  reducers: {
    addNewBid: (state, action) => {
      state.bids.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsByAuctionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsByAuctionId.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsByAuctionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewBid } = biddingSlice.actions;
export default biddingSlice.reducer;

