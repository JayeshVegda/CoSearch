import React from 'react';
import { Select, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';

function CategoryBox({ data = [], loading = false, onCategoryChange, style = {}, refetchCategories, selectedValue }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const selectRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Safely normalize data to ensure we always have an array of strings
  const normalizedData = React.useMemo(() => {
    // Ensure data is an array
    if (!Array.isArray(data)) {
      return [];
    }
    
    try {
      return data.map(item => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && item.categoryName) return item.categoryName;
        return String(item);
      });
    } catch (error) {
      return [];
    }
  }, [data]);

  const handleChange = (value) => {
    if (onCategoryChange && value) {
      onCategoryChange(value);
    }
  };

  // Add scroll functionality on hover to change category
  useEffect(() => {
    const selectElement = selectRef.current;
    if (!selectElement) return;

    const handleWheel = (event) => {
      if (isHovering && !loading && normalizedData.length > 0) {
        event.preventDefault();
        
        const currentIndex = selectedValue ? normalizedData.indexOf(selectedValue) : 0;
        const scrollDirection = event.deltaY > 0 ? 1 : -1;
        const newIndex = Math.max(0, Math.min(normalizedData.length - 1, currentIndex + scrollDirection));
        
        const newValue = normalizedData[newIndex];
        if (newValue && newValue !== selectedValue && onCategoryChange) {
          onCategoryChange(newValue);
        }
      }
    };

    selectElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => selectElement.removeEventListener('wheel', handleWheel);
  }, [isHovering, selectedValue, normalizedData, loading, onCategoryChange]);

  // Listen for settings changes to refresh categories
  useEffect(() => {
    const handleSettingsChange = () => {
      if (refetchCategories) {
        refetchCategories();
      }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [refetchCategories]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div 
      style={{ 
        ...style,
        overflow: 'hidden'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Select 
        ref={selectRef}
        size="md" 
        radius="lg" 
        w={isMobile ? '100%' : 'auto'}
        data={loading ? ['Loading...'] : (normalizedData.length > 0 ? normalizedData : ['No categories available'])} 
        placeholder={loading ? "Loading categories..." : "Select Category"}
        disabled={loading}
        onChange={handleChange}
        value={selectedValue || (normalizedData.length > 0 ? normalizedData[0] : undefined)}
        rightSection={<IconChevronDown size={16} />}
        aria-label="Select search category"
        role="combobox"
        tabIndex={0}
        styles={{
          input: {
            border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 500,
            color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
            transition: 'all 0.15s ease',
            cursor: 'pointer',
            minWidth: isMobile ? '200px' : '180px',
            boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            outline: 'none',
            '&:focus': {
              borderColor: theme.colors.blue[6],
              boxShadow: `0 0 0 3px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderWidth: '2px',
              transform: 'translateY(-1px)'
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.colors.blue[6]}`,
              outlineOffset: '2px',
              borderColor: theme.colors.blue[6],
              boxShadow: `0 0 0 3px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
            },
            '&:hover': {
              borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[4],
              transform: 'translateY(-1px)',
              boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
          },
          dropdown: {
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
            border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            borderRadius: '12px',
            boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          },
          item: {
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 500,
            color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1]
            },
            '&[data-selected]': {
              backgroundColor: theme.colors.blue[6],
              color: theme.white,
              fontWeight: 600
            }
          },
          rightSection: {
            color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
            transition: 'transform 0.15s ease'
          }
        }}
      />
    </div>
  );
}

export default CategoryBox;


