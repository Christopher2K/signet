export const common = {
  appName: "Signet",
  bookmarkCount_one: "{{count}} favori",
  bookmarkCount_other: "{{count}} favoris",
  errors: {
    unavailable:
      "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
    unknown: "Une erreur est survenue. Veuillez réessayer.",
  },
  validation: {
    emailInvalid: "Saisissez une adresse e-mail valide.",
    emailRequired: "L’adresse e-mail est requise.",
    imageUrlInvalid: "Saisissez une URL d’image HTTP(S) absolue valide.",
    nameRequired: "Le nom est requis.",
    nameTooLong: "Le nom doit contenir au maximum 100 caractères.",
    notesTooLong: "Les notes doivent contenir au maximum 2000 caractères.",
    passwordRequired: "Le mot de passe est requis.",
    passwordTooLong: "Le mot de passe doit contenir au maximum 128 caractères.",
    passwordTooShort: "Le mot de passe doit contenir au moins 12 caractères.",
    serverUrlInvalid: "Saisissez une URL de serveur HTTP ou HTTPS valide.",
    serverUrlRequired: "L’URL du serveur est requise.",
    titleRequired: "Saisissez un titre.",
    urlInvalid: "Saisissez une URL HTTP(S) absolue valide.",
  },
} as const;
