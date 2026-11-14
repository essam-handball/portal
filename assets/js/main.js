/* ==========================================================================
   ESSAM Handball — comportements du site
   1. Menu mobile
   2. Intégrations externes (Score'n'co, HelloAsso, Instagram), pilotées par config.js
   3. Formulaire de contact
   4. Année du pied de page
   ========================================================================== */
(function () {
  "use strict";
  var config = window.ESSAM_CONFIG || {};

  // Lit une valeur de config.js à partir d'un chemin du type "scorenco.pageClub"
  function valeur(chemin) {
    return chemin.split(".").reduce(function (objet, cle) { return objet ? objet[cle] : undefined; }, config);
  }

  /* 1. Menu mobile -------------------------------------------------------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("navigation");
  if (burger && nav) {
    var fermer = function () {
      nav.classList.remove("est-ouverte");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", function () {
      var ouverte = nav.classList.toggle("est-ouverte");
      burger.setAttribute("aria-expanded", ouverte ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("est-ouverte")) { fermer(); burger.focus(); }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { fermer(); }
    });
  }

  /* 2. Intégrations --------------------------------------------------------
     <div data-widget="scorenco.widgetAccueil" data-titre="...">
       <div data-secours> contenu affiché tant que le widget n'est pas configuré </div>
     </div>
     Si l'adresse est renseignée dans config.js, une iframe remplace le contenu de secours.
     <a data-lien="helloasso.dons"> : l'adresse du lien est mise à jour depuis config.js.
     <x data-si-absent="..."> : masqué dès que la valeur est configurée.                  */
  document.querySelectorAll("[data-widget]").forEach(function (bloc) {
    var cle = bloc.getAttribute("data-widget");
    var url = valeur(cle);
    if (!url) { return; }
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = bloc.getAttribute("data-titre") || "Contenu intégré";
    iframe.loading = "lazy";
    iframe.height = valeur(cle + "Hauteur") || 750;
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    var secours = bloc.querySelector("[data-secours]");
    if (secours) { secours.hidden = true; }
    bloc.insertBefore(iframe, bloc.firstChild);
  });
  document.querySelectorAll("[data-lien]").forEach(function (lien) {
    var url = valeur(lien.getAttribute("data-lien"));
    if (url) { lien.setAttribute("href", url); lien.hidden = false; }
  });
  // Publications Instagram choisies (outil d'intégration officiel d'Instagram)
  var publications = valeur("instagram.publications") || [];
  var zoneInsta = document.querySelector("[data-instagram]");
  if (zoneInsta && publications.length) {
    publications.forEach(function (url) {
      var bloc = document.createElement("blockquote");
      bloc.className = "instagram-media";
      bloc.setAttribute("data-instgrm-permalink", url);
      bloc.setAttribute("data-instgrm-version", "14");
      var lien = document.createElement("a");
      lien.href = url; lien.textContent = "Voir la publication sur Instagram";
      bloc.appendChild(lien);
      zoneInsta.appendChild(bloc);
    });
    zoneInsta.hidden = false;
    var script = document.createElement("script");
    script.async = true; script.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(script);
  }
  document.querySelectorAll("[data-si-absent]").forEach(function (el) {
    if (valeur(el.getAttribute("data-si-absent"))) { el.hidden = true; }
  });

  /* 3. Formulaire de contact -----------------------------------------------
     Le site est statique : le formulaire prépare un e-mail dans la messagerie
     du visiteur, qui n'a plus qu'à l'envoyer. Rien n'est stocké sur le site.  */
  var formulaire = document.getElementById("formulaire-contact");
  if (formulaire) {
    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!formulaire.reportValidity()) { return; }
      var d = new FormData(formulaire);
      var objet = "[Site ESSAM] " + d.get("objet") + " : " + d.get("nom");
      var corps = d.get("message") + "\n\n" + d.get("nom") + "\n" + d.get("email") +
        (d.get("telephone") ? "\n" + d.get("telephone") : "");
      var statut = document.getElementById("statut-contact");
      if (statut) { statut.hidden = false; }
      window.location.href = "mailto:" + formulaire.getAttribute("data-destinataire") +
        "?subject=" + encodeURIComponent(objet) + "&body=" + encodeURIComponent(corps);
    });
  }

  /* 4. Année -------------------------------------------------------------- */
  var annee = document.getElementById("annee");
  if (annee) { annee.textContent = new Date().getFullYear(); }
})();
