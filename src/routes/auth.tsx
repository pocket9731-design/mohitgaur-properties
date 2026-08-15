import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { B } from "@/components/site/buttons";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const title = "Owner Sign In | Mohit Gaur Real Estate";
const description = "Secure sign-in for the site owner to manage property listings.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <Section>
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <p className="eyebrow">Owner access</p>
        <h1 className="mt-3 text-3xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is only for managing property listings.
        </p>

        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              autoComplete="email"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </label>
          <B type="submit" variant="gold" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </B>
        </form>

        <B type="button" variant="outline" className="mt-3 w-full" onClick={google}>
          Continue with Google
        </B>

        <button
          type="button"
          className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </Section>
  );
}
