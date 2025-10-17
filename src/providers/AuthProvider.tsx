import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: AuthProviderProps) {
  if (!publishableKey) {
    // Render children anyway to prevent hard crash in local dev without env
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}

export default AuthProvider;


