import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "#/features/auth/components/auth-layout";
import { GuestRoute } from "#/features/auth/components/route-guards";
import { SignupForm } from "#/features/auth/components/signup-form";

const Signup = () => {
  return (
    <GuestRoute>
      <AuthLayout
        footerLinkText="Log in"
        footerLinkTo="/login"
        footerQuestion="Already have an account?"
        title="Create account"
      >
        <SignupForm />
      </AuthLayout>
    </GuestRoute>
  );
};

export const Route = createFileRoute("/signup")({ component: Signup });
