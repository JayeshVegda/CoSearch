import { useMantineTheme, useMantineColorScheme, Paper, Group, Text, Badge } from '@mantine/core';

function CategoryDisplay({ selectedCategory, onClear }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (!selectedCategory) {
    return null;
  }

  return (
    <Paper
      p="md"
      radius="lg"
      shadow="sm"
      style={{
        backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
        border: `1px solid ${theme.colors.border}`,
        minWidth: '300px',
        maxWidth: '500px'
      }}
    >
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Text 
            size="sm" 
            c={theme.colors.textSecondary}
            fw={500}
          >
            Selected Category:
          </Text>
          <Badge
            variant="filled"
            color="blue"
            size="lg"
            radius="md"
            styles={{
              root: {
                backgroundColor: theme.colors.primary,
                color: theme.white,
                fontWeight: 600
              }
            }}
          >
            {selectedCategory}
          </Badge>
        </Group>
        
        {onClear && (
          <Text
            size="sm"
            c={theme.colors.primary}
            style={{ cursor: 'pointer' }}
            onClick={onClear}
            fw={500}
          >
            Clear
          </Text>
        )}
      </Group>
    </Paper>
  );
}

export default CategoryDisplay; 