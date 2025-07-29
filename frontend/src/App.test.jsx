import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the main application content', () => {
    render(<App />);
    // Check for common elements that should be present
    expect(document.querySelector('main')).toBeTruthy();
  });
}); 