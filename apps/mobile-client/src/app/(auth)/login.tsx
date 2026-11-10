import { AuthScreenLayout } from "../../features/auth/components/auth-screen-layout";
import { LoginForm } from "../../features/auth/components/login-form";

const LoginScreen = () => (
  <AuthScreenLayout title="Log in">
    <LoginForm />
  </AuthScreenLayout>
);

export default LoginScreen;
