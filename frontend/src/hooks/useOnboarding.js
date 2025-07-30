import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    setIsLoading(false);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('onboardingCompleted'));
  };

  return {
    isLoading,
    completeOnboarding
  };
}; 