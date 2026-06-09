import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Currency, Category } from '../types';

// Validation — returns an error string or null if valid
export const validateExpense = (title: string, amount: string): string | null => {
  if (!title.trim()) return 'Title is required';
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) return 'Enter a valid amount greater than 0';
  return null;
};

// Builds the Expense object — screen just passes raw form values
export const createExpense = (
  title: string,
  amount: number,
  currency: Currency,
  category: Category
): Expense => ({
  id: uuidv4(),
  title: title.trim(),
  amount,
  currency,
  category,
  date: new Date().toISOString(),
});