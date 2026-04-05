import { Component } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Generic React Error Boundary — wraps children and catches render errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    if (errorInfo?.componentStack) {
      console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    }
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorDisplay
          error={this.state.error}
          componentStack={this.state.errorInfo?.componentStack ?? undefined}
          reset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * TanStack Router errorComponent — drop-in for `errorComponent` on any route.
 */
export function RouteErrorBoundary({ error, info, reset }: ErrorComponentProps) {
  console.error("[RouteErrorBoundary] Route error:", error);
  if (info?.componentStack) {
    console.error("[RouteErrorBoundary] Component stack:", info.componentStack);
  }

  return <ErrorDisplay error={error} componentStack={info?.componentStack} reset={reset} />;
}

interface ErrorDisplayProps {
  error: Error;
  componentStack?: string;
  reset: () => void;
}

function ErrorDisplay({ error, componentStack, reset }: ErrorDisplayProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-5xl font-bold text-gray-300 dark:text-gray-700">!</div>
        <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {isDev ? error.message : "An unexpected error occurred."}
        </p>

        <button
          onClick={reset}
          className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
        >
          Try again
        </button>

        {isDev && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-400">
              Error details (dev only)
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {error.stack ?? error.message}
            </pre>
            {componentStack && (
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {componentStack}
              </pre>
            )}
          </details>
        )}
      </div>
    </div>
  );
}
