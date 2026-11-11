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

/** Optional server selection accepted by authentication operations. */
export type ServerSelection = {
  serverUrl?: string;
};

/** Credentials accepted by the login form. */
export type LoginValues = LoginRequestWritable & ServerSelection;

/** Account details accepted by the signup form. */
export type SignupValues = SignupRequestWritable & ServerSelection;

/** Authentication operations used by the clients. */
export type AuthApi = {
  login: (values: LoginRequestWritable) => Promise<AuthSession>;
  signup: (values: SignupRequestWritable) => Promise<AuthSession>;
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
  serverUrl: string;
  login: (values: LoginValues) => Promise<void>;
  signup: (values: SignupValues) => Promise<void>;
  logout: () => Promise<void>;
  retryRestore: () => void;
};
