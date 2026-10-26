import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  safeZones: [],
  insideSafeZone: false,
  currentZone: null,
  loading: false,
  error: null,
};

export const fetchSafeZones = createAsyncThunk(
  'safeZone/fetchSafeZones',
  async (coords = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (coords.latitude && coords.longitude) {
        params.userLat = coords.latitude;
        params.userLon = coords.longitude;
      }
      const response = await api.get('/safe-zones', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch safe zones');
    }
  }
);

export const createSafeZone = createAsyncThunk(
  'safeZone/createSafeZone',
  async (zoneData, { rejectWithValue }) => {
    try {
      const response = await api.post('/safe-zones', zoneData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create safe zone');
    }
  }
);

export const updateSafeZone = createAsyncThunk(
  'safeZone/updateSafeZone',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/safe-zones/${id}`, data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update safe zone');
    }
  }
);

export const deleteSafeZone = createAsyncThunk(
  'safeZone/deleteSafeZone',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/safe-zones/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete safe zone');
    }
  }
);

const safeZoneSlice = createSlice({
  name: 'safeZone',
  initialState,
  reducers: {
    setInsideStatus: (state, action) => {
      state.insideSafeZone = action.payload.inside;
      state.currentZone = action.payload.zone;
    },
    clearSafeZoneError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSafeZones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSafeZones.fulfilled, (state, action) => {
        state.loading = false;
        state.safeZones = action.payload.data;
        state.insideSafeZone = action.payload.isInsideAny;
        state.currentZone = action.payload.currentZone;
      })
      .addCase(fetchSafeZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSafeZone.fulfilled, (state, action) => {
        state.safeZones.unshift(action.payload);
      })
      .addCase(updateSafeZone.fulfilled, (state, action) => {
        const index = state.safeZones.findIndex((z) => z._id === action.payload._id);
        if (index !== -1) {
          state.safeZones[index] = action.payload;
        }
      })
      .addCase(deleteSafeZone.fulfilled, (state, action) => {
        state.safeZones = state.safeZones.filter((z) => z._id !== action.payload);
      });
  },
});

export const { setInsideStatus, clearSafeZoneError } = safeZoneSlice.actions;
export default safeZoneSlice.reducer;
