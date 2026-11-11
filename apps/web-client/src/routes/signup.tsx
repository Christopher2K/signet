import { useTranslation } from "@signet/locale/react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "#/features/auth/components/auth-layout";
import { GuestRoute } from "#/features/auth/components/route-guards";
import { SignupForm } from "#/features/auth/components/signup-form";

const Signup = () => {
  const { t } = useTranslation("web");

  return (
    <GuestRoute>
      <AuthLayout
        footerLinkText={t("auth.signup.footerLink")}
        footerLinkTo="/login"
        footerQuestion={t("auth.signup.footerQuestion")}
        title={t("auth.signup.title")}
      >
        <SignupForm />
      </AuthLayout>
    </GuestRoute>
  );
};

export const Route = createFileRoute("/signup")({ component: Signup });
