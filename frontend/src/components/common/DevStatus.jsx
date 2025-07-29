import { Badge, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconCode, IconCheck, IconShield } from '@tabler/icons-react';

function DevStatus() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Group position="top-right" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      <Badge 
        leftSection={<IconCode size={12} />}
        color="green"
        variant="filled"
        size="sm"
      >
        DEV MODE
      </Badge>
      <Badge 
        leftSection={<IconCheck size={12} />}
        color="blue"
        variant="filled"
        size="sm"
      >
        READY
      </Badge>
      <Tooltip label="Admin Dashboard">
        <ActionIcon
          variant="light"
          color="blue"
          size="sm"
          onClick={() => window.open('/admin/dashboard', '_blank')}
        >
          <IconShield size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default DevStatus; 