import React, { useEffect, useState } from 'react';
import { Text, Paper, Stack, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';

import axiosInstance from '../../lib/axios';

export default function SiteTiles({ selectedCategory, refetchCategories, isLoading }) {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [sites, setSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Fetch all sites for the selected category
  const fetchSites = async () => {
    if (!selectedCategory) {
      setSites([]);
      return;
    }

    setLoadingSites(true);
    try {
      const userId = getOrCreateUserId();
      const categoryName = typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.categoryName;
      
      console.log('Fetching sites for category:', categoryName);
      // Use the settings endpoint to get ALL sites (enabled and disabled)
      const response = await axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls`);
      console.log('URLs response:', response.data);
      
      if (response.data.success && response.data.urls) {
        const allSites = response.data.urls.map(site => ({
          name: site.siteName,
          url: site.siteUrl,
          icon: site.icon || null,
          description: site.description || null,
          enabled: site.isChecked !== false
        }));
        console.log('Mapped sites:', allSites);
        setSites(allSites);
      } else {
        setSites([]);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  };

  // Fetch sites when category changes
  useEffect(() => {
    fetchSites();
  }, [selectedCategory]);

  // Listen for settings changes to refresh data
  useEffect(() => {
    const handleSettingsChange = (event) => {
      console.log('SiteTiles received settings change event:', event.detail);
      
      // Refresh on data reset, import, or any non-toggle action
      if (event.detail.type === 'dataReset' || event.detail.type === 'dataImported' || event.detail.action !== 'toggled') {
        console.log('SiteTiles refreshing sites due to settings change');
        fetchSites();
      }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [selectedCategory]);

  // Toggle site state
  const handleToggle = async (site) => {
    console.log('SiteTiles: handleToggle called for site:', site);
    const userId = getOrCreateUserId();
    const categoryName = typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.categoryName;
    
    if (!userId || !categoryName || !site.name) {
      console.log('SiteTiles: Missing required data for toggle:', { userId, categoryName, siteName: site.name });
      return;
    }
    
    try {
      // Optimistic update
      setSites(prevSites => 
        prevSites.map(s => 
          s.name === site.name ? { ...s, enabled: !s.enabled } : s
        )
      );
      
      // API call
      const response = await axiosInstance.patch(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(categoryName)}/urls/${encodeURIComponent(site.name)}/toggle`);
      const data = response.data;
      
      if (data.success) {
        // Invalidate queries
        queryClient.invalidateQueries(['urlList', userId, categoryName]);
        queryClient.invalidateQueries(['categories', userId]);
        if (refetchCategories) refetchCategories();
        
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('settingsChanged', {
          detail: { userId, categoryName, siteName: site.name, isChecked: data.isChecked, action: 'toggled' }
        }));
      } else {
        // Revert on failure
        setSites(prevSites => 
          prevSites.map(s => 
            s.name === site.name ? { ...s, enabled: !s.enabled } : s
          )
        );
      }
    } catch (error) {
      console.error('Toggle error:', error);
      // Revert on error
      setSites(prevSites => 
        prevSites.map(s => 
          s.name === site.name ? { ...s, enabled: !s.enabled } : s
        )
      );
    }
  };

  if (isLoading || loadingSites) {
    return null;
  }

  if (!selectedCategory) {
    return null;
  }

  if (sites.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '1.5rem'
      }}>
        <Stack align="center" gap="xs">
          <IconWorld size={16} color={isDark ? theme.colors.gray[4] : theme.colors.gray[5]} />
          <Text c="dimmed" ta="center" size="sm">No sites in this category</Text>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '8px',
      minHeight: '80px',
      maxHeight: '80px',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      {sites.map((site) => (
        <Paper
          key={site.name}
          onClick={(e) => {
            console.log('SiteTiles: Paper clicked for site:', site.name);
            e.preventDefault();
            e.stopPropagation();
            handleToggle(site);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            width: 'auto',
            minWidth: '60px',
            maxWidth: '90px',
            height: '24px',
            flexShrink: 0,
            borderRadius: '12px',
            backgroundColor: site.enabled 
              ? (isDark ? theme.colors.blue[9] : theme.colors.blue[0])
              : (isDark ? theme.colors.dark[6] : theme.colors.gray[1]),
            border: `1px solid ${site.enabled 
              ? theme.colors.blue[4]
              : (isDark ? theme.colors.dark[3] : theme.colors.gray[3])}`,
            boxShadow: site.enabled 
              ? `0 1px 4px ${theme.colors.blue[4]}40`
              : (isDark ? '0 1px 3px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(0, 0, 0, 0.05)'),
            color: site.enabled 
              ? (isDark ? theme.colors.blue[2] : theme.colors.blue[6])
              : (isDark ? theme.colors.gray[2] : theme.colors.gray[6]),
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: site.enabled 
                ? `0 2px 8px ${theme.colors.blue[4]}50`
                : (isDark ? '0 2px 6px rgba(0, 0, 0, 0.6)' : '0 2px 4px rgba(0, 0, 0, 0.1)'),
            }
          }}
        >
          {/* Site Icon */}
          {site.icon ? (
            <img 
              src={site.icon.url || site.icon} 
              alt={site.name}
              style={{
                width: '10px',
                height: '10px',
                flexShrink: 0,
                borderRadius: '2px',
                objectFit: 'contain',
                filter: site.enabled ? 'none' : 'grayscale(100%) opacity(0.6)',
              }}
            />
          ) : (
            <IconWorld 
              size={8} 
              style={{ 
                flexShrink: 0,
                color: site.enabled 
                  ? (isDark ? theme.colors.blue[2] : theme.colors.blue[6])
                  : (isDark ? theme.colors.gray[3] : theme.colors.gray[5])
              }} 
            />
          )}
          
          {/* Site Name */}
          <Text
            size="10px"
            style={{
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
              flex: 1,
              textAlign: 'left',
              fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {site.name}
          </Text>
        </Paper>
      ))}
    </div>
  );
} 