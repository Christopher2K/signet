import type { CreateBookmarkRequest } from "@signet/api";
import {
  type BookmarkFormErrors,
  type BookmarkFormValues,
  emptyBookmarkValues,
  getBookmarkError,
  toBookmarkRequest,
  validateBookmark,
} from "@signet/core/bookmarks";
import { Button, TextField, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { type FormEvent, useEffect, useState } from "react";
import { css, html } from "react-strict-dom";

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
  pendingLabel,
  submitLabel,
}: BookmarkFormProps) => {
  const { t } = useTranslation("web");
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
        error={fieldErrors.url ? t(fieldErrors.url) : undefined}
        id={`${idPrefix}-url`}
        label={t("library.form.link")}
        name="url"
        onValueChange={(value) => updateValue("url", value)}
        placeholder="https://example.com/article"
        required
        type="url"
        value={values.url}
      />
      <TextField
        disabled={pending}
        error={fieldErrors.title ? t(fieldErrors.title) : undefined}
        id={`${idPrefix}-title`}
        label={t("library.form.title")}
        maxLength={200}
        name="title"
        onValueChange={(value) => updateValue("title", value)}
        placeholder={t("library.form.titlePlaceholder")}
        required
        type="text"
        value={values.title}
      />
      <TextField
        disabled={pending}
        error={fieldErrors.image ? t(fieldErrors.image) : undefined}
        id={`${idPrefix}-image`}
        label={t("library.form.imageUrl")}
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
              {t("library.form.imagePreviewUnavailable")}
            </Typography>
          ) : (
            <html.img
              alt={t("library.form.imagePreviewAlt")}
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
          {t("library.form.notes")}
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
          placeholder={t("library.form.notesPlaceholder")}
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
            {t(fieldErrors.notes)}
          </Typography>
        ) : null}
      </html.div>
      <TextField
        disabled={pending}
        error={fieldErrors.tags ? t(fieldErrors.tags) : undefined}
        id={`${idPrefix}-tags`}
        label={t("library.form.tags")}
        name="tags"
        onValueChange={(value) => updateValue("tags", value)}
        placeholder={t("library.form.tagsPlaceholder")}
        type="text"
        value={values.tags}
      />
      <Typography tone="secondary" variant="caption">
        {t("library.form.tagsHelp")}
      </Typography>
      {formError ? (
        <Typography role="alert" style={styles.error} tone="danger">
          {t(formError)}
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
            {t("actions.delete")}
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
            {t("actions.cancel")}
          </Button>
          <Button disabled={pending} style={styles.actionButton} type="submit">
            {pending ? (pendingLabel ?? t("library.form.saving")) : submitLabel}
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
