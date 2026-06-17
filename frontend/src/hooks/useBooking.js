import { useState, useEffect, useCallback } from "react";
import bookingApi from "../api/bookingApi";
 
export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
 
  const load = useCallback(() => {
    setLoading(true);
    bookingApi.getMy()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
 
  useEffect(() => { load(); }, [load]);
 
  return { bookings, loading, error, reload: load };
}
 
export function useAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
 
  const load = useCallback(() => {
    setLoading(true);
    bookingApi.getAll()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
 
  useEffect(() => { load(); }, [load]);
 
  return { bookings, loading, error, reload: load };
}