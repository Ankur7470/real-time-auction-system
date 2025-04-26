// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//   auctions: [],
//   auction: null,
//   loading: false,
//   error: null,
// };

// // Helper function to create authenticated headers
// const getAuthHeaders = (getState) => {
//   const { auth } = getState();
//   const token = localStorage.getItem('token');
//   const userId = auth.user?.id;
  
//   if (!token || !userId) {
//     throw new Error('User not authenticated');
//   }
  
//   return {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//     'X-User-ID': userId.toString()
//   };
// };

// export const fetchUserAuctions = createAsyncThunk(
//   'auctions/fetchUserAuctions',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState();
//       const userId = auth.user?.id;
      
//       if (!userId) {
//         return rejectWithValue('User not authenticated');
//       }
      
//       const config = {
//         headers: getAuthHeaders(getState)
//       };
      
//       const response = await axios.get(`/api/auctions/seller/${userId}`, config);
//       return response.data;
//     } catch (error) {
//       if (error.message === 'User not authenticated') {
//         return rejectWithValue({ message: error.message });
//       }
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const fetchAuctions = createAsyncThunk(
//   'auctions/fetchAuctions',
//   async (_, { rejectWithValue }) => {
//     try {
//       // Public endpoint - no auth headers needed
//       const response = await axios.get('/api/auctions');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const fetchAuctionById = createAsyncThunk(
//   'auctions/fetchAuctionById',
//   async (id, { rejectWithValue }) => {
//     try {
//       // Public endpoint - no auth headers needed
//       const response = await axios.get(`/api/auctions/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// // export const createAuction = createAsyncThunk(
// //   'auctions/createAuction',
// //   async (auctionData, { getState, rejectWithValue }) => {
// //     try {
// //       const config = {
// //         headers: getAuthHeaders(getState)
// //       };
      
// //       const response = await axios.post('/api/auctions', auctionData, config);
// //       return response.data;
// //     } catch (error) {
// //       if (error.message === 'User not authenticated') {
// //         return rejectWithValue({ message: error.message });
// //       }
// //       return rejectWithValue(error.response?.data || { message: error.message });
// //     }
// //   }
// // );
// // In your createAuction thunk (auctionSlice.js)
// export const createAuction = createAsyncThunk(
//   'auctions/createAuction',
//   async (auctionData, { getState, rejectWithValue }) => {
//     try {
//       const { auth } = getState();
      
//       // Check if user is authenticated
//       if (!auth.isAuthenticated || !auth.user) {
//         return rejectWithValue({ message: 'User not authenticated' });
//       }
      
//       const userId = auth.user.id;
//       const token = localStorage.getItem('token');
      
//       // Verify token exists
//       if (!token) {
//         return rejectWithValue({ message: 'Authentication token not found' });
//       }
      
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'X-User-ID': userId.toString()
//         }
//       };
      
//       const response = await axios.post('/api/auctions', auctionData, config);
//       return response.data;
//     } catch (error) {
//       // Improved error handling
//       if (error.response && error.response.status === 401) {
//         // Force logout on authentication failure
//         localStorage.removeItem('token');
//         return rejectWithValue({ message: 'Session expired, please login again' });
//       }
//       return rejectWithValue(error.response?.data || { message: error.message || 'Failed to create auction' });
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
//         return rejectWithValue('User not authenticated');
//       }
      
//       const config = {
//         headers: getAuthHeaders(getState)
//       };
      
//       const response = await axios.get(`/api/auctions/winner/${userId}`, config);
//       return response.data;
//     } catch (error) {
//       if (error.message === 'User not authenticated') {
//         return rejectWithValue({ message: error.message });
//       }
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// // New thunk for updating an auction
// export const updateAuction = createAsyncThunk(
//   'auctions/updateAuction',
//   async ({ id, auctionData }, { getState, rejectWithValue }) => {
//     try {
//       const config = {
//         headers: getAuthHeaders(getState)
//       };
      
//       const response = await axios.put(`/api/auctions/${id}`, auctionData, config);
//       return response.data;
//     } catch (error) {
//       if (error.message === 'User not authenticated') {
//         return rejectWithValue({ message: error.message });
//       }
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// // New thunk for placing a bid
// export const placeBid = createAsyncThunk(
//   'auctions/placeBid',
//   async ({ auctionId, amount }, { getState, rejectWithValue }) => {
//     try {
//       const config = {
//         headers: getAuthHeaders(getState)
//       };
      
//       const response = await axios.post(`/api/auctions/${auctionId}/bid`, { amount }, config);
//       return response.data;
//     } catch (error) {
//       if (error.message === 'User not authenticated') {
//         return rejectWithValue({ message: error.message });
//       }
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// const auctionSlice = createSlice({
//   name: 'auctions',
//   initialState,
//   reducers: {
//     updateAuctionInList: (state, action) => {
//       const index = state.auctions.findIndex(a => a.id === action.payload.id);
//       if (index !== -1) {
//         state.auctions[index] = action.payload;
//       }
//       if (state.auction && state.auction.id === action.payload.id) {
//         state.auction = action.payload;
//       }
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
//         state.auctions.push(action.payload);
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
//         state.auctions = action.payload;
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
//         state.auctions = action.payload;
//       })
//       .addCase(fetchWonAuctions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateAuction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateAuction.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.auctions.findIndex(a => a.id === action.payload.id);
//         if (index !== -1) {
//           state.auctions[index] = action.payload;
//         }
//         if (state.auction && state.auction.id === action.payload.id) {
//           state.auction = action.payload;
//         }
//       })
//       .addCase(updateAuction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(placeBid.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(placeBid.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.auction && state.auction.id === action.payload.id) {
//           state.auction = action.payload;
//         }
//         const index = state.auctions.findIndex(a => a.id === action.payload.id);
//         if (index !== -1) {
//           state.auctions[index] = action.payload;
//         }
//       })
//       .addCase(placeBid.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { updateAuctionInList } = auctionSlice.actions;
// export default auctionSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/axiosConfig';

const initialState = {
  auctions: [],
  auction: null,
  userAuctions: [],
  wonAuctions: [],
  loading: false,
  error: null,
};

export const fetchAuctions = createAsyncThunk(
  'auctions/fetchAuctions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auctions');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch auctions' }
      );
    }
  }
);

