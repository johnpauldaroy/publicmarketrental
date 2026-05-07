import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/auth-context";
import { VendorWorkspaceProvider } from "@/features/vendor/vendor-workspace-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VendorWorkspaceProvider>
          {children}
          <Toaster position="top-right" richColors />
        </VendorWorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
