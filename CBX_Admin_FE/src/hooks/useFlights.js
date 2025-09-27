// src/hooks/useFlights.js
import { useState, useEffect } from 'react';
import flightAPI from '../api/flightApi';

export const useFlights = (searchParams = {}) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flightAPI.getFlights(searchParams);
      setFlights(data.flights || data); // Tùy thuộc vào cấu trúc response
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [JSON.stringify(searchParams)]);

  return { flights, loading, error, refetch: fetchFlights };
};

export const useCreateFlight = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFlight = async (flightData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await flightAPI.createFlight(flightData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFlight, loading, error };
};

export const useUpdateFlight = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFlight = async (id, flightData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await flightAPI.updateFlight(id, flightData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateFlight, loading, error };
};

export const useDeleteFlight = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteFlight = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await flightAPI.deleteFlight(id);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteFlight, loading, error };
};