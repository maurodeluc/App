import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  
  // Reference Data APIs
  static async getMoodLevels() {
    try {
      const response = await apiClient.get('/moods');
      return response.data;
    } catch (error) {
      console.error('Error fetching mood levels:', error);
      throw error;
    }
  }

  static async getActivityCategories() {
    try {
      const response = await apiClient.get('/activity-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity categories:', error);
      throw error;
    }
  }

  // Mood Entry APIs
  static async getAllEntries(patientId = 'default', limit = 100) {
    try {
      const response = await apiClient.get('/entries', {
        params: { patient_id: patientId, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  static async getEntryByDate(date, patientId = 'default') {
    try {
      const response = await apiClient.get(`/entries/${date}`, {
        params: { patient_id: patientId }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No entry found for this date
      }
      console.error(`Error fetching entry for date ${date}:`, error);
      throw error;
    }
  }

  static async createEntry(entryData, patientId = 'default') {
    try {
      const response = await apiClient.post('/entries', entryData, {
        params: { patient_id: patientId }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  }

  static async updateEntry(entryId, updateData) {
    try {
      const response = await apiClient.put(`/entries/${entryId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating entry ${entryId}:`, error);
      throw error;
    }
  }

  static async deleteEntry(entryId) {
    try {
      const response = await apiClient.delete(`/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting entry ${entryId}:`, error);
      throw error;
    }
  }

  // Statistics APIs
  static async getStatistics(patientId = 'default') {
    try {
      const response = await apiClient.get('/stats/overview', {
        params: { patient_id: patientId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  static async getMoodTrend(days = 90, patientId = 'default') {
    try {
      const response = await apiClient.get('/stats/mood-trend', {
        params: { days, patient_id: patientId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching mood trend:', error);
      throw error;
    }
  }
}

export default ApiService;