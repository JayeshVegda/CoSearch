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
import { useState } from 'react';
import { 
  IconPhoto, 
  IconCheck, 
  IconInfoCircle, 
  IconX, 
  IconUpload, 
  IconWorld,
  IconSearch,
  IconExternalLink,
  IconQuestionMark
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import axiosInstance from '../../lib/axios';

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

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('icon', file);
  const res = await axiosInstance.post('/setting/icons/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (res.status !== 200) throw new Error('Failed to upload icon');
  return res.data;
}

export default function AddUrlModal({ opened, onClose, onAdd }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlStatus, setUrlStatus] = useState(''); // 'valid', 'invalid', ''
  const [samplePreview, setSamplePreview] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      siteUrl: '',
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.length > 20) return 'Name must be 20 characters or less';
        return null;
      },
      siteUrl: (value) => {
        if (!value.trim()) return 'URL is required';
        if (!isValidUrl(value)) return 'Please enter a valid URL';
        if (!hasQueryPlaceholder(value)) return 'URL must include {q} placeholder';
        return null;
      },
    },
  });

  // Update URL status and preview when URL changes
  const handleUrlChange = (value) => {
    form.setFieldValue('siteUrl', value);
    
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

  const handleAdd = async (values) => {
    setUploading(true);
    setUploadError('');
    let icon = { public_id: '', url: '' };
    try {
      if (iconFile) {
        try {
          icon = await uploadToCloudinary(iconFile);
        } catch (uploadErr) {
          icon = { public_id: 'default-icon', url: '/temp/search.png' };
        }
      } else {
        icon = { public_id: 'default-icon', url: '/temp/search.png' };
      }
      onAdd && onAdd({
        siteName: values.name,
        siteUrl: values.siteUrl,
        icon,
      });
      form.reset();
      setIconFile(null);
      setIconPreview(null);
      setUrlStatus('');
      setSamplePreview('');
      onClose && onClose();
    } catch (err) {
      setUploadError('Failed to add URL: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setIconFile(null);
    setIconPreview(null);
    setUploadError('');
    setUploading(false);
    setUrlStatus('');
    setSamplePreview('');
    onClose && onClose();
  };

  const isFormValid = form.values.name.trim() && form.values.siteUrl.trim() && 
    isValidUrl(form.values.siteUrl) && hasQueryPlaceholder(form.values.siteUrl);

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title="Add Search Engine"
      centered 
      size="sm"
      padding="md"
    >
      <form onSubmit={form.onSubmit(handleAdd)}>
        <Stack gap="md">
          {/* Icon Upload - Simplified Button */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Icon (Optional)</Text>
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
                {...form.getInputProps('name')}
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
                {...form.getInputProps('siteUrl')}
                placeholder="https://example.com/search?q={q}"
                onChange={(e) => handleUrlChange(e.currentTarget.value)}
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

          {/* Error Display */}
          {uploadError && (
            <Alert color="red" variant="light" size="sm">
              {uploadError}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="sm">
            <Button 
              variant="light" 
              onClick={handleClose}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              color="blue" 
              type="submit" 
              loading={uploading} 
              disabled={!isFormValid || uploading}
              size="sm"
            >
              Add
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 