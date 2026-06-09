import api from './ApiUtils';
import {Currency} from '../types';

interface RateItem {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export interface RatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const fetchRates = async (base: Currency): Promise<RatesResponse> => {
  try {
    const response = await api.get<RateItem[]>(`/rates?base=${base}`);

    const rates: Record<string, number> = {};
    response.data.forEach(item => {
      rates[item.quote] = item.rate;
    });

    return {
      base,
      date: response.data[0]?.date ?? new Date().toISOString().slice(0, 10),
      rates,
    };
  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
};