import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm">
            <div className="mb-4 text-5xl">&#9888;</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Ceva nu a funcționat corect
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              A apărut o eroare neașteptată. Vă rugăm să încercați din nou sau să reveniți mai târziu.
            </p>
            {this.state.error && (
              <p className="mb-4 rounded bg-red-100 px-3 py-2 text-xs text-red-700">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Încercați din nou
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
