import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const DEFAULT_REDIRECT = "/";

const SignInPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect_url") || DEFAULT_REDIRECT;
  const { isLoaded, signIn, setActive } = useSignIn();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success('Login successfully')
        navigate(redirectTo, { replace: true });
      } else {
        setError("Additional steps required. Please try another method.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "oauth_google") => {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sign-in",
      redirectUrlComplete: redirectTo,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Welcome back</p>
        </div>

        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or username</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={submitting || !isLoaded}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-6 text-center text-xs text-muted-foreground">OR</div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => handleOAuth("oauth_google")} disabled={!isLoaded}>
            Continue with Google
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don’t have an account? </span>
          <Button variant="link" className="px-1" onClick={() => navigate(`/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`)}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;


