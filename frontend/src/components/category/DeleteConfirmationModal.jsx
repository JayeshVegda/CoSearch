import React from 'react';
import {
  Modal,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  Group,
  Button,
  Stack,
  Title
} from '@mantine/core';
import { IconTrash, IconX } from '@tabler/icons-react';

function DeleteConfirmationModal({ opened, onClose, siteName, onConfirm }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        header: {
          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
          borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        },
        body: {
          padding: '24px',
        },
        title: {
          fontSize: '18px',
          fontWeight: 600,
          color: isDark ? theme.colors.gray[0] : theme.colors.dark[7],
        }
      }}
    >
      <Stack gap="lg">
        <Group gap="md" align="center">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isDark ? theme.colors.red[8] : theme.colors.red[1],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${isDark ? theme.colors.red[6] : theme.colors.red[3]}`,
          }}>
            <IconTrash size={24} color={isDark ? theme.colors.red[2] : theme.colors.red[6]} />
          </div>
          <div>
            <Title order={4} style={{ 
              margin: 0, 
              color: isDark ? theme.colors.gray[0] : theme.colors.dark[7],
              fontWeight: 600 
            }}>
              Delete Site
            </Title>
            <Text size="sm" c="dimmed" style={{ marginTop: '4px' }}>
              This action cannot be undone
            </Text>
          </div>
        </Group>

        <Text size="sm" style={{ 
          color: isDark ? theme.colors.gray[3] : theme.colors.gray[7],
          lineHeight: 1.5 
        }}>
          Are you sure you want to remove <strong style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[7] }}>{siteName}</strong> from this category?
        </Text>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="light"
            onClick={onClose}
            size="sm"
            style={{
              border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            }}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirm}
            size="sm"
            leftSection={<IconTrash size={14} />}
            style={{
              backgroundColor: isDark ? theme.colors.red[8] : theme.colors.red[6],
              '&:hover': {
                backgroundColor: isDark ? theme.colors.red[7] : theme.colors.red[7],
              }
            }}
          >
            Delete Site
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DeleteConfirmationModal; 