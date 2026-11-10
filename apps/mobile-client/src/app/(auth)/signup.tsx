import { AuthScreenLayout } from "../../features/auth/components/auth-screen-layout";
import { SignupForm } from "../../features/auth/components/signup-form";

const SignupScreen = () => (
  <AuthScreenLayout title="Create account">
    <SignupForm />
  </AuthScreenLayout>
);

export default SignupScreen;
