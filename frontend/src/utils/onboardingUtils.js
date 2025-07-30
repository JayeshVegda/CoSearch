// Utility functions for managing onboarding state

export const setOnboardingCompleted = () => {
  localStorage.setItem('onboardingCompleted', 'true');
  };

export const isOnboardingCompleted = () => {
  return localStorage.getItem('onboardingCompleted') === 'true';
};



// For development/testing purposes
export const debugOnboardingState = () => {
  const state = localStorage.getItem('onboardingCompleted');
  return state;
}; 