import { Alert, Text, Button, Group, Stack, Paper } from '@mantine/core';

function Error({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.",
  type = "error", // "error", "warning", "info"
  showRetry = true,
  onRetry = null,
  onDismiss = null,
  showDismiss = false,
  variant = "filled" // "filled", "outline", "light"
}) {
  const getColor = () => {
    switch (type) {
      case "warning":
        return "yellow";
      case "info":
        return "blue";
      default:
        return "red";
    }
  };

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      radius="md"
      withBorder
      style={{
        background: variant === "filled" ? `var(--mantine-color-${getColor()}-1)` : "transparent",
        border: variant === "outline" ? `2px solid var(--mantine-color-${getColor()}-4)` : "none"
      }}
    >
      <Stack gap="sm">
        <Alert
          title={title}
          color={getColor()}
          variant={variant}
          styles={{
            root: {
              border: 'none',
              background: 'transparent',
              padding: 0
            },
            body: {
              padding: 0
            },
            title: {
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            },
            message: {
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: variant === "filled" ? `var(--mantine-color-${getColor()}-9)` : `var(--mantine-color-${getColor()}-7)`
            }
          }}
        >
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        </Alert>

        {(showRetry || showDismiss) && (
          <Group justify="flex-end" gap="sm">
            {showRetry && onRetry && (
              <Button
                variant="light"
                color={getColor()}
                size="sm"
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}
            {showDismiss && onDismiss && (
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}

export default Error;
