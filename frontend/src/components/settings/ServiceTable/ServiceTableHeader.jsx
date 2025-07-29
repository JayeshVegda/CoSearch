import { Table, Text } from '@mantine/core';

function ServiceTableHeader() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th style={{ textAlign: 'center' }}>
          <Text fw={600}>Enabled</Text>
        </Table.Th>
        <Table.Th>
          <Text fw={600}>Service</Text>
        </Table.Th>
        <Table.Th style={{ textAlign: 'center' }}>
          <Text fw={600}>Actions</Text>
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}

export default ServiceTableHeader;
 