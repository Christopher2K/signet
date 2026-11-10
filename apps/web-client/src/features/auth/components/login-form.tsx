import { Button, TextField, Typography } from "@signet/design-system";
import { spacing } from "@signet/design-system/tokens.css";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { css, html } from "react-strict-dom";
import { useAuth } from "../auth-context";
import { toAuthError } from "../errors";
import type { LoginValues } from "../types";
import { type FormFieldErrors, validateLogin } from "../validation";

const initialValues: LoginValues = { email: "", password: "" };

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState(initialValues);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateLogin(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setPending(true);
    setFormError(undefined);
    try {
      await login({ ...values, email: values.email.trim() });
      await navigate({ to: "/", replace: true });
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
    <html.form
      {...{ noValidate: true, onSubmit: handleSubmit }}
      aria-busy={pending}
      style={styles.form}
    >
      <TextField
        autoComplete="email"
        disabled={pending}
        error={fieldErrors.email}
        id="login-email"
        label="Email"
        name="email"
        onValueChange={(value) => updateValue("email", value)}
        placeholder="name@example.com"
        required
        type="email"
        value={values.email}
      />
      <TextField
        autoComplete="current-password"
        disabled={pending}
        error={fieldErrors.password}
        id="login-password"
        label="Password"
        maxLength={128}
        name="password"
        onValueChange={(value) => updateValue("password", value)}
        required
        type="password"
        value={values.password}
      />
      {formError ? (
        <Typography
          as="p"
          role="alert"
          style={styles.error}
          tone="danger"
          variant="caption"
        >
          {formError}
        </Typography>
      ) : null}
      <Button disabled={pending} size="lg" style={styles.submit} type="submit">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </html.form>
  );
};

const styles = css.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    width: "100%",
  },
  error: {
    lineHeight: 1.5,
  },
  submit: {
    alignSelf: "stretch",
    marginTop: spacing[2],
  },
});
