export const web = {
  actions: {
    backToForm: "Back to form",
    cancel: "Cancel",
    closeDialog: "Close dialog",
    delete: "Delete",
    new: "New",
    newBookmark: "New Bookmark",
    openExisting: "Open existing",
    save: "Save",
    saveAnyway: "Save anyway",
    saveChanges: "Save changes",
    tryAgain: "Try again",
  },
  auth: {
    fields: {
      email: "Email",
      name: "Name",
      password: "Password",
    },
    login: {
      footerLink: "Create account",
      footerQuestion: "New to Signet?",
      pending: "Logging in…",
      title: "Log in",
    },
    placeholders: {
      email: "name@example.com",
      name: "Jane Doe",
    },
    session: {
      checking: "Checking your saved session with the server.",
      restoring: "Restoring your session…",
      unavailable: "Server unavailable",
    },
    signup: {
      footerLink: "Log in",
      footerQuestion: "Already have an account?",
      passwordHint: "Use at least 12 characters.",
      pending: "Creating account…",
      title: "Create account",
    },
  },
  marketing: {
    nav: {
      features: "Features",
      howItWorks: "How it works",
      selfHost: "Self-host",
    },
    hero: {
      eyebrow: "Self-hosted bookmark sync",
      titleStart: "Your bookmarks.",
      titleEnd: "Everywhere. Yours.",
      description:
        "One self-hosted collection across web, browser and phone. Capture quickly, organize deeply, and keep every client connected to the server you control.",
      primaryAction: "Self-host with Docker",
      secondaryAction: "View GitHub",
      note: "No central Signet cloud. Your server is the source of truth for every client.",
    },
    clients: {
      titleStart: "One server",
      titleEnd: "Every client",
      webLabel: "Web",
      webDescription:
        "Full bookmark manager, search, import and public-link controls.",
      browserLabel: "Browser",
      browserDescription:
        "Save the current tab and mirror a folder with the native bookmark bar.",
      phoneLabel: "Phone",
      phoneDescription:
        "Share-sheet capture, offline edits and the same synced collection.",
    },
    preview: {
      label: "Signet library preview",
      searchPlaceholder: "Search title, notes, tags or URL",
      synced: "Synced · just now",
      collection: "Collection",
      allBookmarks: "All bookmarks",
      bookmarkCount: "12 bookmarks",
      work: "Work",
      reading: "Reading",
      selfHosting: "Self-hosting",
      newFolder: "New Folder",
      firstTitle: "Signet — self-hosted bookmarks",
      firstDescription:
        "Project repository, release notes and self-hosting documentation.",
      firstFolder: "Folder: Guide / Self-hosting",
      secondTitle: "Docker Compose overview",
      secondDescription:
        "Reference for pulling images and running the local stack.",
      reference: "reference",
      pendingSync: "Pending sync",
      secondFolder: "Folder: Work / Infrastructure",
    },
    platforms: {
      webLabel: "Web",
      webValue: "Full management",
      browserLabel: "Browser",
      browserValue: "Capture + bookmark-bar sync",
      phoneLabel: "Phone",
      phoneValue: "Share Sheet + offline queue",
      serverLabel: "Your server",
      serverValue: "Multi-user · no telemetry",
    },
    features: {
      eyebrow: "The system",
      title: "A library that stays with you.",
      description:
        "Signet combines fast capture with the management tools that make a growing collection useful.",
      syncTitle: "Real-time sync, without refresh.",
      syncDescription:
        "Your server pushes creates, edits and deletes to connected clients. Reconnects fetch the delta and converge without duplicate entries.",
      syncNote: "Connected · push updates · no manual refresh",
      offlineTitle: "Offline edits keep their place.",
      offlineDescription:
        "Create, edit and delete while offline on web or phone. Changes persist locally, show Pending sync, and drain in FIFO order after reconnect.",
      offlineNote: "Pending sync · persistent local queue · reconnect to drain",
      organizeTitle: "Organize deeply. Find quickly.",
      organizeDescription:
        "Use nested folders, notes and free-form tags. Search across titles, notes, tags and URL hostnames, then filter by folder or tag.",
      organizeNote: "Folders · notes · tags · full-text search",
      shareTitle: "Share a view, not your account.",
      shareDescription:
        "Create a read-only public link for a bookmark or a recursive folder. Recipients need no account, and you can revoke access at any time.",
      shareNote: "Read-only · anonymous access · revocable",
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Capture. Organize. Access.",
      description:
        "A simple loop from the page you want to keep to the collection you can rely on.",
      captureTitle: "Capture",
      captureDescription:
        "Save a URL from web, a browser extension, or your phone share sheet. Signet fetches the title and OG image when available.",
      organizeTitle: "Organize",
      organizeDescription:
        "Add notes, tags and nested folders. Search and filter across the details you already attached to each bookmark.",
      accessTitle: "Access",
      accessDescription:
        "Open the same collection across web, browser and phone. Connected clients receive changes without a manual refresh.",
    },
    selfHost: {
      eyebrow: "Self-host with Docker",
      title: "Your server. Your rules.",
      description:
        "Run the API, database and website on your own Docker host. Connect every client to that instance—there is no central Signet cloud and no telemetry in v1.",
      noTelemetry: "No telemetry in v1",
      multiUser: "Multi-user on one instance",
      persistence: "PostgreSQL data persists in Docker volumes",
      https: "Public HTTPS deployment is documented",
      terminalLabel: "Docker Compose v2.24+",
      terminalDescription:
        "Download compose.yaml and .env.example, generate the two secrets, then pull and start Signet.",
      commandNote: "Then open http://localhost:8080 and create an account.",
      readQuickstart: "Read quickstart",
      viewGitHub: "View GitHub",
      copyCommands: "Copy Docker Compose commands",
      copiedCommands: "Commands copied",
    },
    finalCta: {
      title: "Keep what matters. Find it anywhere.",
      description:
        "Run your own Signet instance with Docker. Follow the quickstart to configure your server, then connect web, browser and phone.",
      action: "Read quickstart",
    },
    footer: {
      tagline: "Self-hosted bookmark sync for web, browser and phone.",
      github: "GitHub",
      selfHost: "Self-host",
      note: "Your bookmarks. Everywhere. Yours.",
    },
  },
  library: {
    allBookmarks: "All Bookmarks",
    create: {
      checking: "Checking…",
      description: "Add a link with a title, artwork, notes, and tags.",
      duplicateCheckFailedMessage:
        "We couldn't check whether this link is already saved. You can return to the form or save it anyway.",
      duplicateCheckFailedTitle: "Couldn't check for duplicates",
      duplicateMessage: "This link is already in your library.",
      duplicateTitle: "Already saved",
    },
    deleteDialog: {
      description:
        "This will permanently remove the bookmark from your library. This cannot be undone.",
      pending: "Deleting…",
      title: "Delete Bookmark",
    },
    edit: {
      created: "Created {{date}}",
      loading: "Loading bookmark…",
      title: "Edit Bookmark",
      unavailable: "Unavailable",
      updated: "Updated {{date}}",
    },
    empty: {
      description:
        "Add your first bookmark by link. Your notes and tags will live here too.",
      title: "No bookmarks yet",
    },
    form: {
      imagePreviewAlt: "Bookmark artwork preview",
      imagePreviewUnavailable:
        "Image preview unavailable. You can still save this URL.",
      imageUrl: "Image URL (optional)",
      link: "Link",
      notes: "Notes (optional)",
      notesPlaceholder: "Add notes",
      saving: "Saving…",
      tags: "Tags (optional)",
      tagsHelp: "Separate tags with commas. Tags are trimmed and lower-cased.",
      tagsPlaceholder: "work, reading",
      title: "Title",
      titlePlaceholder: "Article title",
    },
    header: {
      library: "Library",
      logOut: "Log out",
      loggingOut: "Logging out…",
    },
    item: {
      artwork: "{{hostname}} bookmark artwork",
      dateUnavailable: "Date unavailable",
      edit: "Edit {{title}}",
      open: "Open {{title}} in a new tab",
      saved: "Saved {{date}}",
      tags: "Tags",
      updated: "Updated {{date}}",
    },
    loadError: "Couldn't load your bookmarks",
    loading: "Loading bookmarks…",
    loadingLibrary: "Loading your library",
    newestFirst: "Newest first",
    savedBookmarks: "Saved bookmarks",
    view: {
      grid: "Grid",
      gridView: "Grid view",
      layout: "Bookmark layout",
      list: "List",
      listView: "List view",
    },
  },
} as const;
