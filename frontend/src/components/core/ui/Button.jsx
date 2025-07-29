/**
 * Reusable Button Component
 * Handles all button interactions with consistent styling and behavior across the application
 */
import { Button as MantineButton, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

/**
 * Enhanced Button component with consistent theming and behavior
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (filled, light, outline, etc.)
 * @param {string} props.color - Button color theme
 * @param {string} props.size - Button size (xs, sm, md, lg, xl)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.leftSection - Left icon/section
 * @param {React.ReactNode} props.rightSection - Right icon/section
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Button content
 */
export default function Button({ 
  variant = "filled", 
  color = "blue", 
  size = "md", 
  loading = false, 
  disabled = false,
  onClick,
  leftSection,
  rightSection,
  style = {},
  children,
  ...props 
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Enhanced button styles with consistent theming
  const buttonStyles = {
    root: {
      fontWeight: 600,
      borderRadius: theme.radius.lg,
      transition: 'all 0.2s ease',
      boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      '&:active': {
        transform: 'translateY(0px)',
      },
      '&:disabled': {
        transform: 'none',
        boxShadow: 'none',
      }
    }
  };

  return (
    <MantineButton
      variant={variant}
      color={color}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      leftSection={leftSection}
      rightSection={rightSection}
      styles={buttonStyles}
      style={style}
      {...props}
    >
      {children}
    </MantineButton>
  );
}

// Specialized button variants for common use cases
export function SearchButton({ onClick, loading, disabled, style, children }) {
  return (
    <Button
      variant="gradient"
      gradient={{ from: 'blue', to: 'indigo', deg: 45 }}
      leftSection={<IconSearch size={18} />}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={style}
    >
      {children || 'Search'}
    </Button>
  );
}

export function PrimaryButton({ onClick, loading, disabled, style, children }) {
  return (
    <Button
      variant="filled"
      color="blue"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={style}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({ onClick, loading, disabled, style, children }) {
  return (
    <Button
      variant="light"
      color="gray"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={style}
    >
      {children}
    </Button>
  );
} 