import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchRates } from '../../services/CurrencyService';
import { Currency, CurrencyState } from '../../types';

const initialState: CurrencyState = {
  base: 'INR',
  rates: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

export const loadRates = createAsyncThunk(
  'currency/loadRates',
  async (base: Currency, { rejectWithValue }) => {
    try {
      return await fetchRates(base);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency(state, action: PayloadAction<Currency>) {
      state.base = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadRates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.rates;
        state.lastUpdated = action.payload.date;
      })
      .addCase(loadRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBaseCurrency } = currencySlice.actions;
export default currencySlice.reducer;