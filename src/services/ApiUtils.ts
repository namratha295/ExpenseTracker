import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.frankfurter.dev/v2',
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
    // Server responded with a status code outside the 2xx range
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject(
        new Error(
          `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        ),
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response received from API'));
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
      return Promise.reject(
        new Error(`Error setting up API request: ${error.message}`),
      );
    }
  },
);

export default api;
