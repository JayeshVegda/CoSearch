import { Paper, Group, Button } from '@mantine/core';

export default function ActionPanel() {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="flex-end">
        <Button variant="default">Save</Button>
        <Button variant="filled" color="blue">Add</Button>
      </Group>
    </Paper>
  );
} 