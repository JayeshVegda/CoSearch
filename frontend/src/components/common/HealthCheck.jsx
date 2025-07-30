import React from 'react';
import { Box, Text, Code, Button, Group } from '@mantine/core';

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = React.useState({
    loading: true,
    error: null,
    data: null
  });

  const checkHealth = async () => {
    setHealthStatus({ loading: true, error: null, data: null });
    
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://cosearch-backend.onrender.com/api';
      const response = await fetch(`${apiUrl}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setHealthStatus({ loading: false, error: null, data });
      } else {
        setHealthStatus({ 
          loading: false, 
          error: `HTTP ${response.status}: ${response.statusText}`,
          data: null 
        });
      }
    } catch (error) {
      setHealthStatus({ 
        loading: false, 
        error: error.message,
        data: null 
      });
    }
  };

  React.useEffect(() => {
    checkHealth();
  }, []);

  return (
    <Box p="md" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Text size="xl" weight={700} mb="md">
        🔍 CoSearch Health Check
      </Text>
      
      <Group mb="md">
        <Button onClick={checkHealth} loading={healthStatus.loading}>
          Refresh Health Check
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/?debug=true'}
        >
          Enable Debug Mode
        </Button>
      </Group>

      <Box mb="md">
        <Text weight={600} mb="xs">Environment:</Text>
        <Code block>
          {JSON.stringify({
            mode: import.meta.env.MODE,
            isProduction: import.meta.env.PROD,
            apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://cosearch-backend.onrender.com/api',
            currentPath: window.location.pathname,
            userAgent: navigator.userAgent
          }, null, 2)}
        </Code>
      </Box>

      <Box mb="md">
        <Text weight={600} mb="xs">Backend Health Status:</Text>
        {healthStatus.loading && <Text color="blue">Checking...</Text>}
        {healthStatus.error && (
          <Code color="red" block>
            Error: {healthStatus.error}
          </Code>
        )}
        {healthStatus.data && (
          <Code color="green" block>
            {JSON.stringify(healthStatus.data, null, 2)}
          </Code>
        )}
      </Box>

      <Box>
        <Text weight={600} mb="xs">Troubleshooting Tips:</Text>
        <Text size="sm" color="dimmed">
          1. Check if VITE_API_BASE_URL is set in Vercel environment variables<br/>
          2. Verify your Render backend is running<br/>
          3. Check browser console for detailed error messages<br/>
          4. Try accessing the health endpoint directly: {import.meta.env.VITE_API_BASE_URL || 'https://cosearch-backend.onrender.com/api'}/health
        </Text>
      </Box>
    </Box>
  );
};

export default HealthCheck; 