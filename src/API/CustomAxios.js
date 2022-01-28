import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const CustomAxios = (token) => {
  const defaultOptions = {
    baseURL,
    headers: {
      token
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.response.use((response) => {
    return response.data;
  }, (error) => {
    return Promise.reject(error);
  });

  return {
    get: (url, config = {}) => instance.get(url, config),
    post: (url, data, config = {}) => instance.post(url, data, config),
    put: (url, data, config = {}) => instance.put(url, data, config),
    delete: (url, config = {}) => instance.delete(url, config),
  };
};

export default CustomAxios;
