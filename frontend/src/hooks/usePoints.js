import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import pointApi from "../api/pointApi";
 
// Cache điểm trong bộ nhớ — tránh fetch liên tục
let cachedPoints = null;
let lastFetched  = 0;
const CACHE_TTL  = 60 * 1000; // 1 phút
 
export function usePoints() {
  const { isLoggedIn } = useAuth();
  const [points, setPoints] = useState(cachedPoints);
 
  const fetchPoints = useCallback(async (force = false) => {
    if (!isLoggedIn) { setPoints(null); cachedPoints = null; return; }
 
    const now = Date.now();
    // Dùng cache nếu còn hiệu lực và không force
    if (!force && cachedPoints !== null && now - lastFetched < CACHE_TTL) {
      setPoints(cachedPoints);
      return;
    }
 
    try {
      const data = await pointApi.getInfo();
      cachedPoints = data.points;
      lastFetched  = Date.now();
      setPoints(data.points);
    } catch { /* ignore */ }
  }, [isLoggedIn]);
 
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);
 
  // Reset cache khi logout
  useEffect(() => {
    if (!isLoggedIn) {
      cachedPoints = null;
      lastFetched  = 0;
      setPoints(null);
    }
  }, [isLoggedIn]);
 
  return { points, refresh: () => fetchPoints(true) };
}
 