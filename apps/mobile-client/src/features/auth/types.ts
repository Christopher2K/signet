import type { LoginRequestWritable, SignupRequestWritable } from "@signet/api";

/** Server selection shared by native authentication forms. */
type ServerSelection = {
  serverUrl: string;
};

/** Credentials accepted by the native login form. */
export type LoginValues = LoginRequestWritable & ServerSelection;

/** Account details accepted by the native signup form. */
export type SignupValues = SignupRequestWritable & ServerSelection;
