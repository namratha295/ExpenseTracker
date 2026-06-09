import { fetchRates } from '../services/currencyService';
import { Currency } from '../types';

export interface NormalisedRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

// Calls the service, transforms the response into the shape Redux needs
export const getRates = async (base: Currency): Promise<NormalisedRates> => {
  const data = await fetchRates(base);
  return {
    base: data.base,
    rates: data.rates,
    lastUpdated: data.date,
  };
};

// Pure conversion logic — easy to unit test
export const convertToBase = (
  amount: number,
  fromCurrency: string,
  base: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === base) return amount;
  const rate = rates[fromCurrency];
  if (!rate) return amount;
  return parseFloat((amount / rate).toFixed(2));
};