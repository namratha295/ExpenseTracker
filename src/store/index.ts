import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from '../features/expenses/ExpenseSlice';
import currencyReducer from '../features/currency/CurrencySlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;