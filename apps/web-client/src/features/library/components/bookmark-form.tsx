import type { CreateBookmarkRequest } from "@signet/api";
import { Button, TextField, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { type FormEvent, useEffect, useState } from "react";
import { css, html } from "react-strict-dom";
import { getBookmarkError } from "../bookmark-errors";
import {
  type BookmarkFormErrors,
  type BookmarkFormValues,
  emptyBookmarkValues,
  toBookmarkRequest,
  validateBookmark,
} from "../bookmark-validation";

/** Shared bookmark editor properties. */
export type BookmarkFormProps = {
  idPrefix: string;
  initialValues?: BookmarkFormValues;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: (request: CreateBookmarkRequest) => Promise<void>;
  pendingLabel?: string;
  submitLabel: string;
};

export const BookmarkForm = ({
  idPrefix,
  initialValues = emptyBookmarkValues,
  onCancel,
  onDelete,
  onSubmit,
  pendingLabel = "Saving…",
  submitLabel,
}: BookmarkFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<BookmarkFormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const updateValue = (field: keyof BookmarkFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return;
    }
    const errors = validateBookmark(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstField = ["url", "title", "image", "notes"].find(
        (field) => errors[field as keyof BookmarkFormErrors],
      );
      if (firstField) {
        document.getElementById(`${idPrefix}-${firstField}`)?.focus();
      }
      return;
    }
    setPending(true);
    setFormError(undefined);
    try {
      await onSubmit(toBookmarkRequest(values));
    } catch (error) {
      const bookmarkError = getBookmarkError(error);
      setFieldErrors(bookmarkError.fieldErrors);
      setFormError(
        Object.values(bookmarkError.fieldErrors).some(Boolean)
          ? undefined
          : bookmarkError.message,
      );
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    setPreviewFailed(false);
  }, [values.image]);

  return (
    <html.form
      {...{ noValidate: true, onSubmit: handleSubmit }}
      aria-busy={pending}
      style={styles.form}
    >
      <TextField
        autoComplete="url"
        autoFocus
        disabled={pending}
        error={fieldErrors.url}
        id={`${idPrefix}-url`}
        label="Link"
        name="url"
        onValueChange={(value) => updateValue("url", value)}
        placeholder="https://example.com/article"
        required
        type="url"
        value={values.url}
      />
      <TextField
        disabled={pending}
        error={fieldErrors.title}
        id={`${idPrefix}-title`}
        label="Title"
        maxLength={200}
        name="title"
        onValueChange={(value) => updateValue("title", value)}
        placeholder="Article title"
        required
        type="text"
        value={values.title}
      />
      <TextField
        disabled={pending}
        error={fieldErrors.image}
        id={`${idPrefix}-image`}
        label="Image URL (optional)"
        name="image"
        onValueChange={(value) => updateValue("image", value)}
        placeholder="https://example.com/image.jpg"
        type="url"
        value={values.image}
      />
      {values.image.trim() && !fieldErrors.image ? (
        <html.div style={styles.preview}>
          {previewFailed ? (
            <Typography tone="secondary" variant="caption">
              Image preview unavailable. You can still save this URL.
            </Typography>
          ) : (
            <html.img
              alt="Bookmark artwork preview"
              onError={() => setPreviewFailed(true)}
              src={values.image.trim()}
              style={styles.previewImage}
            />
          )}
        </html.div>
      ) : null}
      <html.div style={styles.textareaField}>
        <Typography
          as="label"
          for={`${idPrefix}-notes`}
          style={styles.label}
          tone="accent"
          variant="caption"
        >
          Notes (optional)
        </Typography>
        <html.textarea
          aria-describedby={
            fieldErrors.notes ? `${idPrefix}-notes-error` : undefined
          }
          aria-invalid={fieldErrors.notes ? true : undefined}
          disabled={pending}
          id={`${idPrefix}-notes`}
          maxLength={2000}
          name="notes"
          onChange={(event: { target: { value: string } }) =>
            updateValue("notes", event.target.value)
          }
          placeholder="Add notes"
          rows={4}
          style={[
            styles.textarea,
            Boolean(fieldErrors.notes) && styles.inputError,
          ]}
          value={values.notes}
        />
        {fieldErrors.notes ? (
          <Typography
            id={`${idPrefix}-notes-error`}
            role="alert"
            tone="danger"
            variant="caption"
          >
            {fieldErrors.notes}
          </Typography>
        ) : null}
      </html.div>
      <TextField
        disabled={pending}
        error={fieldErrors.tags}
        id={`${idPrefix}-tags`}
        label="Tags (optional)"
        name="tags"
        onValueChange={(value) => updateValue("tags", value)}
        placeholder="work, reading"
        type="text"
        value={values.tags}
      />
      <Typography tone="secondary" variant="caption">
        Separate tags with commas. Tags are trimmed and lower-cased.
      </Typography>
      {formError ? (
        <Typography role="alert" style={styles.error} tone="danger">
          {formError}
        </Typography>
      ) : null}
      <html.div style={styles.actions}>
        {onDelete ? (
          <Button
            disabled={pending}
            onClick={onDelete}
            style={[styles.delete, styles.actionButton]}
            type="button"
          >
            Delete
          </Button>
        ) : null}
        <html.div style={styles.actionGroup}>
          <Button
            disabled={pending}
            onClick={onCancel}
            style={styles.actionButton}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button disabled={pending} style={styles.actionButton} type="submit">
            {pending ? pendingLabel : submitLabel}
          </Button>
        </html.div>
      </html.div>
    </html.form>
  );
};

const styles = css.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  textareaField: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  label: {
    fontWeight: "700",
  },
  textarea: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    color: colors.text,
    fontFamily: "inherit",
    fontSize: 15,
    lineHeight: 1.5,
    minHeight: 104,
    outlineColor: colors.accent,
    padding: spacing[3],
    resize: "vertical",
    width: "100%",
  },
  inputError: {
    borderColor: colors.danger,
  },
  preview: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    display: "flex",
    justifyContent: "center",
    minHeight: 96,
    overflow: "hidden",
    padding: spacing[2],
  },
  previewImage: {
    borderRadius: radii.sm,
    maxHeight: 180,
    objectFit: "cover",
    width: "100%",
  },
  error: {
    lineHeight: 1.5,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexDirection: {
      default: "row",
      "@media (max-width: 600px)": "column-reverse",
    },
    gap: spacing[3],
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  actionGroup: {
    display: "flex",
    flexDirection: {
      default: "row",
      "@media (max-width: 600px)": "column",
    },
    gap: spacing[3],
    justifyContent: "flex-end",
    width: {
      default: "auto",
      "@media (max-width: 600px)": "100%",
    },
  },
  actionButton: {
    width: {
      default: "auto",
      "@media (max-width: 600px)": "100%",
    },
  },
  delete: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
});
