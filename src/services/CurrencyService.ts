import api from './ApiUtils';
import {Currency} from '../types';

export interface RatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const fetchRates = async (base: Currency): Promise<RatesResponse> => {
  try {
    const response = await api.get<RatesResponse>(`/rates?base=${base}`);
    return response.data;
    } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
    }
};
