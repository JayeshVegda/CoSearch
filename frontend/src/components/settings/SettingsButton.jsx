import { ActionIcon, useMantineTheme, useMantineColorScheme, Group, Tooltip } from '@mantine/core';
import { IconSettings, IconSun, IconMoon } from '@tabler/icons-react';
import SettingsModal from './SettingsModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDisclosure } from '@mantine/hooks';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';
import axiosInstance from '../../lib/axios';
import { useEffect } from 'react';

function fetchCategoryList(userId) {
  return axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories`).then(res => res.data);
}

function SettingsButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const userid = getOrCreateUserId();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categoryList', userid],
    queryFn: () => fetchCategoryList(userid),
    enabled: false, // Only fetch when modal is opened
  });

  const handleOpen = () => {
    // Invalidate category queries to ensure fresh data
    queryClient.invalidateQueries(['categories', userid]);
    refetch(); // Always refetch on every click
    open();
  };

  // Listen for settings changes to refresh data
  useEffect(() => {
    const handleSettingsChange = (event) => {
      // If it's a data reset or import, refresh the category data
      if (event.detail.type === 'dataReset' || event.detail.type === 'dataImported') {
        queryClient.invalidateQueries(['categoryList', userid]);
        queryClient.invalidateQueries(['categories', userid]);
        refetch();
      }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [queryClient, userid, refetch]);

  return (
    <>
      <Tooltip label="Settings & Customize" withArrow position="left">
        <ActionIcon
          onClick={handleOpen}
          size="xl"
          radius="xl"
          variant="light"
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2000,
            background: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
            color: isDark ? theme.colors.blue[3] : theme.colors.blue[7],
            boxShadow: isDark
              ? '0 2px 8px 0 rgba(59, 130, 246, 0.18)'
              : '0 2px 8px 0 rgba(59, 130, 246, 0.10)',
            border: 'none',
            outline: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: isDark
                ? '0 4px 16px 0 rgba(59, 130, 246, 0.25)'
                : '0 4px 16px 0 rgba(59, 130, 246, 0.15)',
            }
          }}
          aria-label="Open settings"
        >
          <IconSettings size={28} />
        </ActionIcon>
      </Tooltip>
      <SettingsModal
        opened={opened}
        onClose={close}
        isLoading={isLoading}
        error={error}
        categoryList={data?.categories || []}
        refetchCategories={refetch}
        extraHeaderContent={
          <Group ml="auto">
            <Tooltip label={`Switch to ${isDark ? 'light' : 'dark'} mode`} withArrow>
              <ActionIcon
                variant="light"
                color={theme.primaryColor}
                onClick={toggleColorScheme}
                size="lg"
                radius="xl"
                aria-label="Toggle color scheme"
                style={{
                  background: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                  color: isDark ? theme.colors.yellow[4] : theme.colors.blue[6],
                  border: 'none',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s',
                }}
              >
                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        }
      />
    </>
  );
}

export default SettingsButton;
 