import { useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useState, useEffect } from 'react';

function QueryBox({ onQueryChange, value, style = {}, onSearch }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onSearch && value && value.trim() !== '') {
        onSearch(value);
      }
    }
  };

  return (
    <Input 
      w={isMobile ? '100%' : 600} 
      size="md"
      radius="lg"
      placeholder="Search..."
      value={value}
      onChange={(event) => onQueryChange(event.currentTarget.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      leftSection={<IconSearch size={16} />}
      style={{
        ...style,
        minWidth: isMobile ? '280px' : '500px'
      }}
      styles={{
        '@keyframes searchPulse': {
          '0%, 100%': {
            boxShadow: `0 0 0 4px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
          },
          '50%': {
            boxShadow: `0 0 0 6px ${theme.colors.blue[6]}20, 0 6px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)'}`
          }
        },
        '@keyframes searchGlow': {
          '0%, 100%': {
            boxShadow: `0 0 0 3px ${theme.colors.blue[6]}30, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
          },
          '50%': {
            boxShadow: `0 0 0 5px ${theme.colors.blue[6]}40, 0 6px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)'}`
          }
        },
        input: {
          border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 500,
          color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
          transition: 'all 0.3s ease',
          paddingLeft: '52px',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          outline: 'none',
          '&:focus': {
            borderColor: theme.colors.blue[6],
            boxShadow: `0 0 0 4px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderWidth: '2px',
            transform: 'translateY(-1px)',
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
            animation: isFocused ? 'searchGlow 2s infinite' : 'none'
          },
          '&:hover': {
            borderColor: theme.colors.blue[6],
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
          },
          '&::placeholder': {
            color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
            fontWeight: 500,
            opacity: 0.8
          },
          // Enhanced focus ring for better accessibility
          '&:focus-visible': {
            outline: `2px solid ${theme.colors.blue[6]}`,
            outlineOffset: '2px',
            borderColor: theme.colors.blue[6],
            boxShadow: `0 0 0 4px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
          }
        },
        section: {
          color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
          marginLeft: '16px',
          marginRight: '8px',
          transition: 'color 0.3s ease'
        }
      }}
      // Enhanced accessibility attributes
      aria-label="Search input"
      role="searchbox"
      tabIndex={0}
    />
  );
}

export default QueryBox;