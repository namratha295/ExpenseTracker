import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseState, Category } from '../../types';

const initialState: ExpenseState = {
  items: [],
  filterCategory: 'All',
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action: PayloadAction<Expense>) {
      state.items.unshift(action.payload); // newest first
    },
    removeExpense(state, action: PayloadAction<string>) {
      state.items = state.items.filter(e => e.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<Category | 'All'>) {
      state.filterCategory = action.payload;
    },
    updateConvertedAmounts(
      state,
      action: PayloadAction<{ rates: Record<string, number>; base: string }>
    ) {
      const { rates, base } = action.payload;
      state.items = state.items.map(expense => {
        if (expense.currency === base) {
          return { ...expense, convertedAmount: expense.amount };
        }
        const rate = rates[base] ? 1 / rates[base] : 1;
        const toBase = rates[expense.currency] ? expense.amount / rates[expense.currency] : expense.amount;
        return { ...expense, convertedAmount: parseFloat(toBase.toFixed(2)) };
      });
    },
  },
});

export const { addExpense, removeExpense, setFilter, updateConvertedAmounts } = expenseSlice.actions;
export default expenseSlice.reducer;