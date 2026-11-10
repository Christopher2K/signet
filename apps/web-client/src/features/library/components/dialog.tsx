import { Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { css, html } from "react-strict-dom";
import { Icon } from "./icon";

/** Accessible modal dialog properties. */
export type DialogProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
};

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Dialog = ({ children, onClose, title }: DialogProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!panelRef.current?.contains(document.activeElement)) {
      panelRef.current?.focus();
    }
    const handleKeyboard = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyboard);
      previousFocus?.focus();
    };
  }, []);

  return (
    <html.div style={styles.backdrop}>
      <html.div
        aria-labelledby={titleId}
        aria-modal={true}
        ref={panelRef}
        role="dialog"
        style={styles.panel}
        tabIndex={-1}
      >
        <html.div style={styles.header}>
          <Typography as="h2" id={titleId} variant="title">
            {title}
          </Typography>
          <html.button
            aria-label="Close dialog"
            onClick={onClose}
            style={styles.close}
            type="button"
          >
            <Icon name="x" />
          </html.button>
        </html.div>
        {children}
      </html.div>
    </html.div>
  );
};

const styles = css.create({
  backdrop: {
    alignItems: {
      default: "center",
      "@media (max-width: 600px)": "flex-end",
    },
    backgroundColor: "rgba(60, 55, 68, 0.6)",
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    left: 0,
    padding: {
      default: spacing[6],
      "@media (max-width: 600px)": 0,
    },
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 20,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: {
      default: radii.card,
      "@media (max-width: 600px)": radii.lg,
    },
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    maxHeight: {
      default: "calc(100vh - 48px)",
      "@media (max-width: 600px)": "92vh",
    },
    maxWidth: 560,
    outlineStyle: "none",
    overflow: "auto",
    padding: {
      default: spacing[6],
      "@media (max-width: 600px)": spacing[4],
    },
    width: "100%",
  },
  header: {
    alignItems: "center",
    display: "flex",
    gap: spacing[4],
    justifyContent: "space-between",
  },
  close: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: radii.md,
    color: colors.text,
    cursor: "pointer",
    display: "flex",
    height: 36,
    justifyContent: "center",
    padding: 0,
    width: 36,
  },
});
