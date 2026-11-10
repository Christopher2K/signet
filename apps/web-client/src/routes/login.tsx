import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "#/features/auth/components/auth-layout";
import { LoginForm } from "#/features/auth/components/login-form";
import { GuestRoute } from "#/features/auth/components/route-guards";

const Login = () => {
  return (
    <GuestRoute>
      <AuthLayout
        footerLinkText="Create account"
        footerLinkTo="/signup"
        footerQuestion="New to Signet?"
        title="Log in"
      >
        <LoginForm />
      </AuthLayout>
    </GuestRoute>
  );
};

export const Route = createFileRoute("/login")({ component: Login });
