import { Table, Text, Center } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

function EmptyState() {
  return (
    <Table.Tr>
      <Table.Td colSpan={3}>
        <Center >
          <IconInbox size={48} stroke={1.5} />
          <Text size="lg" ml="md">
            No services added yet.
          </Text>
        </Center>
      </Table.Td>
    </Table.Tr>
  );
}

export default EmptyState;
 