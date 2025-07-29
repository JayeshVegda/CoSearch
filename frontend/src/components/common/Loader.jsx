import { Loader, Text, Stack, Paper, Group, RingProgress } from '@mantine/core';

function LoaderComponent({ 
  message = "Loading...", 
  type = "spinner", // "spinner", "dots", "ring", "custom"
  size = "md", // "xs", "sm", "md", "lg", "xl"
  color = "blue",
  showMessage = true,
  variant = "default", // "default", "card", "minimal"
  progress = null, // 0-100 for progress indicator
  showProgress = false
}) {
  const getLoaderSize = () => {
    switch (size) {
      case "xs": return 20;
      case "sm": return 30;
      case "md": return 40;
      case "lg": return 60;
      case "xl": return 80;
      default: return 40;
    }
  };

  const getLoader = () => {
    switch (type) {
      case "dots":
        return <Loader type="dots" size={getLoaderSize()} color={color} />;
      case "ring":
        return <Loader type="bars" size={getLoaderSize()} color={color} />;
      case "custom":
        return <Loader type="oval" size={getLoaderSize()} color={color} />;
      default:
        return <Loader size={getLoaderSize()} color={color} />;
    }
  };

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

  const renderContent = () => (
    <Stack gap="sm" align="center" justify="center">
      {type === "ring" && showProgress && progress !== null ? (
        <RingProgress
          size={getLoaderSize()}
          thickness={4}
          sections={[{ value: progress, color: color }]}
          label={
            <Text ta="center" size={getTextSize()} fw={700}>
              {progress}%
            </Text>
          }
        />
      ) : (
        getLoader()
      )}
      
      {showMessage && (
        <Text 
          size={getTextSize()} 
          c="dimmed" 
          ta="center"
          style={{ maxWidth: '200px' }}
        >
          {message}
        </Text>
      )}
    </Stack>
  );

  if (variant === "card") {
    return (
      <Paper 
        shadow="sm" 
        p="lg" 
        radius="md"
        withBorder
        style={{
          background: `var(--mantine-color-${color}-0)`,
          border: `1px solid var(--mantine-color-${color}-3)`
        }}
      >
        {renderContent()}
      </Paper>
    );
  }

  if (variant === "minimal") {
    return (
      <Group gap="sm" justify="center">
        {getLoader()}
        {showMessage && (
          <Text size={getTextSize()} c="dimmed">
            {message}
          </Text>
        )}
      </Group>
    );
  }

  // Default variant
  return (
    <Stack gap="md" align="center" justify="center" p="md">
      {renderContent()}
    </Stack>
  );
}

export default LoaderComponent;