export const fetchAuctionById = createAsyncThunk(
  'auctions/fetchAuctionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auctions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch auction details' }
      );
    }
  }
);

export const createAuction = createAsyncThunk(
  'auctions/createAuction',
  async (auctionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auctions', auctionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to create auction' }
      );
    }
  }
);

export const fetchUserAuctions = createAsyncThunk(
  'auctions/fetchUserAuctions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        return rejectWithValue({ message: 'User not authenticated' });
      }
      
      const response = await api.get(`/auctions/seller/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch your auctions' }
      );
    }
  }
);

export const fetchWonAuctions = createAsyncThunk(
  'auctions/fetchWonAuctions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        return rejectWithValue({ message: 'User not authenticated' });
      }
      
      const response = await api.get(`/auctions/winner/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch won auctions' }
      );
    }
  }
);

export const updateAuction = createAsyncThunk(
  'auctions/updateAuction',
  async ({ id, auctionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/auctions/${id}`, auctionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update auction' }
      );
    }
  }
);

export const placeBid = createAsyncThunk(
  'bidding/placeBid',
  async ({ auctionId, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auctions/${auctionId}/bid`, { amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to place bid' }
      );
    }
  }
);

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    updateAuctionInList: (state, action) => {
      const index = state.auctions.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.auctions[index] = action.payload;
      }
      if (state.auction && state.auction.id === action.payload.id) {
        state.auction = action.payload;
      }
    },
    clearAuctionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuctionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.loading = false;
        state.auction = action.payload;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAuction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions.push(action.payload);
        state.userAuctions.push(action.payload);
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.userAuctions = action.payload;
      })
      .addCase(fetchUserAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWonAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWonAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.wonAuctions = action.payload;
      })
      .addCase(fetchWonAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(updateAuction.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateAuction.fulfilled, (state, action) => {
      //   state.loading = false;
        
      //   // Update in auctions list
      //   const index = state.auctions.findIndex(a => a.id === action.payload.id);
      //   if (index !== -1) {
      //     state.auctions[index] = action.payload;
      //   }
        
      //   // Update in userAuctions list
      //   const userIndex = state.userAuctions.findIndex(a => a.id === action.payload.id);
      //   if (userIndex !== -1) {
      //     state.userAuctions[userIndex] = action.payload;
      //   }
        
      //   // Update current auction if viewing
      //   if (state.auction && state.auction.id === action.payload.id) {
      //     state.auction = action.payload;
      //   }
      // })
      .addCase(placeBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.loading = false;
        // Update auction in state if it exists
        if (state.auction && state.auction.id === action.payload.id) {
          state.auction = action.payload;
        }
        // Update in auctions list if it exists
        const index = state.auctions.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.auctions[index] = action.payload;
        }
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateAuctionInList, clearAuctionError } = auctionSlice.actions;
export default auctionSlice.reducer;
