import { Button, TextField, Typography } from "@signet/design-system";
import { spacing } from "@signet/design-system/tokens.css";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { css, html } from "react-strict-dom";
import { useAuth } from "../auth-context";
import { toAuthError } from "../errors";
import type { SignupValues } from "../types";
import { type FormFieldErrors, validateSignup } from "../validation";

const initialValues: SignupValues = { email: "", name: "", password: "" };

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [values, setValues] = useState(initialValues);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      });
      await navigate({ to: "/", replace: true });
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
    <html.form
      {...{ noValidate: true, onSubmit: handleSubmit }}
      aria-busy={pending}
      style={styles.form}
    >
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
        type="text"
        value={values.name}
      />
      <TextField
        autoComplete="email"
        disabled={pending}
        error={fieldErrors.email}
        id="signup-email"
        label="Email"
        name="email"
        onValueChange={(value) => updateValue("email", value)}
        placeholder="name@example.com"
        required
        type="email"
        value={values.email}
      />
      <TextField
        autoComplete="new-password"
        disabled={pending}
        error={fieldErrors.password}
        id="signup-password"
        label="Password"
        maxLength={128}
        minLength={12}
        name="password"
        onValueChange={(value) => updateValue("password", value)}
        required
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
          style={styles.error}
          tone="danger"
          variant="caption"
        >
          {formError}
        </Typography>
      ) : null}
      <Button disabled={pending} size="lg" style={styles.submit} type="submit">
        {pending ? "Creating account…" : "Create account"}
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
