import { 
  Modal, 
  TextInput, 
  Button, 
  Group, 
  Stack, 
  Avatar, 
  Text, 
  rem, 
  Alert, 
  Code, 
  Box,
  Badge,
  useMantineTheme,
  useMantineColorScheme,
  Tooltip,
  ActionIcon
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useState, useEffect } from 'react';
import { 
  IconUpload, 
  IconPhoto, 
  IconTrash, 
  IconCheck, 
  IconX, 
  IconInfoCircle,
  IconWorld,
  IconSearch,
  IconExternalLink,
  IconQuestionMark
} from '@tabler/icons-react';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function hasQueryPlaceholder(url) {
  return url.includes('{q}');
}

export default function EditUrlModal({ opened, onClose, urlData, onSave, onDelete }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [name, setName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState({ name: '', siteUrl: '' });
  const [urlStatus, setUrlStatus] = useState(''); // 'valid', 'invalid', ''
  const [samplePreview, setSamplePreview] = useState('');

  // Initialize form data when urlData changes
  useEffect(() => {
    if (urlData) {
      setName(urlData.siteName || '');
      setSiteUrl(urlData.siteUrl || '');
      setIconPreview(urlData.icon?.url || null);
      setIconFile(null);
      setError({ name: '', siteUrl: '' });
      setShowDeleteConfirm(false);
      
      // Set initial validation and preview
      const isValid = isValidUrl(urlData.siteUrl || '');
      const hasPlaceholder = hasQueryPlaceholder(urlData.siteUrl || '');
      setUrlStatus(isValid && hasPlaceholder ? 'valid' : '');
      
      if (isValid && hasPlaceholder) {
        setSamplePreview((urlData.siteUrl || '').replace('{q}', 'sample search'));
      } else {
        setSamplePreview('');
      }
    }
  }, [urlData]);

  const handleUrlChange = (value) => {
    setSiteUrl(value);
    
    if (!value.trim()) {
      setUrlStatus('');
      setSamplePreview('');
    } else if (isValidUrl(value) && hasQueryPlaceholder(value)) {
      setUrlStatus('valid');
      setSamplePreview(value.replace('{q}', 'sample search'));
    } else {
      setUrlStatus('invalid');
      setSamplePreview('');
    }
  };

  const handleDrop = (files) => {
    const file = files[0];
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleTestUrl = () => {
    if (samplePreview) {
      window.open(samplePreview, '_blank');
    }
  };

  const handleSave = () => {
    let valid = true;
    let err = { name: '', siteUrl: '' };
    
    if (!name.trim()) {
      err.name = 'Name is required';
      valid = false;
    } else if (name.length > 20) {
      err.name = 'Name must be 20 characters or less';
      valid = false;
    }
    
    if (!siteUrl.trim()) {
      err.siteUrl = 'URL is required';
      valid = false;
    } else if (!isValidUrl(siteUrl)) {
      err.siteUrl = 'Please enter a valid URL';
      valid = false;
    } else if (!hasQueryPlaceholder(siteUrl)) {
      err.siteUrl = 'URL must include {q} placeholder';
      valid = false;
    }
    
    setError(err);
    if (!valid) return;
    
    // Handle icon - use existing icon if no new file, or default if upload fails
    let icon = urlData?.icon;
    if (iconFile) {
      // If new file is selected, try to upload it
      try {
        // For now, use the preview URL as the icon
        // In a real implementation, you'd upload to Cloudinary here
        icon = { url: iconPreview };
      } catch (uploadErr) {
        icon = { 
          public_id: 'default-icon', 
          url: '/temp/search.png' 
        };
      }
    } else if (!urlData?.icon || !urlData?.icon?.url) {
      // Use default icon if no existing icon
      icon = { 
        public_id: 'default-icon', 
        url: '/temp/search.png' 
      };
    }
    
    onSave && onSave({
      ...urlData,
      siteName: name,
      siteUrl,
      icon,
    });
    onClose && onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete && onDelete(urlData);
    setShowDeleteConfirm(false);
    onClose && onClose();
  };

  const isFormValid = name.trim() && siteUrl.trim() && 
    isValidUrl(siteUrl) && hasQueryPlaceholder(siteUrl);

  // Don't render if no urlData
  if (!urlData) {
    return null;
  }

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={onClose} 
        title="Edit Search Engine"
        centered 
        size="sm"
        padding="md"
      >
        <Stack gap="md">
          {/* Icon Upload - Simplified Button */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Icon</Text>
            {iconPreview ? (
              <Group gap="sm">
                <Avatar src={iconPreview} size={32} radius="sm" />
                <Text size="xs">Icon added</Text>
                <Button 
                  variant="light" 
                  size="xs" 
                  color="red"
                  onClick={() => {
                    setIconFile(null);
                    setIconPreview(null);
                  }}
                >
                  Remove
                </Button>
              </Group>
            ) : (
              <Button 
                variant="light" 
                leftSection={<IconUpload size={16} />}
                size="sm"
                onClick={() => document.getElementById('icon-upload').click()}
                style={{ width: 'fit-content' }}
              >
                Add icon
              </Button>
            )}
            <input
              id="icon-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleDrop([e.target.files[0]]);
                }
              }}
            />
          </Box>

          {/* Form Fields */}
          <Stack gap="sm">
            <Box>
              <Text size="sm" fw={500} mb="xs">Name</Text>
              <TextInput
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                error={error.name}
                placeholder="e.g., Google, Bing"
                size="sm"
              />
            </Box>
            <Box>
              <Group justify="space-between" align="center" mb="xs">
                <Text size="sm" fw={500}>URL</Text>
                <Tooltip label="Use {q} as placeholder for search query. Example: https://google.com/search?q={q}">
                  <ActionIcon size="xs" variant="light">
                    <IconQuestionMark size={12} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <TextInput
                value={siteUrl}
                onChange={(e) => handleUrlChange(e.currentTarget.value)}
                error={error.siteUrl}
                placeholder="https://example.com/search?q={q}"
                size="sm"
                rightSection={
                  urlStatus === 'valid' ? (
                    <IconCheck size={14} color={theme.colors.green[6]} />
                  ) : urlStatus === 'invalid' ? (
                    <IconX size={14} color={theme.colors.red[6]} />
                  ) : null
                }
              />
            </Box>
          </Stack>

          {/* URL Preview */}
          {samplePreview && (
            <Box p="xs" style={{
              backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
              borderRadius: theme.radius.sm,
              border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`
            }}>
              <Group justify="space-between" align="center">
                <Text size="xs" style={{ 
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {samplePreview}
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconExternalLink size={12} />}
                  onClick={handleTestUrl}
                  color="blue"
                >
                  Test
                </Button>
              </Group>
            </Box>
          )}

          {/* Action Buttons */}
          <Group justify="space-between" gap="sm" pt="sm">
            <Button 
              variant="light" 
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={handleDelete}
              size="sm"
            >
              Delete
            </Button>
            <Group gap="sm">
              <Button 
                variant="light" 
                onClick={onClose}
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                color="blue" 
                onClick={handleSave}
                disabled={!isFormValid}
                size="sm"
              >
                Save
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal 
        opened={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        title="Confirm Delete"
        centered 
        size="sm"
        padding="lg"
      >
        <Stack gap="md" align="center">
          <Text c="dimmed" ta="center" size="sm">
            Are you sure you want to delete <strong>"{name}"</strong>?
          </Text>
          <Group gap="sm">
            <Button 
              color="red" 
              onClick={confirmDelete} 
              size="sm"
            >
              Delete
            </Button>
            <Button 
              variant="light" 
              onClick={() => setShowDeleteConfirm(false)} 
              size="sm"
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 