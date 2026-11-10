import type { ComponentPropsWithoutRef } from "react";
import { css, html } from "react-strict-dom";
import { colors, radii, spacing, typography } from "../tokens.css";
import { Typography } from "./typography";

type StrictInputProps = ComponentPropsWithoutRef<typeof html.input>;

/** Cross-platform labeled text input properties. */
export type TextFieldProps = Omit<StrictInputProps, "id" | "onChange"> & {
  /** Stable input and error-message identifier prefix. */
  id: string;
  /** Visible input label. */
  label: string;
  /** Validation message associated with the input. */
  error?: string;
  /** Receives the edited text on web and native. */
  onValueChange: (value: string) => void;
};

export const TextField = ({
  disabled = false,
  error,
  id,
  label,
  onValueChange,
  style,
  ...props
}: TextFieldProps) => {
  const errorId = `${id}-error`;
  const handleChange = (event: unknown) => {
    const change = event as {
      target?: { value?: string };
      nativeEvent?: { text?: string };
    };
    onValueChange(change.target?.value ?? change.nativeEvent?.text ?? "");
  };

  return (
    <html.div style={[styles.field, disabled && styles.disabled]}>
      <Typography
        as="label"
        for={id}
        style={styles.label}
        tone="accent"
        variant="caption"
      >
        {label}
      </Typography>
      <html.input
        {...props}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        id={id}
        onChange={handleChange}
        style={[styles.input, Boolean(error) && styles.inputError, style]}
      />
      {error ? (
        <Typography id={errorId} role="alert" tone="danger" variant="caption">
          {error}
        </Typography>
      ) : null}
    </html.div>
  );
};

const styles = css.create({
  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
    width: "100%",
  },
  label: {
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodySize,
    minHeight: 44,
    "@media (pointer: fine)": {
      outlineColor: colors.accent,
      outlineOffset: 2,
      outlineStyle: "solid",
      outlineWidth: {
        default: 0,
        ":focus-visible": 2,
      },
    },
    paddingBlock: spacing[3],
    paddingInline: spacing[3],
    width: "100%",
  },
  inputError: {
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.6,
  },
});
