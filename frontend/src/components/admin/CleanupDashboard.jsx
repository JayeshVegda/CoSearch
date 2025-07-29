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
  Loader
} from '@mantine/core';
import { IconTrash, IconRefresh, IconPlay, IconStop, IconInfoCircle } from '@tabler/icons-react';
import axiosInstance from '../../lib/axios';

const CleanupDashboard = () => {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, statusRes] = await Promise.all([
        axiosInstance.get('/cleanup/stats'),
        axiosInstance.get('/cleanup/status')
      ]);
      
      setStats(statsRes.data.data);
      setStatus(statusRes.data.data);
    } catch (err) {
      setError('Failed to fetch cleanup data');
      console.error('Error fetching cleanup data:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerCleanup = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/cleanup/trigger');
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to trigger cleanup');
      console.error('Error triggering cleanup:', err);
    } finally {
      setLoading(false);
    }
  };

  const startService = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/cleanup/start');
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to start cleanup service');
      console.error('Error starting cleanup service:', err);
    } finally {
      setLoading(false);
    }
  };

  const stopService = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/cleanup/stop');
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to stop cleanup service');
      console.error('Error stopping cleanup service:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !stats) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Group justify="center">
          <Loader size="lg" />
          <Text>Loading cleanup data...</Text>
        </Group>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      <Paper p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>🧹 Cleanup Service Dashboard</Title>
          <Button 
            leftSection={<IconRefresh size={16} />}
            onClick={fetchData}
            loading={loading}
            variant="light"
          >
            Refresh
          </Button>
        </Group>

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        {stats && status && (
          <Grid>
            {/* Service Status */}
            <Grid.Col span={6}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <IconInfo size={20} />
                  <Text fw={500}>Service Status</Text>
                </Group>
                <Badge 
                  color={status.isRunning ? 'green' : 'red'}
                  size="lg"
                  mb="xs"
                >
                  {status.isRunning ? 'Running' : 'Stopped'}
                </Badge>
                <Text size="sm" c="dimmed">
                  Inactivity Period: {status.inactivityDays} days
                </Text>
                <Text size="sm" c="dimmed">
                  Cleanup Interval: 24 hours
                </Text>
              </Card>
            </Grid.Col>

            {/* User Statistics */}
            <Grid.Col span={6}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <IconTrash size={20} />
                  <Text fw={500}>User Statistics</Text>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {stats.totalUsers}
                </Text>
                <Text size="sm" c="dimmed" mb="xs">Total Users</Text>
                
                <Group gap="xs" mb="xs">
                  <Badge color="green" size="sm">
                    {stats.activeUsers} Active
                  </Badge>
                  <Badge color="red" size="sm">
                    {stats.inactiveUsers} Inactive
                  </Badge>
                </Group>

                {stats.totalUsers > 0 && (
                  <Progress 
                    value={(stats.activeUsers / stats.totalUsers) * 100} 
                    color="green" 
                    size="sm"
                    mb="xs"
                  />
                )}
              </Card>
            </Grid.Col>

            {/* Next Cleanup */}
            <Grid.Col span={12}>
              <Card withBorder p="md">
                <Text fw={500} mb="xs">Next Scheduled Cleanup</Text>
                <Text size="lg" fw={600} c="blue">
                  {new Date(stats.nextCleanup).toLocaleString()}
                </Text>
                <Text size="sm" c="dimmed">
                  {Math.round((new Date(stats.nextCleanup) - new Date()) / (1000 * 60 * 60))} hours from now
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        )}

        {/* Action Buttons */}
        <Group justify="center" mt="lg">
          <Button
            leftSection={<IconTrash size={16} />}
            onClick={triggerCleanup}
            loading={loading}
            color="red"
            variant="outline"
          >
            Trigger Manual Cleanup
          </Button>
          
          {status?.isRunning ? (
            <Button
              leftSection={<IconStop size={16} />}
              onClick={stopService}
              loading={loading}
              color="orange"
              variant="outline"
            >
              Stop Service
            </Button>
          ) : (
            <Button
              leftSection={<IconPlay size={16} />}
              onClick={startService}
              loading={loading}
              color="green"
              variant="outline"
            >
              Start Service
            </Button>
          )}
        </Group>

        {/* Information Alert */}
                       <Alert color="blue" title="How it works" icon={<IconInfoCircle size={16} />}>
          <Text size="sm">
            The cleanup service automatically deletes user data after 25 days of inactivity. 
            It runs every 24 hours and tracks user activity on every API request. 
            This helps manage database storage and keep the system clean.
          </Text>
        </Alert>
      </Paper>
    </Stack>
  );
};

export default CleanupDashboard; 