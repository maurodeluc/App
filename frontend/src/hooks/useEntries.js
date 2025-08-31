import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllEntries();
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch entries');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async (entryData) => {
    try {
      setError(null);
      const newEntry = await ApiService.createEntry(entryData);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create entry');
      throw err;
    }
  };

  const updateEntry = async (entryId, updateData) => {
    try {
      setError(null);
      const updatedEntry = await ApiService.updateEntry(entryId, updateData);
      setEntries(prev => prev.map(entry => 
        entry.id === entryId ? updatedEntry : entry
      ));
      return updatedEntry;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to update entry');
      throw err;
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      setError(null);
      await ApiService.deleteEntry(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete entry');
      throw err;
    }
  };

  const getEntryByDate = (date) => {
    return entries.find(entry => entry.date === date);
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
    refreshEntries: fetchEntries
  };
};

export const useEntryByDate = (date) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntry = useCallback(async () => {
    if (!date) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getEntryByDate(date);
      setEntry(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch entry');
      console.error(`Error fetching entry for date ${date}:`, err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  return {
    entry,
    loading,
    error,
    refreshEntry: fetchEntry
  };
};