import axios from 'axios';

export { apiClient };

const ApiClient = {
  new() {
    return axios.create({
      baseURL: 'api',
    });
  },
};

const apiClient = ApiClient.new();
