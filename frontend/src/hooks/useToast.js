import { useState, useCallback } from "react";
 
export function useToast() {
  const [toast, setToast] = useState(null);
 
  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  }, []);
 
  return [toast, showToast];
}
 