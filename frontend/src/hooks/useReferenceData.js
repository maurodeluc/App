import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

export const useReferenceData = () => {
  const [moodLevels, setMoodLevels] = useState([]);
  const [activityCategories, setActivityCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReferenceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [moodsData, activitiesData] = await Promise.all([
        ApiService.getMoodLevels(),
        ApiService.getActivityCategories()
      ]);
      
      setMoodLevels(moodsData);
      setActivityCategories(activitiesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch reference data');
      console.error('Error fetching reference data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  return {
    moodLevels,
    activityCategories,
    loading,
    error,
    refreshReferenceData: fetchReferenceData
  };
};

export const useStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refreshStatistics: fetchStatistics
  };
};