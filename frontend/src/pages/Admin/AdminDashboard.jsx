import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Group, 
  Button, 
  Stack, 
  Alert, 
  Badge, 
  Progress, 
  Card, 
  Grid, 
  Loader,
  TextInput,
  Modal,
  Box
} from '@mantine/core';
import { IconTrash, IconRefresh, IconPlayerPlay, IconPlayerPause, IconInfoCircle, IconLock, IconShield } from '@tabler/icons-react';
import axiosInstance from '../../lib/axios';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    try {
      const response = await axiosInstance.get('/admin/dashboard', {
        params: { password }
      });
      
      if (response.data.success) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setError(null);
        fetchData();
      }
    } catch (error) {
      setError('Invalid password. Please try again.');
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [statsResponse, statusResponse] = await Promise.all([
        axiosInstance.get('/admin/cleanup/stats', { params: { password } }),
        axiosInstance.get('/admin/cleanup/status', { params: { password } })
      ]);
      
      setStats(statsResponse.data.data);
      setStatus(statusResponse.data.data);
    } catch (error) {
      setError('Failed to fetch dashboard data. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  const triggerCleanup = async () => {
    try {
      await axiosInstance.post('/admin/cleanup/trigger', {}, { params: { password } });
      fetchData();
    } catch (error) {
      setError('Failed to trigger cleanup');
    }
  };

  const startService = async () => {
    try {
      await axiosInstance.post('/admin/cleanup/start', {}, { params: { password } });
      fetchData();
    } catch (error) {
      setError('Failed to start service');
    }
  };

  const stopService = async () => {
    try {
      await axiosInstance.post('/admin/cleanup/stop', {}, { params: { password } });
      fetchData();
    } catch (error) {
      setError('Failed to stop service');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Authentication Modal
  if (showAuthModal) {
    return (
      <Modal
        opened={showAuthModal}
        onClose={() => {}} // Prevent closing
        title="🔐 Admin Authentication"
        size="md"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack gap="lg">
          <Alert color="blue" title="Admin Access Required" icon={<IconShield size={16} />}>
            <Text size="sm">
              This dashboard is restricted to administrators only. Please enter the admin password to continue.
            </Text>
          </Alert>
          
          <TextInput
            label="Admin Password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            leftSection={<IconLock size={16} />}
          />
          
          {error && (
            <Alert color="red" title="Authentication Error">
              {error}
            </Alert>
          )}
          
          <Group justify="center">
            <Button 
              onClick={handleAuth}
              leftSection={<IconShield size={16} />}
              size="lg"
            >
              Access Dashboard
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  }

  if (loading && !stats) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader size="xl" />
      </Box>
    );
  }

  return (
    <Stack gap="lg" p="xl">
      <Paper p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>🧹 Admin Dashboard</Title>
          <Group>
            <Badge color="green" variant="light">
              Authenticated
            </Badge>
            <Button 
              leftSection={<IconRefresh size={16} />} 
              onClick={fetchData} 
              loading={loading} 
              variant="light"
            >
              Refresh
            </Button>
          </Group>
        </Group>

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        {stats && status && (
          <Grid>
            <Grid.Col span={6}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <IconTrash size={20} />
                  <Text fw={500}>Service Status</Text>
                </Group>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Status:</Text>
                    <Badge color={status.isRunning ? 'green' : 'red'}>
                      {status.isRunning ? 'Running' : 'Stopped'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Inactivity Days:</Text>
                    <Text fw={500}>{stats.inactivityDays}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Cleanup Interval:</Text>
                    <Text fw={500}>24 hours</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={6}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <IconInfoCircle size={20} />
                  <Text fw={500}>User Statistics</Text>
                </Group>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Total Users:</Text>
                    <Text fw={500}>{stats.totalUsers}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Active Users:</Text>
                    <Text fw={500} color="green">{stats.activeUsers}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Inactive Users:</Text>
                    <Text fw={500} color="orange">{stats.inactiveUsers}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={12}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <IconInfoCircle size={20} />
                  <Text fw={500}>Next Cleanup</Text>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">
                  Scheduled for: {new Date(stats.nextCleanup).toLocaleString()}
                </Text>
                <Progress 
                  value={100} 
                  color="blue" 
                  size="sm"
                  label="Next cleanup in progress"
                />
              </Card>
            </Grid.Col>
          </Grid>
        )}

        <Group justify="center" mt="lg">
          <Button
            leftSection={<IconPlayerPlay size={16} />}
            onClick={startService}
            color="green"
            variant="light"
          >
            Start Service
          </Button>
          <Button
            leftSection={<IconPlayerPause size={16} />}
            onClick={stopService}
            color="red"
            variant="light"
          >
            Stop Service
          </Button>
          <Button
            leftSection={<IconTrash size={16} />}
            onClick={triggerCleanup}
            color="orange"
            variant="light"
          >
            Trigger Cleanup
          </Button>
        </Group>

        <Alert color="blue" title="How it works" icon={<IconInfoCircle size={16} />} mt="lg">
          <Text size="sm">
            The cleanup service automatically deletes user data after 25 days of inactivity. 
            You can manually trigger cleanup or control the service status from this dashboard.
          </Text>
        </Alert>
      </Paper>
    </Stack>
  );
};

export default AdminDashboard; 