/**
 * Settings Panel Component
 * Manages application settings with category and URL management capabilities
 */
import { Box, Group, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconSettings, IconFolder, IconWorld } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrCreateUserId } from '../../../utils/getOrCreateUserId';
import axiosInstance from '../../../lib/axios';
import CategoryManager from './CategoryManager';
import UrlManager from './UrlManager';
import SettingsNavigation from './SettingsNavigation';

/**
 * Main settings panel component that provides comprehensive settings management
 * @param {Object} props - Component props
 * @param {boolean} props.opened - Panel open state
 * @param {Function} props.onClose - Close handler
 * @param {Array} props.categories - Available categories
 * @param {Function} props.onCategoriesChange - Categories change handler
 * @param {Object} props.style - Additional styles
 */
export default function SettingsPanel({
  opened,
  onClose,
  categories = [],
  onCategoriesChange,
  style = {}
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeSection, setActiveSection] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const userId = getOrCreateUserId();

  // Fetch URLs for selected category
  const { data: urlData, isLoading: urlLoading, error: urlError, refetch: refetchUrls } = useQuery({
    queryKey: ['urlList', userId, selectedCategory?.categoryName],
    queryFn: () => axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(selectedCategory?.categoryName)}/urls`).then(res => res.data),
    enabled: !!selectedCategory?.categoryName,
  });

  // Update selected category when categories change
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleClose = () => {
    // Dispatch settings changed event
    const settingsChangeEvent = new CustomEvent('settingsChanged', {
      detail: {
        type: 'panelClosed',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(settingsChangeEvent);
    onClose();
  };

  if (!opened) return null;

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: '800px',
        height: '100vh',
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        borderLeft: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        boxShadow: isDark 
          ? '-4px 0 12px rgba(0, 0, 0, 0.3)' 
          : '-4px 0 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {/* Header */}
      <Group
        justify="space-between"
        p="lg"
        style={{
          borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0]
        }}
      >
        <Group gap="sm">
          <IconSettings size={24} />
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: isDark ? theme.colors.gray[0] : theme.colors.gray[9]
          }}>
            Settings
          </h2>
        </Group>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
            padding: '4px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1]
            }
          }}
        >
          ×
        </button>
      </Group>

      {/* Navigation */}
      <SettingsNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Content */}
      <Box style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {activeSection === 'categories' && (
          <CategoryManager
            categories={categories}
            onCategoriesChange={onCategoriesChange}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}
        
        {activeSection === 'urls' && selectedCategory && (
          <UrlManager
            category={selectedCategory}
            urls={urlData?.urls || []}
            isLoading={urlLoading}
            error={urlError}
            onUrlsChange={refetchUrls}
          />
        )}
      </Box>
    </Box>
  );
}

/**
 * Compact settings panel for smaller screens
 * @param {Object} props - Component props (same as SettingsPanel)
 */
export function CompactSettingsPanel(props) {
  return (
    <SettingsPanel
      {...props}
      style={{
        maxWidth: '100%',
        ...props.style
      }}
    />
  );
}

/**
 * Full-screen settings panel for detailed management
 * @param {Object} props - Component props (same as SettingsPanel)
 */
export function FullScreenSettingsPanel(props) {
  return (
    <SettingsPanel
      {...props}
      style={{
        maxWidth: 'none',
        width: '100%',
        ...props.style
      }}
    />
  );
} 