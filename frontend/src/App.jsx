import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Docs from './pages/Docs/Docs';
import ErrorBoundary from './components/common/ErrorBoundary';

// Get initial theme from localStorage or use system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    return theme;
  }
  
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return systemTheme;
};

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider 
        theme={theme}
        defaultColorScheme={getInitialTheme()}
      >
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;