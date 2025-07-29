// Utility functions for managing onboarding state

export const setOnboardingCompleted = () => {
  localStorage.setItem('onboardingCompleted', 'true');
  console.log('Onboarding marked as completed');
};

export const isOnboardingCompleted = () => {
  return localStorage.getItem('onboardingCompleted') === 'true';
};



// For development/testing purposes
export const debugOnboardingState = () => {
  const state = localStorage.getItem('onboardingCompleted');
  console.log('Current onboarding state:', {
    localStorageValue: state,
    isCompleted: state === 'true',
    type: typeof state
  });
  return state;
}; 