import { useState, useEffect } from 'react';
import { getOrCreateUserId } from '../utils/getOrCreateUserId';
import { registerUser } from '../services/api/userService';

export const useUserInitialization = () => {
  const [userId, setUserId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get or create userId from localStorage
        const localUserId = getOrCreateUserId();
        setUserId(localUserId);

        // Check if this is a new user (no registration in localStorage)
        const isRegistered = localStorage.getItem(`user_registered_${localUserId}`);
        
        if (!isRegistered) {
          // Register the user with the backend
          const registrationResult = await registerUser(localUserId);
          
          if (registrationResult.success) {
            setIsNewUser(registrationResult.isNewUser);
            
            // Mark as registered in localStorage
            localStorage.setItem(`user_registered_${localUserId}`, 'true');
            
            if (registrationResult.isNewUser) {
              console.log('🎉 New user registered successfully!');
            } else {
              console.log('👋 Welcome back!');
            }
          } else {
            throw new Error(registrationResult.error || 'Registration failed');
          }
        } else {
          // User already registered, check if they're new
          setIsNewUser(false);
        }
      } catch (err) {
        console.error('User initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return {
    userId,
    isNewUser,
    isLoading,
    error
  };
}; 