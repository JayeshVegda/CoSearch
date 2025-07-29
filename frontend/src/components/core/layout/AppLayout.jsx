/**
 * Main Application Layout Component
 * Provides the primary layout structure for the entire application with consistent theming
 */
import { Box, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

/**
 * Main application layout that wraps all content with consistent theming and structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render within the layout
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export default function AppLayout({ children, className, style = {} }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Set document body background color based on theme
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? theme.colors.dark[8] : theme.colors.gray[0];
    document.body.style.color = isDark ? theme.colors.gray[0] : theme.colors.gray[9];
  }, [isDark, theme]);

  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
        color: isDark ? theme.colors.gray[0] : theme.colors.gray[9],
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Container component for consistent content width and padding
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.maxWidth - Maximum width of the container
 * @param {string} props.padding - Padding around the content
 * @param {Object} props.style - Additional styles
 */
export function Container({ 
  children, 
  maxWidth = '1200px', 
  padding = '20px',
  style = {} 
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      style={{
        maxWidth,
        margin: '0 auto',
        padding,
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.lg,
        boxShadow: isDark 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        ...style
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Section component for organizing content into logical groups
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {Object} props.style - Additional styles
 */
export function Section({ 
  children, 
  title, 
  description, 
  style = {} 
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      style={{
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.lg,
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.md,
        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        ...style
      }}
    >
      {title && (
        <Box style={{ marginBottom: theme.spacing.md }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: isDark ? theme.colors.gray[0] : theme.colors.gray[9]
          }}>
            {title}
          </h2>
          {description && (
            <p style={{
              margin: '8px 0 0 0',
              color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
              fontSize: '0.9rem'
            }}>
              {description}
            </p>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
} 