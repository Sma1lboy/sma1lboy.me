import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { startGitHubDataSync, stopGitHubDataSync } from "./services/githubApi";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  useEffect(() => {
    // Start GitHub data synchronization on app startup
    startGitHubDataSync();
    
    // Cleanup on app unmount
    return () => {
      stopGitHubDataSync();
    };
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
