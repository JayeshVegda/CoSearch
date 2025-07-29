/**
 * Form Field Component
 * Provides consistent form field styling and validation across the application
 */
import { Box, Text, useMantineTheme, useMantineColorScheme } from '@mantine/core';

/**
 * Enhanced form field wrapper with consistent styling and validation display
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.description - Field description
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.size - Field size (xs, sm, md, lg, xl)
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Field input component
 */
export default function FormField({
  label,
  description,
  error,
  required = false,
  size = "md",
  style = {},
  children
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const getTextSize = () => {
    switch (size) {
      case "xs": return "xs";
      case "sm": return "sm";
      case "md": return "md";
      case "lg": return "lg";
      case "xl": return "xl";
      default: return "md";
    }
  };

  return (
    <Box style={{ marginBottom: theme.spacing.md, ...style }}>
      {/* Label */}
      {label && (
        <Text
          size={getTextSize()}
          fw={600}
          mb="xs"
          style={{
            color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}
        >
          {label}
          {required && (
            <Text
              component="span"
              size={getTextSize()}
              style={{ color: theme.colors.red[6] }}
            >
              *
            </Text>
          )}
        </Text>
      )}

      {/* Input */}
      <Box>
        {children}
      </Box>

      {/* Description */}
      {description && !error && (
        <Text
          size="xs"
          mt="xs"
          style={{
            color: isDark ? theme.colors.gray[4] : theme.colors.gray[6]
          }}
        >
          {description}
        </Text>
      )}

      {/* Error */}
      {error && (
        <Text
          size="xs"
          mt="xs"
          style={{
            color: theme.colors.red[6],
            fontWeight: 500
          }}
        >
          {error}
        </Text>
      )}
    </Box>
  );
}

/**
 * Form section component for grouping related fields
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {React.ReactNode} props.children - Section content
 * @param {Object} props.style - Additional styles
 */
export function FormSection({ title, description, children, style = {} }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      style={{
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.md,
        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        ...style
      }}
    >
      {title && (
        <Text
          size="lg"
          fw={600}
          mb="md"
          style={{
            color: isDark ? theme.colors.gray[0] : theme.colors.gray[9]
          }}
        >
          {title}
        </Text>
      )}
      
      {description && (
        <Text
          size="sm"
          mb="lg"
          style={{
            color: isDark ? theme.colors.gray[4] : theme.colors.gray[6]
          }}
        >
          {description}
        </Text>
      )}
      
      {children}
    </Box>
  );
}

/**
 * Form actions component for buttons and controls
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Action buttons
 * @param {string} props.align - Alignment (left, center, right)
 * @param {Object} props.style - Additional styles
 */
export function FormActions({ children, align = "right", style = {} }) {
  const theme = useMantineTheme();

  const getAlignment = () => {
    switch (align) {
      case "left": return "flex-start";
      case "center": return "center";
      case "right": return "flex-end";
      default: return "flex-end";
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: getAlignment(),
        gap: theme.spacing.sm,
        marginTop: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        ...style
      }}
    >
      {children}
    </Box>
  );
} 