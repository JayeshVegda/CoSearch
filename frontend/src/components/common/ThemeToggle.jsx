import { ActionIcon, useMantineColorScheme, useMantineTheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';

  const handleToggle = () => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    toggleColorScheme();
    // Save to localStorage
    localStorage.setItem('theme', newColorScheme);
  };

  return (
    <Tooltip label={`Switch to ${isDark ? 'light' : 'dark'} mode`} withArrow position="left">
      <ActionIcon
        variant="light"
        color={theme.primaryColor}
        onClick={handleToggle}
        title="Toggle color scheme"
        size="lg"
        radius="xl"
        aria-label="Toggle color scheme"
        style={{
          background: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
          border: 'none',
          transition: 'all 0.3s ease',
          outline: 'none',
          boxShadow: 'none',
          padding: 0,
          minWidth: 44,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            transform: 'scale(1.05)',
            background: isDark ? theme.colors.dark[4] : theme.colors.gray[0],
          }
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isDark ? 
          <IconSun size={20} color={theme.colors.yellow[4]} style={{ transition: 'transform 0.3s ease' }} /> : 
          <IconMoon size={20} color={theme.colors.blue[6]} style={{ transition: 'transform 0.3s ease' }} />
        }
      </ActionIcon>
    </Tooltip>
  );
} 