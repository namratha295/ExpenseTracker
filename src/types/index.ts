export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD';

export type Category = 'Food' | 'Travel' | 'Shopping' | 'Health' | 'Entertainment' | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  category: Category;
  date: string;             
  convertedAmount?: number; 
}

export interface CurrencyState {
  base: Currency;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface ExpenseState {
  items: Expense[];
  filterCategory: Category | 'All';
}