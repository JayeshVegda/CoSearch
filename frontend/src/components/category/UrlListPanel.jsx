import React, { useState, useEffect } from 'react';
import { Paper, Title, ScrollArea, Checkbox, Group, Avatar, Center, Text, SimpleGrid, Tooltip, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconPlus, IconWorld, IconEdit } from '@tabler/icons-react';
import EditUrlModal from '../url/EditUrlModal';
import AddUrlModal from '../url/AddUrlModal';
import { useQueryClient } from '@tanstack/react-query';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';
import axiosInstance from '../../lib/axios';
import { getImageUrl } from '../../utils/imageUtils';

async function uploadIconMock(file) {
  // Simulate upload delay
  await new Promise((res) => setTimeout(res, 500));
  return {
    iconUrl: URL.createObjectURL(file),
    iconFilename: file.name,
  };
}

// --- Single/Double Click Logic ---
const clickTimerRef = React.createRef();

export default function UrlListPanel({ selectedCategory, refetchCategories, isLoading, onEditCategory }) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // State for tracking click timing
  const [lastClickedItem, setLastClickedItem] = useState(null);

  // Remove fallback test data
  // const testCategory = {
  //   categoryName: 'Test',
  //   url: [
  //     { siteName: 'Google', siteUrl: 'https://google.com', isChecked: true },
  //     { siteName: 'Bing', siteUrl: 'https://bing.com', isChecked: false }
  //   ]
  // };
  const displayCategory = selectedCategory;
  const displayUrls = (selectedCategory && Array.isArray(selectedCategory.url)) ? selectedCategory.url : [];

  // Debug logging - moved after displayUrls is defined
  // Calculate counts for dynamic title
  const totalUrls = displayUrls.length;
  const enabledUrls = displayUrls.filter(url => url.isChecked).length;

  // Single click handler
  const handleTileSingleClick = (e, item, idx) => {
    if (e.target.closest('[data-checkbox]')) return;
    const itemKey = `${item.siteName}-${idx}`;
    if (!clickTimerRef.current) clickTimerRef.current = {};
    clickTimerRef.current[itemKey] = setTimeout(() => {
      handleCheckboxToggle(e, idx);
      clickTimerRef.current[itemKey] = null;
    }, 250);
  };

  // Double click handler
  const handleTileDoubleClick = (e, item, idx) => {
    if (e.target.closest('[data-checkbox]')) return;
    const itemKey = `${item.siteName}-${idx}`;
    if (clickTimerRef.current && clickTimerRef.current[itemKey]) {
      clearTimeout(clickTimerRef.current[itemKey]);
      clickTimerRef.current[itemKey] = null;
    }
    setEditingUrl(item);
    setModalOpen(true);
  };

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        Object.values(clickTimerRef.current).forEach(timer => {
          if (timer) clearTimeout(timer);
        });
      }
    };
  }, []);

  const handleSave = async (updated) => {
    const userId = getOrCreateUserId();
    const categoryName = selectedCategory?.categoryName;
    const originalSiteName = editingUrl?.siteName;
    
    if (!userId || !categoryName || !originalSiteName) {
      alert('Missing required info for save');
      return;
    }
    
    try {
      const payload = {};
      if (updated.siteName && updated.siteName !== originalSiteName) {
        payload.newSiteName = updated.siteName;
      }
      if (updated.siteUrl) {
        payload.siteUrl = updated.siteUrl;
      }
      if (updated.icon) {
        payload.icon = updated.icon;
      }
      
      const res = await axiosInstance.patch(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls/${encodeURIComponent(originalSiteName)}`, payload);
      const data = res.data;
      if (data && data.success) {
        setModalOpen(false);
        // Invalidate both category and URL queries
        queryClient.invalidateQueries(['categoryList', userId]);
        queryClient.invalidateQueries(['urlList', userId, categoryName]);
        if (refetchCategories) refetchCategories();
        
        // Dispatch custom event to notify other components of settings change
        const settingsChangeEvent = new CustomEvent('settingsChanged', {
          detail: {
            userId,
            categoryName,
            siteName: originalSiteName,
            action: 'updated'
          }
        });
        window.dispatchEvent(settingsChangeEvent);
        } else {
        alert('Failed to update URL: ' + (data?.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to update URL: ' + err.message);
    }
  };

  const handleDelete = async (toDelete) => {
    const userId = getOrCreateUserId();
    const categoryName = selectedCategory?.categoryName;
    const siteName = toDelete?.siteName;
    if (!userId || !categoryName || !siteName) {
      alert('Missing required info for delete');
      return;
    }
    try {
      const res = await axiosInstance.delete(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls/${encodeURIComponent(siteName)}`);
      const data = res.data;
      if (data && data.success) {
        if (refetchCategories) {
          await refetchCategories();
        }
        // Invalidate both category and URL queries
        queryClient.invalidateQueries(['categoryList', userId]);
        queryClient.invalidateQueries(['urlList', userId, categoryName]);
        
        // Dispatch custom event to notify other components of settings change
        const settingsChangeEvent = new CustomEvent('settingsChanged', {
          detail: {
            userId,
            categoryName,
            siteName,
            action: 'deleted'
          }
        });
        window.dispatchEvent(settingsChangeEvent);
        } else {
        alert('Failed to delete URL: ' + (data?.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to delete URL: ' + err.message);
    }
    setModalOpen(false);
  };

  const handleAdd = async (newUrl) => {
    let iconUrl = '';
    let iconFilename = '';
    if (newUrl.icon && newUrl.icon.file instanceof File) {
      const uploadResult = await uploadIconMock(newUrl.icon.file);
      iconUrl = uploadResult.iconUrl;
      iconFilename = uploadResult.iconFilename;
    } else if (newUrl.icon && newUrl.icon.url) {
      iconUrl = newUrl.icon.url;
      iconFilename = '';
    } else {
      iconUrl = '';
      iconFilename = '';
    }
    const userId = getOrCreateUserId();
    const categoryName = selectedCategory?.categoryName || 'Test';
    const siteName = newUrl.siteName || '';
    let siteUrl = '';
    if (typeof newUrl.siteUrl === 'string') {
      siteUrl = newUrl.siteUrl;
    } else if (newUrl.siteUrl && typeof newUrl.siteUrl.url === 'string') {
      siteUrl = newUrl.siteUrl.url;
    } else {
      siteUrl = '';
    }
    let icon = { public_id: '', url: '' };
    if (newUrl.icon && newUrl.icon.file instanceof File) {
      icon = { public_id: 'local-upload', url: iconUrl };
    } else if (newUrl.icon && newUrl.icon.url) {
      icon = { public_id: 'local-upload', url: newUrl.icon.url };
    } else {
      icon = { public_id: 'default-icon', url: '/temp/search.png' };
    }
    const payload = {
      siteName,
      siteUrl: siteUrl,
      icon,
      isChecked: true
    };
    try {
      const res = await axiosInstance.post(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls`, payload);
      const data = res.data;
      if (!data || !data.url) throw new Error('Failed to add URL');
      if (refetchCategories) {
        await refetchCategories();
      }
      // Invalidate both category and URL queries
      queryClient.invalidateQueries(['categoryList', userId]);
      queryClient.invalidateQueries(['urlList', userId, categoryName]);
      
      // Dispatch custom event to notify other components of settings change
      const settingsChangeEvent = new CustomEvent('settingsChanged', {
        detail: {
          userId,
          categoryName,
          siteName,
          action: 'added'
        }
      });
      window.dispatchEvent(settingsChangeEvent);
      } catch (err) {
      alert('Failed to add URL: ' + err.message);
    }
    setAddModalOpen(false);
  };

  const handleCheckboxToggle = async (e, idx) => {
    e.stopPropagation();
    const userId = getOrCreateUserId();
    const categoryName = selectedCategory?.categoryName;
    // Get the URL data from the displayUrls array (which comes from the API response)
    const urlData = displayUrls[idx];
    const siteName = urlData?.siteName;
    
    if (!userId || !categoryName || !siteName) {
      alert('Missing required info for toggle');
      return;
    }
    
    try {
      const res = await axiosInstance.patch(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls/${encodeURIComponent(siteName)}/toggle`);
      const data = res.data;
      if (data && data.success) {
        // Invalidate both URL and category queries to refresh the data
        queryClient.invalidateQueries(['urlList', userId, categoryName]);
        queryClient.invalidateQueries(['categories', userId]);
        if (refetchCategories) {
          refetchCategories();
        }
        
        // Dispatch custom event to notify other components of settings change
        const settingsChangeEvent = new CustomEvent('settingsChanged', {
          detail: {
            userId,
            categoryName,
            siteName,
            isChecked: data.isChecked
          }
        });
        window.dispatchEvent(settingsChangeEvent);
        } else {
        alert('Failed to toggle URL: ' + (data?.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to toggle URL: ' + err.message);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Paper p="md" radius="md" withBorder style={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        backgroundColor: 'transparent', // Ensure Paper doesn't override the parent's background
        width: '100%',
        height: '100%'
      }}>
      <Title order={4} mb="sm" sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
      })}>
        {displayCategory?.categoryName || 'No category selected'} URLs
        {!isLoading && totalUrls > 0 && (
          <Text span size="sm" c="dimmed" ml="xs" fw={400}>
            ({enabledUrls} enabled / {totalUrls} total)
          </Text>
        )}
        {!isLoading && totalUrls === 0 && (
          <Text span size="sm" c="dimmed" ml="xs" fw={400}>
            (no URLs yet)
          </Text>
        )}
        {isLoading && <Text span size="sm" c="dimmed" ml="xs">(Loading...)</Text>}
        <Tooltip label="Edit Category">
          <ActionIcon 
            variant="subtle" 
            color="blue" 
            onClick={() => onEditCategory && onEditCategory(selectedCategory)}
            disabled={!selectedCategory}
          >
            <IconEdit size={18} />
          </ActionIcon>
        </Tooltip>
      </Title>
      <ScrollArea type="auto" style={{ flex: 1, minHeight: 0 }}>
        <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}> 
          <>
            {isLoading ? (
              <Text c="dimmed" ta="center" style={{ gridColumn: '1 / -1' }}>Loading URLs...</Text>
            ) : displayUrls.length > 0 ? (
              displayUrls.map((item, idx) => (
                <Paper
                  key={idx}
                  p="sm"
                  radius="md"
                  withBorder
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                    borderColor: item.isChecked ? theme.colors.blue[6] : undefined,
                    borderWidth: item.isChecked ? 2 : undefined,
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Ensure consistent theming
                  }}
                  onClick={(e) => {
                    // Only open modal if not clicking on checkbox
                    if (!e.target.closest('[data-checkbox]')) {
                      setEditingUrl(item);
                      setModalOpen(true);
                    }
                  }}
                >
                  <Checkbox 
                    checked={item.isChecked} 
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxToggle(e, idx);
                    }}
                    size="sm" 
                    mr={8}
                    data-checkbox
                  />
                  {item.icon?.url ? (
                    <Avatar src={getImageUrl(item.icon.url)} size="sm" mr={8} />
                  ) : (
                    <Avatar color="gray" size="sm" mr={8}><IconWorld size={16} /></Avatar>
                  )}
                  <Tooltip label={item.siteName || 'Unnamed Site'} withArrow>
                    <Text 
                      fw={500} 
                      truncate 
                      style={{ 
                        maxWidth: 120, 
                        minWidth: 0, 
                        flex: 1,
                        cursor: 'pointer'
                      }}
                    >
                      {item.siteName || 'Unnamed Site'}
                    </Text>
                  </Tooltip>
                </Paper>
              ))
            ) : null}
            {/* Add new tile - always show when not loading */}
            {!isLoading && (
              <Paper p="sm" radius="md" withBorder style={{ 
                cursor: 'pointer', 
                borderStyle: 'dashed', 
                borderColor: theme.colors.blue[6], 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                backgroundColor: 'transparent' // Ensure consistent theming
              }} onClick={() => setAddModalOpen(true)}>
                <Center w={32} h={32} style={{ borderRadius: 8, background: theme.colors.blue[0] }}>
                  <IconPlus size={20} color={theme.colors.blue[6]} />
                </Center>
                <Text fw={500} c="blue.7">Add new</Text>
              </Paper>
            )}
          </>
        </SimpleGrid>
      </ScrollArea>
      <EditUrlModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        urlData={editingUrl}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <AddUrlModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />
    </Paper>
    </div>
  );
} 