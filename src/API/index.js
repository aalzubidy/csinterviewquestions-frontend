import CustomAxios from "./CustomAxios";

const API = {
  getAllCompanies: async (token = '') => {
    try {
      const response = await CustomAxios(token).get('/companies');
      return response;
    } catch (error) {
      throw error;
    }
  },
  getAllPositions: async (token) => {
    try {
      const response = await CustomAxios(token).get('/positions');
      return response;
    } catch (error) {
      throw error;
    }
  },
  posts: {
    getAll: async (body, token = '') => {
      try {
        const response = await CustomAxios(token).post('/posts/all', body);
        return response;
      } catch (error) {
        throw error;
      }
    },
    getByCompany: async (body, token = '') => {
      try {
        const response = await CustomAxios(token).post('/posts/company', body);
        return response;
      } catch (error) {
        throw error;
      }
    },
    getByPosition: async (body, token = '') => {
      try {
        const response = await CustomAxios(token).post('/posts/position', body);
        return response;
      } catch (error) {
        throw error;
      }
    },
    getByCompanyPosition: async (body, token = '') => {
      try {
        const response = await CustomAxios(token).post('/posts/position/company', body);
        return response;
      } catch (error) {
        throw error;
      }
    }
  },
  system: {
    getStatsPositions: async (token = '') => {
      try {
        const response = await CustomAxios(token).get('/stats/positions');
        return response;
      } catch (error) {
        throw error;
      }
    },
    getStatsCompanies: async (token = '') => {
      try {
        const response = await CustomAxios(token).get('/stats/companies');
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
}

export default API;
