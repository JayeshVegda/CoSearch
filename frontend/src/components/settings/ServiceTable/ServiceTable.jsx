import { Paper } from '@mantine/core';

function ServiceTable({ children, paperProps }) {
  return (
    <Paper withBorder radius={0} shadow="sm" p="md">
      {children}
    </Paper>
  );
}

export default ServiceTable; 