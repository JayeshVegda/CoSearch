/**
 * Components Index
 * Centralized exports for all application components organized by functionality
 */

// Core UI Components
export { default as Button, SearchButton, PrimaryButton, SecondaryButton } from './core/ui/Button';
export { default as Input, SearchInput, EmailInput, PasswordInput } from './core/ui/Input';
export { default as Modal, ConfirmationModal, LoadingModal } from './core/ui/Modal';

// Core Layout Components
export { default as AppLayout, Container, Section } from './core/layout/AppLayout';

// Core Form Components
export { default as FormField, FormSection, FormActions } from './core/forms/FormField';

// Search Feature Components
export { default as SearchBar, CompactSearchBar, FullWidthSearchBar } from './features/search/SearchBar';
export { default as SearchResults, CompactSearchResults, FullWidthSearchResults } from './features/search/SearchResults';

// Category Feature Components
export { default as CategorySelector, CompactCategorySelector, LargeCategorySelector } from './features/categories/CategorySelector';

// Settings Feature Components
export { default as SettingsPanel, CompactSettingsPanel, FullScreenSettingsPanel } from './features/settings/SettingsPanel';

// Legacy Components (for backward compatibility)
// These will be gradually replaced with the new organized structure
export { default as ErrorBoundary } from './common/ErrorBoundary';
export { default as LoaderComponent } from './common/Loader';
export { default as ThemeToggle } from './common/ThemeToggle';

// Export component categories for easy imports
export const CoreComponents = {
  Button: () => import('./core/ui/Button'),
  Input: () => import('./core/ui/Input'),
  Modal: () => import('./core/ui/Modal'),
  AppLayout: () => import('./core/layout/AppLayout'),
  FormField: () => import('./core/forms/FormField')
};

export const FeatureComponents = {
  SearchBar: () => import('./features/search/SearchBar'),
  SearchResults: () => import('./features/search/SearchResults'),
  CategorySelector: () => import('./features/categories/CategorySelector'),
  SettingsPanel: () => import('./features/settings/SettingsPanel')
};

export const LegacyComponents = {
  ErrorBoundary: () => import('./common/ErrorBoundary'),
  Loader: () => import('./common/Loader'),
  ThemeToggle: () => import('./common/ThemeToggle')
}; 