import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import ConnectorsPage from "./pages/ConnectorsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import JobsPage from "./pages/JobsPage";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import OrganizationManagementPage from "./pages/organization/OrganizationManagementPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { OrganizationSelector } from "./components/OrganizationSelector";
import "./i18n";
import { AdminRoute } from "./components/AdminRoute";
import InvitationPage from "./pages/InvitationPage";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const RedirectToLocalSignIn = () => {
  const location = useLocation();
  const redirectUrl = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/sign-in?redirect_url=${redirectUrl}`} replace />;
};

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/invitation" element={<InvitationPage />} />
            <Route path="/" element={<OrganizationSelector />} />
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <RootLayout />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToLocalSignIn />
                  </SignedOut>
                </>
              }
            >
              <Route index element={<Navigate to="/connectors" replace />} />
              <Route path="connectors" element={<ConnectorsPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="organization"
                element={
                  <AdminRoute>
                    <OrganizationManagementPage />
                  </AdminRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
