import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSignUp, useSignIn, useOrganization } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const InvitationPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("__clerk_ticket");
  const accountStatus = params.get("__clerk_status"); // 'sign_up' | 'sign_in'
  const redirectTo = "/";

  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { organization } = useOrganization();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) return <p>No invitation token found.</p>;

  // Auto sign-in if already invited user
  useEffect(() => {
    if (!signInLoaded || !token || organization || accountStatus !== "sign_in") return;

    const handleSignIn = async () => {
      try {
        const attempt = await signIn.create({ strategy: "ticket", ticket: token });
        if (attempt.status === "complete") {
          await setActiveSignIn({ session: attempt.createdSessionId });
          navigate(redirectTo, { replace: true });
        } else {
          console.error("Sign-in not complete:", attempt);
        }
      } catch (err) {
        console.error("Sign-in error:", err);
      }
    };

    handleSignIn();
  }, [signInLoaded]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const attempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        firstName,
        lastName,
        password,
      });

      if (attempt.status === "complete") {
        await setActiveSignUp({ session: attempt.createdSessionId });
        navigate(redirectTo, { replace: true });
      } else {
        console.error("Sign-up not complete:", attempt);
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign-up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (accountStatus === "sign_in" && !organization) {
    return <div>Signing you in...</div>;
  }

  if (accountStatus === "sign_up" && !organization) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Sign up to join organization
          </h1>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            {/* Password field */}
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Confirm Password field */}
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing up..." : "Join Organization"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <div>Invitation accepted! Redirecting...</div>;
};

export default InvitationPage;
