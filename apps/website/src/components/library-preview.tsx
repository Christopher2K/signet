import {
  CheckCircle,
  Folder,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { useTranslation } from "@signet/locale/react";
import { Logo } from "#/components/logo";

const artworkLabel = "OG";
const firstBookmarkUrl = "github.com/Christopher2K/signet";
const secondBookmarkUrl = "docs.docker.com/compose";

export const LibraryPreview = () => {
  const { t } = useTranslation("web");

  return (
    <section
      className="library-preview page-shell"
      aria-label={t("marketing.preview.label")}
    >
      <div className="preview-topbar">
        <div className="preview-brand">
          <Logo />
        </div>
        <div className="preview-search">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span>{t("marketing.preview.searchPlaceholder")}</span>
        </div>
        <span className="sync-status">
          <CheckCircle size={16} weight="fill" aria-hidden="true" />
          {t("marketing.preview.synced")}
        </span>
        <span className="preview-new-button">{t("actions.newBookmark")}</span>
      </div>
      <div className="preview-body">
        <aside className="preview-sidebar">
          <p className="mini-label">{t("marketing.preview.collection")}</p>
          <div className="folder-row folder-row-active">
            <Folder size={17} weight="fill" aria-hidden="true" />
            <span>{t("marketing.preview.allBookmarks")}</span>
            <span>{12}</span>
          </div>
          <div className="folder-row">
            <Folder size={17} aria-hidden="true" />
            <span>{t("marketing.preview.work")}</span>
            <span>{5}</span>
          </div>
          <div className="folder-row">
            <Folder size={17} aria-hidden="true" />
            <span>{t("marketing.preview.reading")}</span>
            <span>{4}</span>
          </div>
          <div className="folder-row">
            <Folder size={17} aria-hidden="true" />
            <span>{t("marketing.preview.selfHosting")}</span>
            <span>{3}</span>
          </div>
          <div className="new-folder">
            <Plus size={16} aria-hidden="true" />
            <span>{t("marketing.preview.newFolder")}</span>
          </div>
        </aside>
        <div className="preview-content">
          <div className="preview-content-header">
            <h2>{t("marketing.preview.allBookmarks")}</h2>
            <span className="preview-count">
              {t("marketing.preview.bookmarkCount")}
            </span>
          </div>
          <div className="preview-filters">
            <span className="filter-chip">{t("marketing.preview.work")}</span>
            <span className="filter-chip">
              {t("marketing.preview.reading")}
            </span>
            <span className="filter-chip">
              {t("marketing.preview.selfHosting")}
            </span>
          </div>
          <article className="bookmark-card">
            <div className="bookmark-art">{artworkLabel}</div>
            <div className="bookmark-copy">
              <h3>{t("marketing.preview.firstTitle")}</h3>
              <p className="bookmark-url">{firstBookmarkUrl}</p>
              <p>{t("marketing.preview.firstDescription")}</p>
              <div className="bookmark-tags">
                <span className="bookmark-tag">
                  {t("marketing.preview.work")}
                </span>
                <span className="bookmark-tag">
                  {t("marketing.preview.reading")}
                </span>
              </div>
              <p className="bookmark-folder">
                {t("marketing.preview.firstFolder")}
              </p>
            </div>
          </article>
          <article className="bookmark-card">
            <div className="bookmark-art">{artworkLabel}</div>
            <div className="bookmark-copy">
              <h3>{t("marketing.preview.secondTitle")}</h3>
              <p className="bookmark-url">{secondBookmarkUrl}</p>
              <p>{t("marketing.preview.secondDescription")}</p>
              <div className="bookmark-tags">
                <span className="bookmark-tag">
                  {t("marketing.preview.reference")}
                </span>
                <span className="bookmark-tag">
                  {t("marketing.preview.selfHosting")}
                </span>
                <span className="bookmark-tag pending-tag">
                  {t("marketing.preview.pendingSync")}
                </span>
              </div>
              <p className="bookmark-folder">
                {t("marketing.preview.secondFolder")}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
