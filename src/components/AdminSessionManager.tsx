"use client";

import { useEffect, useState } from 'react';
import { useAdmin } from './AdminContext';
import { toast } from 'react-toastify';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

export default function AdminSessionManager() {
  const { token, logout, isAuthenticated } = useAdmin();
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const checkSessionExpiry = () => {
      try {
        // Decode JWT token to get expiry time
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Show warning if session expires soon
        if (timeUntilExpiry <= SESSION_WARNING_TIME && timeUntilExpiry > 0 && !warningShown) {
          setWarningShown(true);
          const minutesLeft = Math.ceil(timeUntilExpiry / (60 * 1000));
          
          toast.warning(
            `⚠️ Session expires in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}! Please save your work.`,
            {
              position: "top-center",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              toastId: 'session-warning' // Prevent duplicate warnings
            }
          );
        }

        // Auto-logout if session expired
        if (timeUntilExpiry <= 0) {
          toast.error('🔒 Session expired! Please log in again.', {
            position: "top-center",
            autoClose: 5000,
          });
          logout();
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    // Check immediately and then at intervals
    checkSessionExpiry();
    const interval = setInterval(checkSessionExpiry, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [token, isAuthenticated, logout, warningShown]);

  // Reset warning when token changes (new login)
  useEffect(() => {
    setWarningShown(false);
  }, [token]);

  return null; // This is a utility component with no UI
}