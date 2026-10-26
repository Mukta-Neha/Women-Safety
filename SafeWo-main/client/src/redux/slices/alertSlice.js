import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  activeAlert: null,
  alerts: [],
  currentAlertDetails: null,
  loading: false,
  sosTriggering: false,
  error: null,
  total: 0,
  totalPages: 1,
  currentPage: 1,
};

export const triggerSOSAlert = createAsyncThunk(
  'alert/triggerSOSAlert',
  async (sosPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/alerts/sos', sosPayload);
      return {
        ...response.data.data,
        autoDispatch: response.data.autoDispatch,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send SOS emergency alert');
    }
  }
);

export const fetchActiveAlert = createAsyncThunk(
  'alert/fetchActiveAlert',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/alerts/active');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch active alert');
    }
  }
);

export const resolveSOSAlert = createAsyncThunk(
  'alert/resolveSOSAlert',
  async ({ alertId, resolutionNotes }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/alerts/${alertId}/resolve`, { resolutionNotes });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to resolve alert');
    }
  }
);

export const cancelSOSAlert = createAsyncThunk(
  'alert/cancelSOSAlert',
  async ({ alertId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/alerts/${alertId}/cancel`, { reason });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel alert');
    }
  }
);

export const fetchAlertsHistory = createAsyncThunk(
  'alert/fetchAlertsHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/alerts', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch alert history');
    }
  }
);

export const fetchAlertById = createAsyncThunk(
  'alert/fetchAlertById',
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/alerts/${alertId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch alert details');
    }
  }
);

export const sendLiveLocation = createAsyncThunk(
  'alert/sendLiveLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/alerts/location', locationData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to record location');
    }
  }
);

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setActiveAlert: (state, action) => {
      state.activeAlert = action.payload;
    },
    updateActiveAlertLocation: (state, action) => {
      if (state.activeAlert) {
        state.activeAlert.latitude = action.payload.latitude;
        state.activeAlert.longitude = action.payload.longitude;
        if (action.payload.accuracy) {
          state.activeAlert.accuracy = action.payload.accuracy;
        }
      }
    },
    clearActiveAlert: (state) => {
      state.activeAlert = null;
    },
    clearAlertError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trigger SOS
      .addCase(triggerSOSAlert.pending, (state) => {
        state.sosTriggering = true;
        state.error = null;
      })
      .addCase(triggerSOSAlert.fulfilled, (state, action) => {
        state.sosTriggering = false;
        state.activeAlert = action.payload;
      })
      .addCase(triggerSOSAlert.rejected, (state, action) => {
        state.sosTriggering = false;
        state.error = action.payload;
      })
      // Fetch Active Alert
      .addCase(fetchActiveAlert.fulfilled, (state, action) => {
        state.activeAlert = action.payload;
      })
      // Resolve SOS
      .addCase(resolveSOSAlert.fulfilled, (state, action) => {
        state.activeAlert = null;
        const index = state.alerts.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Cancel SOS
      .addCase(cancelSOSAlert.fulfilled, (state, action) => {
        state.activeAlert = null;
        const index = state.alerts.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Fetch Alert History
      .addCase(fetchAlertsHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlertsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAlertsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Alert By ID
      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.currentAlertDetails = action.payload;
      });
  },
});

export const {
  setActiveAlert,
  updateActiveAlertLocation,
  clearActiveAlert,
  clearAlertError,
} = alertSlice.actions;

export default alertSlice.reducer;
