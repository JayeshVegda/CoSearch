/**
 * Reusable Modal Component
 * Handles all modal interactions with consistent styling and behavior across the application
 */
import { Modal as MantineModal, useMantineTheme, useMantineColorScheme } from '@mantine/core';

/**
 * Enhanced Modal component with consistent theming and behavior
 * @param {Object} props - Component props
 * @param {boolean} props.opened - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.size - Modal size (xs, sm, md, lg, xl)
 * @param {boolean} props.centered - Center modal on screen
 * @param {boolean} props.withCloseButton - Show close button
 * @param {Object} props.overlayProps - Overlay properties
 * @param {Object} props.styles - Custom styles
 * @param {React.ReactNode} props.children - Modal content
 */
export default function Modal({ 
  opened, 
  onClose, 
  title, 
  size = "md", 
  centered = true, 
  withCloseButton = true,
  overlayProps = {},
  styles = {},
  children,
  ...props 
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Enhanced modal styles with consistent theming
  const modalStyles = {
    content: {
      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
      border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      borderRadius: theme.radius.lg,
      boxShadow: isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
        : '0 8px 32px rgba(0, 0, 0, 0.15)',
    },
    header: {
      borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
    },
    title: {
      color: isDark ? theme.colors.gray[0] : theme.colors.gray[9],
      fontWeight: 600,
    },
    body: {
      padding: theme.spacing.lg,
    },
    close: {
      color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
      '&:hover': {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
      }
    }
  };

  // Default overlay props
  const defaultOverlayProps = {
    backgroundOpacity: isDark ? 0.3 : 0.2,
    blur: 3,
  };

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      withCloseButton={withCloseButton}
      overlayProps={{ ...defaultOverlayProps, ...overlayProps }}
      styles={{ ...modalStyles, ...styles }}
      {...props}
    >
      {children}
    </MantineModal>
  );
}

// Specialized modal variants for common use cases
export function ConfirmationModal({ 
  opened, 
  onClose, 
  title = "Confirm Action", 
  message, 
  onConfirm, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  ...props 
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <p style={{ marginBottom: '20px', color: 'inherit' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: '#dc3545',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function LoadingModal({ 
  opened, 
  onClose, 
  title = "Loading...", 
  message = "Please wait while we process your request.",
  ...props 
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      withCloseButton={false}
      {...props}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
        <p style={{ color: 'inherit', margin: 0 }}>
          {message}
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
} 