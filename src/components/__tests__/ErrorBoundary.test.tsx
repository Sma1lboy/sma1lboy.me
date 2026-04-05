import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary, RouteErrorBoundary } from "../ErrorBoundary";

function ThrowingComponent({ message }: { message: string }): React.ReactNode {
  throw new Error(message);
}

function GoodComponent() {
  return <div>All good</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("catches errors and shows fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("logs the error to console.error", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Logged error" />
      </ErrorBoundary>,
    );
    expect(console.error).toHaveBeenCalledWith(
      "[ErrorBoundary] Caught error:",
      expect.any(Error),
    );
  });

  it("resets error state when retry button is clicked", () => {
    let shouldThrow = true;

    function ConditionalThrow() {
      if (shouldThrow) throw new Error("Conditional error");
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByText("Try again"));

    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });

  it("shows error message in dev mode", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Dev visible error" />
      </ErrorBoundary>,
    );
    // In test environment, import.meta.env.DEV is true
    expect(screen.getByText("Dev visible error")).toBeInTheDocument();
  });

  it("shows error details in dev mode", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="Stack trace error" />
      </ErrorBoundary>,
    );
    // Dev mode should show collapsible details
    expect(screen.getByText("Error details (dev only)")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingComponent message="Custom" />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
  });
});

describe("RouteErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders error UI with retry button", () => {
    const reset = vi.fn();
    render(
      <RouteErrorBoundary
        error={new Error("Route error")}
        reset={reset}
      />,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("calls reset when retry is clicked", () => {
    const reset = vi.fn();
    render(
      <RouteErrorBoundary
        error={new Error("Route error")}
        reset={reset}
      />,
    );
    fireEvent.click(screen.getByText("Try again"));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("logs route error to console", () => {
    const error = new Error("Route console error");
    render(
      <RouteErrorBoundary error={error} reset={() => {}} />,
    );
    expect(console.error).toHaveBeenCalledWith(
      "[RouteErrorBoundary] Route error:",
      error,
    );
  });

  it("shows component stack in dev mode when provided", () => {
    render(
      <RouteErrorBoundary
        error={new Error("With stack")}
        info={{ componentStack: "at BrokenComponent\nat App" }}
        reset={() => {}}
      />,
    );
    expect(screen.getByText("Error details (dev only)")).toBeInTheDocument();
  });

  it("shows error message in dev mode", () => {
    render(
      <RouteErrorBoundary
        error={new Error("Dev route error message")}
        reset={() => {}}
      />,
    );
    expect(screen.getByText("Dev route error message")).toBeInTheDocument();
  });
});
