/**
 * Reusable Input Component
 * Handles all text input interactions with consistent styling and validation across the application
 */
import { TextInput, useMantineTheme, useMantineColorScheme } from '@mantine/core';

/**
 * Enhanced Input component with consistent theming and validation
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {boolean} props.required - Required field
 * @param {string} props.error - Error message
 * @param {string} props.description - Description text
 * @param {string} props.size - Input size (xs, sm, md, lg, xl)
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.leftSection - Left icon/section
 * @param {React.ReactNode} props.rightSection - Right icon/section
 */
export default function Input({ 
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  description,
  size = "md",
  style = {},
  leftSection,
  rightSection,
  ...props 
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Enhanced input styles with consistent theming
  const inputStyles = {
    input: {
      border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
      borderRadius: theme.radius.lg,
      transition: 'all 0.2s ease',
      fontSize: size === 'lg' ? '16px' : '14px',
      fontWeight: 500,
      outline: 'none',
      '&:focus': {
        borderColor: theme.colors.blue[6],
        boxShadow: `0 0 0 3px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
        transform: 'translateY(-1px)',
      },
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.blue[6]}`,
        outlineOffset: '2px',
        borderColor: theme.colors.blue[6],
        boxShadow: `0 0 0 3px ${theme.colors.blue[6]}25, 0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
      },
      '&:hover': {
        borderColor: theme.colors.blue[6],
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 16px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
      },
      '&::placeholder': {
        color: isDark ? theme.colors.gray[5] : theme.colors.gray[6]
      }
    },
    label: {
      fontWeight: 600,
      color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
      marginBottom: theme.spacing.xs,
    },
    error: {
      fontSize: '12px',
      marginTop: theme.spacing.xs,
    },
    description: {
      fontSize: '12px',
      color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
      marginTop: theme.spacing.xs,
    }
  };

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      error={error}
      description={description}
      size={size}
      leftSection={leftSection}
      rightSection={rightSection}
      styles={inputStyles}
      style={style}
      {...props}
    />
  );
}

// Specialized input variants for common use cases
export function SearchInput({ value, onChange, placeholder = "Search...", style, onKeyPress, ...props }) {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && onKeyPress) {
      onKeyPress(event);
    }
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      size="lg"
      style={{
        width: '100%',
        maxWidth: '600px',
        ...style
      }}
      aria-label="Search input"
      role="searchbox"
      tabIndex={0}
      {...props}
    />
  );
}

export function EmailInput({ value, onChange, required = true, style, ...props }) {
  return (
    <Input
      label="Email Address"
      placeholder="Enter your email"
      value={value}
      onChange={onChange}
      type="email"
      required={required}
      style={style}
      {...props}
    />
  );
}

export function PasswordInput({ value, onChange, required = true, style, ...props }) {
  return (
    <Input
      label="Password"
      placeholder="Enter your password"
      value={value}
      onChange={onChange}
      type="password"
      required={required}
      style={style}
      {...props}
    />
  );
} 