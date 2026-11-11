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
