import { Button, TextField, Typography } from "@signet/design-system";
import { nativeSpacing } from "@signet/design-system/native-theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";
import { useAuth } from "../auth-context";
import { toAuthError } from "../errors";
import { normalizeServerUrl } from "../server-url";
import type { LoginValues } from "../types";
import { type FormFieldErrors, validateLogin } from "../validation";

export const LoginForm = () => {
  const router = useRouter();
  const { login, serverUrl } = useAuth();
  const [values, setValues] = useState<LoginValues>(() => ({
    email: "",
    password: "",
    serverUrl,
  }));
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<LoginValues>>(
    {},
  );
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);

  const updateValue = (field: keyof LoginValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(undefined);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const errors = validateLogin(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setPending(true);
    setFormError(undefined);
    try {
      await login({
        ...values,
        email: values.email.trim(),
        serverUrl: normalizeServerUrl(values.serverUrl),
      });
      router.replace("/");
    } catch (error) {
      const authError = toAuthError(error);
      const serverFields: FormFieldErrors<LoginValues> = {
        email: authError.fieldErrors.email?.[0],
        password: authError.fieldErrors.password?.[0],
      };
      setFieldErrors(serverFields);
      setFormError(
        serverFields.email || serverFields.password
          ? undefined
          : authError.message,
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <html.div aria-busy={pending} style={strictStyles.form}>
        <TextField
          autoCapitalize="none"
          autoComplete="off"
          disabled={pending}
          error={fieldErrors.serverUrl}
          id="login-server-url"
          label="Server URL"
          name="serverUrl"
          onValueChange={(value) => updateValue("serverUrl", value)}
          placeholder="https://signet.example.com"
          required
          style={strictStyles.input}
          type="url"
          value={values.serverUrl}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          disabled={pending}
          error={fieldErrors.email}
          id="login-email"
          label="Email"
          name="email"
          onValueChange={(value) => updateValue("email", value)}
          placeholder="name@example.com"
          required
          style={strictStyles.input}
          type="email"
          value={values.email}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="current-password"
          disabled={pending}
          error={fieldErrors.password}
          id="login-password"
          label="Password"
          maxLength={128}
          name="password"
          onValueChange={(value) => updateValue("password", value)}
          required
          style={strictStyles.input}
          type="password"
          value={values.password}
        />
        {formError ? (
          <Typography
            as="p"
            role="alert"
            style={strictStyles.error}
            tone="danger"
            variant="caption"
          >
            {formError}
          </Typography>
        ) : null}
        <Button
          disabled={pending}
          onClick={() => void handleSubmit()}
          size="lg"
          style={strictStyles.submit}
        >
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </html.div>
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push("/signup")}
        style={({ pressed }) => [styles.footer, pressed && styles.pressed]}
      >
        <Typography tone="secondary">
          New to Signet?{" "}
          <Typography style={strictStyles.link} tone="accent">
            Create account
          </Typography>
        </Typography>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});

const strictStyles = css.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: nativeSpacing[4],
    width: "100%",
  },
  input: {
    borderRadius: 12,
    minHeight: 48,
  },
  error: {
    lineHeight: 1.5,
  },
  submit: {
    alignSelf: "stretch",
    borderRadius: 12,
    marginTop: nativeSpacing[2],
  },
  link: {
    fontWeight: "700",
  },
});
