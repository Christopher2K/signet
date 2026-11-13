export const web = {
  actions: {
    backToForm: "Retour au formulaire",
    cancel: "Annuler",
    closeDialog: "Fermer la boîte de dialogue",
    delete: "Supprimer",
    new: "Nouveau",
    newBookmark: "Nouveau favori",
    openExisting: "Ouvrir le favori existant",
    save: "Enregistrer",
    saveAnyway: "Enregistrer quand même",
    saveChanges: "Enregistrer les modifications",
    tryAgain: "Réessayer",
  },
  auth: {
    fields: {
      email: "Adresse e-mail",
      name: "Nom",
      password: "Mot de passe",
    },
    login: {
      footerLink: "Créer un compte",
      footerQuestion: "Nouveau sur Signet ?",
      pending: "Connexion…",
      title: "Se connecter",
    },
    placeholders: {
      email: "nom@exemple.com",
      name: "Camille Dupont",
    },
    session: {
      checking: "Vérification de votre session enregistrée auprès du serveur.",
      restoring: "Restauration de votre session…",
      unavailable: "Serveur indisponible",
    },
    signup: {
      footerLink: "Se connecter",
      footerQuestion: "Vous avez déjà un compte ?",
      passwordHint: "Utilisez au moins 12 caractères.",
      pending: "Création du compte…",
      title: "Créer un compte",
    },
  },
  marketing: {
    nav: {
      features: "Fonctionnalités",
      howItWorks: "Fonctionnement",
      selfHost: "Auto-héberger",
    },
    hero: {
      eyebrow: "Synchronisation de favoris auto-hébergée",
      titleStart: "Vos favoris.",
      titleEnd: "Partout. Chez vous.",
      description:
        "Une collection auto-hébergée sur le web, votre navigateur et votre téléphone. Capturez rapidement, organisez précisément et connectez chaque client au serveur que vous contrôlez.",
      primaryAction: "Auto-héberger avec Docker",
      secondaryAction: "Voir sur GitHub",
      note: "Aucun cloud Signet centralisé. Votre serveur est la source de vérité pour chaque client.",
    },
    clients: {
      titleStart: "Un serveur",
      titleEnd: "Chaque client",
      webLabel: "Web",
      webDescription:
        "Gestion complète des favoris, recherche, import et liens publics.",
      browserLabel: "Navigateur",
      browserDescription:
        "Enregistrez l’onglet actuel et synchronisez un dossier avec la barre de favoris native.",
      phoneLabel: "Téléphone",
      phoneDescription:
        "Capture via la feuille de partage, modifications hors ligne et collection synchronisée.",
    },
    preview: {
      label: "Aperçu de la bibliothèque Signet",
      searchPlaceholder:
        "Rechercher un titre, une note, une étiquette ou une URL",
      synced: "Synchronisé · à l’instant",
      collection: "Collection",
      allBookmarks: "Tous les favoris",
      bookmarkCount: "12 favoris",
      work: "Travail",
      reading: "Lecture",
      selfHosting: "Auto-hébergement",
      newFolder: "Nouveau dossier",
      firstTitle: "Signet — favoris auto-hébergés",
      firstDescription:
        "Dépôt du projet, notes de version et documentation d’auto-hébergement.",
      firstFolder: "Dossier : Guide / Auto-hébergement",
      secondTitle: "Présentation de Docker Compose",
      secondDescription:
        "Référence pour récupérer les images et exécuter la pile locale.",
      reference: "référence",
      pendingSync: "Synchronisation en attente",
      secondFolder: "Dossier : Travail / Infrastructure",
    },
    platforms: {
      webLabel: "Web",
      webValue: "Gestion complète",
      browserLabel: "Navigateur",
      browserValue: "Capture + synchronisation de la barre",
      phoneLabel: "Téléphone",
      phoneValue: "Partage + file hors ligne",
      serverLabel: "Votre serveur",
      serverValue: "Multi-utilisateur · sans télémétrie",
    },
    features: {
      eyebrow: "Le système",
      title: "Une bibliothèque qui vous accompagne.",
      description:
        "Signet associe une capture rapide aux outils de gestion qui rendent toute collection utile à mesure qu’elle grandit.",
      syncTitle: "Synchronisation en temps réel, sans actualisation.",
      syncDescription:
        "Votre serveur transmet les créations, modifications et suppressions aux clients connectés. À la reconnexion, seules les différences sont récupérées, sans doublon.",
      syncNote: "Connecté · mises à jour push · aucune actualisation manuelle",
      offlineTitle: "Les modifications hors ligne conservent leur place.",
      offlineDescription:
        "Créez, modifiez et supprimez hors ligne sur le web ou le téléphone. Les changements persistent localement et sont synchronisés dans l’ordre à la reconnexion.",
      offlineNote: "Synchronisation en attente · file locale persistante",
      organizeTitle: "Organisez précisément. Retrouvez rapidement.",
      organizeDescription:
        "Utilisez des dossiers imbriqués, des notes et des étiquettes libres. Recherchez dans les titres, notes, étiquettes et noms d’hôte, puis filtrez par dossier ou étiquette.",
      organizeNote: "Dossiers · notes · étiquettes · recherche plein texte",
      shareTitle: "Partagez une vue, pas votre compte.",
      shareDescription:
        "Créez un lien public en lecture seule pour un favori ou un dossier récursif. Aucun compte n’est requis et vous pouvez révoquer l’accès à tout moment.",
      shareNote: "Lecture seule · accès anonyme · révocable",
    },
    howItWorks: {
      eyebrow: "Fonctionnement",
      title: "Capturez. Organisez. Retrouvez.",
      description:
        "Un cycle simple, de la page à conserver à la collection sur laquelle vous pouvez compter.",
      captureTitle: "Capturez",
      captureDescription:
        "Enregistrez une URL depuis le web, une extension de navigateur ou la feuille de partage de votre téléphone. Signet récupère le titre et l’image OG si disponibles.",
      organizeTitle: "Organisez",
      organizeDescription:
        "Ajoutez des notes, des étiquettes et des dossiers imbriqués. Recherchez et filtrez les informations déjà associées à chaque favori.",
      accessTitle: "Retrouvez",
      accessDescription:
        "Ouvrez la même collection sur le web, le navigateur et le téléphone. Les clients connectés reçoivent les changements sans actualisation manuelle.",
    },
    selfHost: {
      eyebrow: "Auto-hébergement avec Docker",
      title: "Votre serveur. Vos règles.",
      description:
        "Exécutez l’API, la base de données et le site sur votre propre hôte Docker. Connectez chaque client à cette instance : sans cloud Signet centralisé ni télémétrie dans la v1.",
      noTelemetry: "Aucune télémétrie dans la v1",
      multiUser: "Multi-utilisateur sur une seule instance",
      persistence: "Les données PostgreSQL persistent dans les volumes Docker",
      https: "Déploiement HTTPS public documenté",
      terminalLabel: "Docker Compose v2.24+",
      terminalDescription:
        "Téléchargez compose.yaml et .env.example, générez les deux secrets, puis récupérez et démarrez Signet.",
      commandNote: "Ouvrez ensuite http://localhost:8080 et créez un compte.",
      readQuickstart: "Lire le guide de démarrage",
      viewGitHub: "Voir sur GitHub",
      copyCommands: "Copier les commandes Docker Compose",
      copiedCommands: "Commandes copiées",
    },
    finalCta: {
      title: "Gardez ce qui compte. Retrouvez-le partout.",
      description:
        "Exécutez votre propre instance Signet avec Docker. Suivez le guide pour configurer votre serveur, puis connectez le web, le navigateur et le téléphone.",
      action: "Lire le guide de démarrage",
    },
    footer: {
      tagline:
        "Synchronisation de favoris auto-hébergée pour le web, le navigateur et le téléphone.",
      github: "GitHub",
      selfHost: "Auto-hébergement",
      note: "Vos favoris. Partout. Chez vous.",
    },
  },
  library: {
    allBookmarks: "Tous les favoris",
    create: {
      checking: "Vérification…",
      description:
        "Ajoutez un lien avec un titre, une illustration, des notes et des étiquettes.",
      duplicateCheckFailedMessage:
        "Nous n’avons pas pu vérifier si ce lien est déjà enregistré. Vous pouvez revenir au formulaire ou l’enregistrer quand même.",
      duplicateCheckFailedTitle: "Impossible de vérifier les doublons",
      duplicateMessage: "Ce lien figure déjà dans votre bibliothèque.",
      duplicateTitle: "Favori déjà enregistré",
    },
    deleteDialog: {
      description:
        "Cette action supprimera définitivement le favori de votre bibliothèque. Elle est irréversible.",
      pending: "Suppression…",
      title: "Supprimer le favori",
    },
    edit: {
      created: "Créé le {{date}}",
      loading: "Chargement du favori…",
      title: "Modifier le favori",
      unavailable: "Indisponible",
      updated: "Mis à jour le {{date}}",
    },
    empty: {
      description:
        "Ajoutez votre premier favori à partir d’un lien. Vos notes et vos étiquettes seront également conservées ici.",
      title: "Aucun favori pour le moment",
    },
    form: {
      imagePreviewAlt: "Aperçu de l’illustration du favori",
      imagePreviewUnavailable:
        "L’aperçu de l’image est indisponible. Vous pouvez tout de même enregistrer cette URL.",
      imageUrl: "URL de l’image (facultatif)",
      link: "Lien",
      notes: "Notes (facultatives)",
      notesPlaceholder: "Ajouter des notes",
      saving: "Enregistrement…",
      tags: "Étiquettes (facultatives)",
      tagsHelp:
        "Séparez les étiquettes par des virgules. Les espaces superflus sont supprimés et les étiquettes sont converties en minuscules.",
      tagsPlaceholder: "travail, lecture",
      title: "Titre",
      titlePlaceholder: "Titre de l’article",
    },
    header: {
      library: "Bibliothèque",
      logOut: "Se déconnecter",
      loggingOut: "Déconnexion…",
    },
    item: {
      artwork: "Illustration du favori {{hostname}}",
      dateUnavailable: "Date indisponible",
      edit: "Modifier {{title}}",
      open: "Ouvrir {{title}} dans un nouvel onglet",
      saved: "Enregistré le {{date}}",
      tags: "Étiquettes",
      updated: "Mis à jour le {{date}}",
    },
    loadError: "Impossible de charger vos favoris",
    loading: "Chargement des favoris…",
    loadingLibrary: "Chargement de votre bibliothèque",
    newestFirst: "Plus récents en premier",
    savedBookmarks: "Favoris enregistrés",
    view: {
      grid: "Grille",
      gridView: "Vue en grille",
      layout: "Disposition des favoris",
      list: "Liste",
      listView: "Vue en liste",
    },
  },
} as const;
