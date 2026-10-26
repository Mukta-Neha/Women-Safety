import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialFilters = {
  keyword: '',
  category: 'ALL',
  severity: 'ALL',
  dateRange: 'ALL',
  sortBy: 'newest',
  radiusKm: '',
};

const initialState = {
  incidents: [],
  currentIncident: null,
  filters: initialFilters,
  loading: false,
  error: null,
  total: 0,
  totalPages: 1,
  currentPage: 1,
};

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { filters, currentPage } = getState().incident;
      const queryParams = {
        ...filters,
        page: params.page || currentPage || 1,
        ...params,
      };

      const response = await api.get('/incidents', { params: queryParams });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

export const fetchIncidentById = createAsyncThunk(
  'incident/fetchIncidentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/incidents/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch incident details');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incident/createIncident',
  async (incidentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/incidents', incidentData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to report incident');
    }
  }
);

export const toggleIncidentHelpful = createAsyncThunk(
  'incident/toggleIncidentHelpful',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/incidents/${id}/helpful`);
      return { id, ...response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update helpful status');
    }
  }
);

export const reportIncidentMisinformation = createAsyncThunk(
  'incident/reportIncidentMisinformation',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/incidents/${id}/misinformation`, { reason });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to report misinformation');
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incident/deleteIncident',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/incidents/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete incident');
    }
  }
);

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    addLiveIncident: (state, action) => {
      // Add newly reported incident to beginning of array if not already present
      const exists = state.incidents.some((inc) => inc._id === action.payload._id);
      if (!exists) {
        state.incidents = [action.payload, ...state.incidents];
        state.total += 1;
      }
    },
    updateLiveIncident: (state, action) => {
      const index = state.incidents.findIndex((inc) => inc._id === action.payload._id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
      if (state.currentIncident && state.currentIncident._id === action.payload._id) {
        state.currentIncident = action.payload;
      }
    },
    clearIncidentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Incident
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.currentIncident = action.payload;
      })
      // Create Incident
      .addCase(createIncident.fulfilled, (state, action) => {
        state.incidents = [action.payload, ...state.incidents];
        state.total += 1;
      })
      // Toggle Helpful
      .addCase(toggleIncidentHelpful.fulfilled, (state, action) => {
        const { id, helpfulCount, isHelpful } = action.payload;
        const inc = state.incidents.find((i) => i._id === id);
        if (inc) {
          inc.helpfulCount = helpfulCount;
          inc.isHelpful = isHelpful;
        }
        if (state.currentIncident && state.currentIncident._id === id) {
          state.currentIncident.helpfulCount = helpfulCount;
          state.currentIncident.isHelpful = isHelpful;
        }
      })
      // Delete Incident
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.incidents = state.incidents.filter((i) => i._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setPage,
  addLiveIncident,
  updateLiveIncident,
  clearIncidentError,
} = incidentSlice.actions;

export default incidentSlice.reducer;
