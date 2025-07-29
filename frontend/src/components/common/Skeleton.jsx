import { Skeleton, Stack, Group, useMantineTheme, useMantineColorScheme } from '@mantine/core';

// Skeleton for search bar
export function SearchBarSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Group gap="md" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Skeleton 
        height={48} 
        radius="lg" 
        style={{ flex: 1 }}
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
      <Skeleton 
        height={48} 
        width={120} 
        radius="lg"
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
      <Skeleton 
        height={48} 
        width={100} 
        radius="lg"
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
    </Group>
  );
}

// Skeleton for category box
export function CategoryBoxSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Skeleton 
      height={48} 
      width={200} 
      radius="lg"
      color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
    />
  );
}

// Skeleton for site tiles
export function SiteTilesSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      justifyContent: 'center',
      padding: '8px',
      minHeight: '80px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          height={24}
          width={Math.random() * 30 + 60}
          radius="xl"
          color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
        />
      ))}
    </div>
  );
}

// Skeleton for settings modal
export function SettingsModalSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap="lg">
      <Skeleton 
        height={24} 
        width="60%" 
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
      <Skeleton 
        height={200} 
        radius="md"
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
      <Group gap="md">
        <Skeleton 
          height={36} 
          width={100} 
          radius="md"
          color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
        />
        <Skeleton 
          height={36} 
          width={80} 
          radius="md"
          color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
        />
      </Group>
    </Stack>
  );
}

// Skeleton for URL list
export function UrlListSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap="md">
      {Array.from({ length: 5 }).map((_, index) => (
        <Group key={index} gap="md" style={{ width: '100%' }}>
          <Skeleton 
            height={40} 
            width={40} 
            radius="md"
            color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
          />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton 
              height={16} 
              width="70%" 
              color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
            />
            <Skeleton 
              height={12} 
              width="50%" 
              color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
            />
          </Stack>
          <Skeleton 
            height={32} 
            width={60} 
            radius="md"
            color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
          />
        </Group>
      ))}
    </Stack>
  );
}

// Skeleton for sidebar
export function SidebarSkeleton() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap="md" p="md">
      <Skeleton 
        height={40} 
        width="80%" 
        radius="md"
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          height={32}
          width="90%"
          radius="md"
          color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
        />
      ))}
    </Stack>
  );
}

// Generic skeleton with custom dimensions
export function CustomSkeleton({ height, width, radius = "md", count = 1, gap = "md" }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (count === 1) {
    return (
      <Skeleton
        height={height}
        width={width}
        radius={radius}
        color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
      />
    );
  }

  return (
    <Stack gap={gap}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={width}
          radius={radius}
          color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
        />
      ))}
    </Stack>
  );
} 