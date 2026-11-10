import type {
  LoginRequestWritable,
  SignupRequestWritable,
  User,
} from "@signet/api";

/** Authenticated bearer session returned by the API. */
export type AuthSession = {
  token: string;
  user: User;
};

/** Credentials accepted by the login form. */
export type LoginValues = LoginRequestWritable;

/** Account details accepted by the signup form. */
export type SignupValues = SignupRequestWritable;

/** Authentication operations used by the web client. */
export type AuthApi = {
  login: (values: LoginValues) => Promise<AuthSession>;
  signup: (values: SignupValues) => Promise<AuthSession>;
  currentUser: () => Promise<User>;
  logout: () => Promise<void>;
};

/** Session state shared by route guards and authenticated screens. */
export type AuthState =
  | { status: "restoring"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated"; user: null }
  | { status: "unavailable"; user: null; message: string };

/** Authentication state and operations exposed by the auth provider. */
export type AuthContextValue = {
  state: AuthState;
  login: (values: LoginValues) => Promise<void>;
  signup: (values: SignupValues) => Promise<void>;
  logout: () => Promise<void>;
  retryRestore: () => void;
};
