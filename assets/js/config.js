/* ==========================================================================
   ESSAM Handball — configuration du site
   C'est le seul fichier à modifier pour changer les liens vers les services
   externes. Les liens sont aussi écrits dans les pages : ce fichier sert à les
   mettre à jour partout d'un coup. Ne jamais inventer d'adresse : laisser
   une valeur vide tant qu'elle n'est pas fournie.
   ========================================================================== */
window.ESSAM_CONFIG = {
  instagram: {
    compte: "https://www.instagram.com/saintavemeuconhb/",
    // Publications à mettre en avant sur l'accueil (3 conseillées), par exemple :
    // ["https://www.instagram.com/p/XXXXXXXXXXX/", "https://www.instagram.com/p/YYYYYYYYYYY/"]
    // Laisser vide pour n'afficher que le bouton d'abonnement.
    publications: []
  },
  helloasso: {
    inscription: "https://www.helloasso.com/associations/etoile-sportive-saint-ave-meucon-handball/adhesions/inscription-saison-2026-2027",
    dons: "https://www.helloasso.com/associations/etoile-sportive-saint-ave-meucon-handball/formulaires/1"
  },
  scorenco: {
    // Page publique du club (utilisée tant que les widgets ne sont pas créés)
    pageClub: "https://scorenco.com/hand/clubs/es-saint-ave-meucon-hb-2nbg",
    // Adresses "src" des codes d'intégration Score'n'co
    // (admin.scorenco.com > Widgets > Code d'intégration).
    widgetAccueil: "",        // widget compact "matchs de la semaine" (accueil)
    widgetAccueilHauteur: 520,
    widgetResultats: "",      // widget complet (page Matchs). Une fois renseigné,
    widgetResultatsHauteur: 750 // le demi-ballon renvoie vers la page Matchs du site.
  }
};
