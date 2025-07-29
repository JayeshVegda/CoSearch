import React from 'react';
import { Badge, Group, Text } from '@mantine/core';

const DevStatus = () => {
  const isDev = import.meta.env.DEV;
  
  if (!isDev) return null;

  return (
    <Group gap="xs" style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 1000 }}>
      <Badge color="orange" variant="filled" size="sm">
        DEV MODE
      </Badge>
      <Text size="xs" c="dimmed">
        {import.meta.env.VITE_APP_VERSION || '1.0.0'}
      </Text>
    </Group>
  );
};

export default DevStatus; 