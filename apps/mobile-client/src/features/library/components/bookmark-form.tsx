import type { CreateBookmarkRequest } from "@signet/api";
import {
  type BookmarkFormErrors,
  type BookmarkFormValues,
  emptyBookmarkValues,
  getBookmarkError,
  toBookmarkRequest,
  validateBookmark,
} from "@signet/core/bookmarks";
import {
  Button,
  colors,
  radii,
  spacing,
  TextField,
  Typography,
  typography,
} from "@signet/design-system";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";

/** Native bookmark editor properties. */
type BookmarkFormProps = {
  deleteError?: string;
  deletePending?: boolean;
  initialValues?: BookmarkFormValues;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: (request: CreateBookmarkRequest) => Promise<void>;
  pendingLabel?: string;
  submitLabel: string;
};

export const BookmarkForm = ({
  deleteError,
  deletePending = false,
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
  const busy = pending || deletePending;

  const updateValue = (field: keyof BookmarkFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(undefined);
  };

  const handleNotesChange = (event: unknown) => {
    const change = event as {
      target?: { value?: string };
      nativeEvent?: { text?: string };
    };
    updateValue(
      "notes",
      change.target?.value ?? change.nativeEvent?.text ?? "",
    );
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (busy) {
      return;
    }
    const errors = validateBookmark(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
    <html.div
      aria-busy={busy}
      data-layoutconformance="strict"
      style={styles.form}
    >
      <TextField
        autoCapitalize="none"
        autoComplete="url"
        autoFocus
        disabled={busy}
        error={fieldErrors.url}
        id="native-bookmark-url"
        label="Link"
        onValueChange={(value) => updateValue("url", value)}
        placeholder="https://example.com/article"
        required
        style={styles.input}
        type="url"
        value={values.url}
      />
      <TextField
        disabled={busy}
        error={fieldErrors.title}
        id="native-bookmark-title"
        label="Title"
        maxLength={200}
        onValueChange={(value) => updateValue("title", value)}
        placeholder="Article title"
        required
        style={styles.input}
        value={values.title}
      />
      <TextField
        autoCapitalize="none"
        autoComplete="off"
        disabled={busy}
        error={fieldErrors.image}
        id="native-bookmark-image"
        label="Image URL (optional)"
        onValueChange={(value) => updateValue("image", value)}
        placeholder="https://example.com/image.jpg"
        style={styles.input}
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
            <Image
              accessibilityLabel="Bookmark artwork preview"
              contentFit="cover"
              onError={() => setPreviewFailed(true)}
              source={{ uri: values.image.trim() }}
              style={nativeStyles.previewImage}
            />
          )}
        </html.div>
      ) : null}
      <html.div style={styles.notesField}>
        <Typography
          as="label"
          for="native-bookmark-notes"
          style={styles.label}
          tone="accent"
          variant="caption"
        >
          Notes (optional)
        </Typography>
        <html.textarea
          aria-describedby={
            fieldErrors.notes ? "native-bookmark-notes-error" : undefined
          }
          aria-invalid={fieldErrors.notes ? true : undefined}
          disabled={busy}
          id="native-bookmark-notes"
          maxLength={2000}
          onChange={handleNotesChange}
          placeholder="Add notes"
          rows={4}
          style={[
            styles.input,
            styles.notes,
            Boolean(fieldErrors.notes) && styles.inputError,
          ]}
          value={values.notes}
        />
        {fieldErrors.notes ? (
          <Typography
            id="native-bookmark-notes-error"
            role="alert"
            tone="danger"
            variant="caption"
          >
            {fieldErrors.notes}
          </Typography>
        ) : null}
      </html.div>
      <TextField
        autoCapitalize="none"
        autoComplete="off"
        disabled={busy}
        error={fieldErrors.tags}
        id="native-bookmark-tags"
        label="Tags (optional)"
        onValueChange={(value) => updateValue("tags", value)}
        placeholder="work, reading"
        style={styles.input}
        value={values.tags}
      />
      <Typography tone="secondary" variant="caption">
        Separate tags with commas. Tags are trimmed and lower-cased.
      </Typography>
      {formError || deleteError ? (
        <Typography role="alert" style={styles.error} tone="danger">
          {formError ?? deleteError}
        </Typography>
      ) : null}
      <html.div style={styles.actions}>
        <Button
          disabled={busy}
          onClick={() => void handleSubmit()}
          size="lg"
          style={styles.action}
        >
          {pending ? pendingLabel : submitLabel}
        </Button>
        <Button
          disabled={busy}
          onClick={onCancel}
          size="lg"
          style={styles.action}
          variant="secondary"
        >
          Cancel
        </Button>
        {onDelete ? (
          <Button
            disabled={busy}
            onClick={onDelete}
            size="lg"
            style={[styles.action, styles.delete]}
          >
            {deletePending ? "Deleting…" : "Delete"}
          </Button>
        ) : null}
      </html.div>
    </html.div>
  );
};

const nativeStyles = StyleSheet.create({
  previewImage: {
    borderRadius: 8,
    height: 160,
    width: "100%",
  },
});

const styles = css.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    width: "100%",
  },
  input: {
    borderRadius: radii.lg,
    minHeight: 48,
  },
  notesField: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  label: {
    fontWeight: "700",
  },
  notes: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodySize,
    minHeight: 112,
    padding: spacing[3],
    textAlignVertical: "top",
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
  error: {
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    marginTop: spacing[2],
  },
  action: {
    alignSelf: "stretch",
    borderRadius: radii.lg,
  },
  delete: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
});
