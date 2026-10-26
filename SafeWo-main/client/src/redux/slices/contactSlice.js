import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contact/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch emergency contacts');
    }
  }
);

export const createContact = createAsyncThunk(
  'contact/createContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contactData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contact/updateContact',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contacts/${id}`, data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contact/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete contact');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        if (action.payload.isPrimary) {
          state.contacts.forEach((c) => (c.isPrimary = false));
        }
        state.contacts.push(action.payload);
        state.contacts.sort((a, b) => a.priority - b.priority);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          if (action.payload.isPrimary) {
            state.contacts.forEach((c) => (c.isPrimary = false));
          }
          state.contacts[index] = action.payload;
          state.contacts.sort((a, b) => a.priority - b.priority);
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
