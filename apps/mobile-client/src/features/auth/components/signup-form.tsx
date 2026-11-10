import { Button, TextField, Typography } from "@signet/design-system";
import { nativeSpacing } from "@signet/design-system/native-theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";
import { useAuth } from "../auth-context";
import { toAuthError } from "../errors";
import { normalizeServerUrl } from "../server-url";
import type { SignupValues } from "../types";
import { type FormFieldErrors, validateSignup } from "../validation";

export const SignupForm = () => {
  const router = useRouter();
  const { serverUrl, signup } = useAuth();
  const [values, setValues] = useState<SignupValues>(() => ({
    email: "",
    name: "",
    password: "",
    serverUrl,
  }));
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<SignupValues>>(
    {},
  );
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);

  const updateValue = (field: keyof SignupValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(undefined);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const errors = validateSignup(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setPending(true);
    setFormError(undefined);
    try {
      await signup({
        ...values,
        email: values.email.trim(),
        name: values.name.trim(),
        serverUrl: normalizeServerUrl(values.serverUrl),
      });
      router.replace("/");
    } catch (error) {
      const authError = toAuthError(error);
      const serverFields: FormFieldErrors<SignupValues> = {
        email: authError.fieldErrors.email?.[0],
        name: authError.fieldErrors.name?.[0],
        password: authError.fieldErrors.password?.[0],
      };
      setFieldErrors(serverFields);
      setFormError(
        serverFields.email || serverFields.name || serverFields.password
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
          id="signup-server-url"
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
          autoComplete="name"
          disabled={pending}
          error={fieldErrors.name}
          id="signup-name"
          label="Name"
          maxLength={100}
          name="name"
          onValueChange={(value) => updateValue("name", value)}
          placeholder="Jane Doe"
          required
          style={strictStyles.input}
          type="text"
          value={values.name}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          disabled={pending}
          error={fieldErrors.email}
          id="signup-email"
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
          autoComplete="new-password"
          disabled={pending}
          error={fieldErrors.password}
          id="signup-password"
          label="Password"
          maxLength={128}
          name="password"
          onValueChange={(value) => updateValue("password", value)}
          required
          style={strictStyles.input}
          type="password"
          value={values.password}
        />
        <Typography as="p" tone="secondary" variant="caption">
          Use at least 12 characters.
        </Typography>
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
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </html.div>
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push("/login")}
        style={({ pressed }) => [styles.footer, pressed && styles.pressed]}
      >
        <Typography tone="secondary">
          Already have an account?{" "}
          <Typography style={strictStyles.link} tone="accent">
            Log in
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
