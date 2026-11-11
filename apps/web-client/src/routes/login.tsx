import { useTranslation } from "@signet/locale/react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "#/features/auth/components/auth-layout";
import { LoginForm } from "#/features/auth/components/login-form";
import { GuestRoute } from "#/features/auth/components/route-guards";

const Login = () => {
  const { t } = useTranslation("web");

  return (
    <GuestRoute>
      <AuthLayout
        footerLinkText={t("auth.login.footerLink")}
        footerLinkTo="/signup"
        footerQuestion={t("auth.login.footerQuestion")}
        title={t("auth.login.title")}
      >
        <LoginForm />
      </AuthLayout>
    </GuestRoute>
  );
};

export const Route = createFileRoute("/login")({ component: Login });
