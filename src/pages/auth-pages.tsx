import { Link } from "react-router-dom";
import { LoginForm, RegisterForm, ForgotPasswordForm } from "@/features/auth/forms";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-3xl text-foreground">Sign in</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your account credentials to continue.
        </p>
      </div>
      <LoginForm />
      {!isSupabaseConfigured ? (
        <p className="text-sm text-destructive">
          Supabase is not configured. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
        </p>
      ) : null}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Link className="font-medium text-primary" to="/forgot-password">
          Forgot password
        </Link>
        <Link className="font-medium text-primary" to="/register">
          Create vendor account
        </Link>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-3xl text-foreground">Vendor registration</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Create a live vendor account backed by Supabase Auth and PostgreSQL records.
        </p>
      </div>
      <RegisterForm />
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-primary" to="/login">
          Return to sign in
        </Link>
      </p>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-3xl text-foreground">Password recovery</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Request a password reset email through Supabase Auth.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-sm text-muted-foreground">
        <Link className="font-medium text-primary" to="/login">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
