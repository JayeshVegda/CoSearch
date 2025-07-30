import { Switch, Group, Avatar, Text, Tooltip, ActionIcon, Table } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { getImageUrl } from '../../../utils/imageUtils';

function ServiceTableRow({ item, onEdit, onDelete }) {
  return (
    <Table.Tr>
      <Table.Td >
        <Tooltip label={item.isChecked ? `Disable ${item.siteName}` : `Enable ${item.siteName}`} withArrow>
          <Switch checked={item.isChecked} readOnly size="sm" />
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Avatar src={getImageUrl(item.icon?.url)} size="sm" />
          <Text>{item.siteName}</Text>
        </Group>
      </Table.Td>
      <Table.Td >
        <Group gap="xs" justify="center">
          <Tooltip label="Edit service" withArrow>
            <ActionIcon variant="subtle" color="gray" onClick={onEdit}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete service" withArrow>
            <ActionIcon variant="subtle" color="red" onClick={onDelete}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

export default ServiceTableRow;
 