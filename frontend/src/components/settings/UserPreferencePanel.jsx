import { 
  Paper, 
  Title, 
  Switch, 
  Group, 
  Text, 
  Stack, 
  Button, 
  Divider,
  Alert,
  Modal,
  Textarea,
  FileInput,
  useMantineTheme,
  useMantineColorScheme,
  Badge,
  Box,
  ActionIcon
} from '@mantine/core';
import { 
  IconMoon, 
  IconSun, 
  IconDownload, 
  IconUpload, 
  IconRefresh, 
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconBook,
  IconArrowLeft
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';
import axiosInstance from '../../lib/axios';

export default function UserPreferencePanel({ onClose }) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const userId = getOrCreateUserId();

  // Export user data
  const handleExportData = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Get user categories
      const categoriesResponse = await axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories`);
      const categories = categoriesResponse.data.categories || [];
      
      // Get URLs for each category
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        categories: []
      };

      for (const category of categories) {
        try {
          const urlsResponse = await axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(category)}/urls`);
          exportData.categories.push({
            name: category,
            urls: urlsResponse.data.urls || []
          });
        } catch (error) {
          }
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cosearch-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully as JSON file!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Import user data
  const handleImportData = async (file) => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a JSON file to import.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error('Invalid data format');
      }

      // Import categories and URLs
      for (const category of data.categories) {
        if (category.name && category.urls) {
          // Create category if it doesn't exist
          try {
            await axiosInstance.post(`/setting/users/${encodeURIComponent(userId)}/categories`, {
              categoryName: category.name
            });
          } catch (error) {
            // Category might already exist, continue
          }

          // Add URLs to category
          for (const url of category.urls) {
            try {
              await axiosInstance.post(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(category.name)}/urls`, {
                url: url.url || url,
                title: url.title || url,
                icon: url.icon || ''
              });
            } catch (error) {
              }
          }
        }
      }

      setMessage({ type: 'success', text: 'Data imported successfully from JSON file!' });
      setImportModalOpen(false);
      
      // Trigger settings change event to refresh other components
      const settingsChangeEvent = new CustomEvent('settingsChanged', {
        detail: { type: 'dataImported', timestamp: Date.now() }
      });
      window.dispatchEvent(settingsChangeEvent);
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON file format or import failed. Please check your file.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default data
  const handleResetToDefault = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Call backend to reset user data to default
      await axiosInstance.post(`/setting/users/${encodeURIComponent(userId)}/reset-to-default`);
      
      setMessage({ type: 'success', text: 'Data reset to default successfully!' });
      setResetModalOpen(false);
      
      // Trigger settings change event to refresh other components
      const settingsChangeEvent = new CustomEvent('settingsChanged', {
        detail: { type: 'dataReset', timestamp: Date.now() }
      });
      window.dispatchEvent(settingsChangeEvent);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Paper p="xl" radius="md" withBorder style={{ backgroundColor: 'transparent' }}>
        {/* Header */}
        <Group justify="space-between" mb="lg">
          <Title order={3}>User Preferences</Title>
          {onClose && (
            <Button variant="subtle" size="sm" onClick={onClose} leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          )}
        </Group>

        <Stack gap="lg">
          {/* Theme Section */}
          <Stack gap="sm">
            <Text fw={600} size="sm" c="dimmed" tt="uppercase">Appearance</Text>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Text fw={500}>Theme</Text>
                <Text c="dimmed" size="sm">Current: {isDark ? 'Dark' : 'Light'}</Text>
              </Stack>
              <Switch
                checked={isDark}
                onChange={toggleColorScheme}
                size="md"
                color="blue"
                onLabel={<IconMoon size={16} />}
                offLabel={<IconSun size={16} />}
              />
            </Group>
          </Stack>

          <Divider />

          {/* Data Management Section */}
          <Stack gap="sm">
            <Text fw={600} size="sm" c="dimmed" tt="uppercase">Data Management</Text>
            
            <Button
              variant="light"
              color="blue"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportData}
              loading={isLoading}
              fullWidth
            >
              Export Data
            </Button>

            <Button
              variant="light"
              color="gray"
              leftSection={<IconUpload size={16} />}
              onClick={() => setImportModalOpen(true)}
              fullWidth
            >
              Import Data
            </Button>

            <Button
              variant="light"
              color="orange"
              leftSection={<IconRefresh size={16} />}
              onClick={() => setResetModalOpen(true)}
              fullWidth
            >
              Reset to Default
            </Button>
          </Stack>

          <Divider />

          {/* Documentation Section */}
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text fw={600} size="sm" c="dimmed" tt="uppercase">Help & Support</Text>
              <Badge size="xs" variant="light" color="blue">New</Badge>
            </Group>
            
            <Button
              variant="light"
              color="blue"
              leftSection={<IconBook size={16} />}
              onClick={() => navigate('/docs')}
              fullWidth
            >
              View Documentation
            </Button>
          </Stack>

          {/* Message Display */}
          {message.text && (
            <Alert
              icon={message.type === 'success' ? <IconCheck size={16} /> : <IconX size={16} />}
              color={message.type === 'success' ? 'green' : 'red'}
              variant="light"
            >
              {message.text}
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Import Modal */}
      <Modal
        opened={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Data"
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Select a JSON file to import your categories and URLs:
          </Text>
          <FileInput
            accept=".json"
            placeholder="Choose JSON file"
            label="Data File"
            description="Select the exported JSON file from CoSearch"
            onChange={handleImportData}
            leftSection={<IconUpload size={16} />}
          />
          <Alert icon={<IconAlertTriangle size={16} />} color="yellow" variant="light">
            <Text size="sm">
              Warning: This will overwrite your current data. Make sure to export your current data first if needed.
            </Text>
          </Alert>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Reset Modal */}
      <Modal
        opened={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset to Default Data"
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light">
            <Text size="sm" fw={500}>This action cannot be undone!</Text>
            <Text size="sm">
              This will delete all your current categories and URLs and restore the default data.
              Make sure to export your current data first if you want to keep it.
            </Text>
          </Alert>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              color="red"
              onClick={handleResetToDefault}
              loading={isLoading}
            >
              Reset to Default
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 