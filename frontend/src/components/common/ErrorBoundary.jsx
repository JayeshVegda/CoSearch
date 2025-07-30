/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
import React from 'react';
import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Stack align="center" spacing="lg">
            <IconAlertTriangle size={48} color="red" />
            <Title order={2} color="red">
              Something went wrong
            </Title>
            <Text color="dimmed" align="center">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Alert color="red" variant="light">
              <Text size="sm">
                Please try refreshing the page or contact support if the problem persists.
              </Text>
            </Alert>
            <Button 
              leftSection={<IconRefresh size={16} />}
              onClick={this.handleReset}
              variant="light"
            >
              Try Again
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 