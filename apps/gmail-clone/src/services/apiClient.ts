import axios from 'axios';
import { API_URL } from '../utils/constants';

export { apiClient };

const ApiClient = {
  new() {
    return axios.create({
      baseURL: API_URL,
    });
  },
};

const apiClient = ApiClient.new();
