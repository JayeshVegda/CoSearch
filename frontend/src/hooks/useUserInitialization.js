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
              } else {
              }
          } else {
            throw new Error(registrationResult.error || 'Registration failed');
          }
        } else {
          // User already registered, they are not new
          setIsNewUser(false);
          // Ensure onboarding is marked as completed for returning users
          localStorage.setItem('onboardingCompleted', 'true');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Listen for onboarding completion to update isNewUser state
  useEffect(() => {
    const handleOnboardingCompleted = () => {
      setIsNewUser(false);
      };

    window.addEventListener('onboardingCompleted', handleOnboardingCompleted);
    return () => window.removeEventListener('onboardingCompleted', handleOnboardingCompleted);
  }, []);

  return {
    userId,
    isNewUser,
    isLoading,
    error
  };
}; 