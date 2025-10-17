import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSignUp, useOrganizationList, useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icon từ lucide-react
import { wait } from "@/lib/utils";

const DEFAULT_REDIRECT = "/";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect_url") || DEFAULT_REDIRECT;

  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: orgLoaded, createOrganization } = useOrganizationList();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        const createdSessionId = result.createdSessionId;
        if (createdSessionId) await setActive({ session: createdSessionId });
        let waited = 0;
        const maxWait = 1000;
        const step = 150;
        while (!(userLoaded && user?.id) && waited < maxWait) {
          await wait(step);
          waited += step;
        }
        setIsCreatingOrganization(true);
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  async function handleAutoCreateOrganization({
    email,
    createOrganization,
    setActive,
    signOut,
    navigate,
    redirectTo,
    setIsCreatingOrganization,
  }: {
    email?: string;
    createOrganization: (data: { name: string; slug: string }) => Promise<any>;
    setActive: (opts: { organization: any }) => Promise<void>;
    signOut: () => Promise<void>;
    navigate: (path: string, opts?: { replace?: boolean }) => void;
    redirectTo?: string;
    setIsCreatingOrganization: (value: boolean) => void;
  }) {
    try {
      const local = (email?.split("@")[0] || "org").trim();
      const baseName =
        local.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim() || "Organization";
      const slugBase =
        local.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "org";
      const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;
      const newOrg = await createOrganization({ name: baseName, slug });
      await new Promise((r) => setTimeout(r, 1500));
      await setActive({ organization: newOrg });
      await signOut();
      setIsCreatingOrganization(false);
      navigate(redirectTo || "/", { replace: true });
    } catch (err) {
      console.error("❌ Error creating organization:", err);
      setIsCreatingOrganization(false);
    }
  }

  const handleOAuth = async (provider: "oauth_google") => {
    if (!signUpLoaded) return;
    await signUp.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sign-up",
      redirectUrlComplete: redirectTo,
    });
  };

  useEffect(() => {
    if (!isCreatingOrganization || !orgLoaded || !createOrganization) return;
    handleAutoCreateOrganization({
      email,
      createOrganization,
      setActive,
      signOut,
      navigate,
      redirectTo,
      setIsCreatingOrganization,
    });
  }, [isCreatingOrganization, orgLoaded, createOrganization, email]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-muted-foreground">Get started in seconds</p>
        </div>

        {!pendingVerification ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={submitting || !signUpLoaded}>
              {submitting ? "Creating..." : "Create account"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={submitting || !signUpLoaded}>
              {submitting ? "Verifying..." : "Verify email"}
            </Button>
          </form>
        )}

        {!pendingVerification && (
          <>
            <div className="my-6 text-center text-xs text-muted-foreground">OR</div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("oauth_google")}
                disabled={!signUpLoaded}
              >
                Continue with Google
              </Button>
            </div>
          </>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button
            variant="link"
            className="px-1"
            onClick={() =>
              navigate(`/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`)
            }
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
