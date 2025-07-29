/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <h1 style={{ color: '#e53e3e', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#718096', textAlign: 'center', margin: 0 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <div
              style={{
                maxWidth: '600px',
                maxHeight: '200px',
                overflow: 'auto',
                backgroundColor: '#f1f3f4',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                marginTop: '1rem'
              }}
            >
              <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0' }}>Error Details:</p>
              <p style={{ margin: 0 }}>{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 