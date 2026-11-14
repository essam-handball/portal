/* ==========================================================================
   ESSAM Handball — comportements du site
   1. Menu mobile
   2. Intégrations externes (Score'n'co, HelloAsso, Instagram, boutique), pilotées par config.js
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

  /* 2 bis. Bandeau des partenaires ------------------------------------------
     Défile tout seul, et se fait défiler à la main : glisser (souris ou doigt),
     pavé tactile, flèches. La molette verticale reste réservée à la page. Toute action manuelle met le défilement
     automatique en pause quelques secondes. La liste est doublée pour boucler.  */
  var bande = document.getElementById("defile-partenaires");
  if (bande) {
    var listes = bande.querySelectorAll(".defile-partenaires__liste");
    var calmeP = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var VITESSE = 40;                         // pixels par seconde
    var pos = 0, cible = null, pauseJusqua = 0, survol = false, dernier = null, ecrit = -1;
    var largeur = function () { return listes[0].getBoundingClientRect().width; };
    var boucle = !calmeP && listes.length > 1;
    var appliquer = function () {
      var w = largeur();
      if (boucle && w > 0) { pos = ((pos % w) + w) % w; }
      ecrit = Math.round(pos);
      bande.scrollLeft = ecrit;
    };
    var pause = function (ms) { pauseJusqua = performance.now() + ms; cible = null; };

    // Défilement natif (doigt, pavé tactile, molette horizontale, clavier)
    bande.addEventListener("scroll", function () {
      if (Math.abs(bande.scrollLeft - ecrit) <= 1) { return; }   // c'est nous
      pos = bande.scrollLeft; pause(3000);
      if (boucle) {
        var w = largeur();
        if (pos >= w) { pos -= w; appliquer(); }
      }
    }, { passive: true });
    // Glisser à la souris
    var depart = null, deplace = false;
    bande.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) { return; }
      depart = { x: e.clientX, pos: pos }; deplace = false;
    });
    window.addEventListener("pointermove", function (e) {
      if (!depart) { return; }
      var dx = e.clientX - depart.x;
      if (!deplace && Math.abs(dx) > 5) { deplace = true; bande.classList.add("est-tire"); }
      if (deplace) { pos = depart.pos - dx; appliquer(); pause(3000); }
    });
    window.addEventListener("pointerup", function () {
      if (!depart) { return; }
      depart = null;
      setTimeout(function () { bande.classList.remove("est-tire"); }, 0);
    });
    // Flèches : une carte et demie par clic, avec un glissement adouci
    document.querySelectorAll("[data-defile]").forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        var carte = bande.querySelector(".logo-partenaire");
        var pas = carte ? carte.getBoundingClientRect().width + 28 : 250;
        var depuis = cible === null ? pos : cible;
        pause(4000);
        cible = depuis + Number(bouton.getAttribute("data-defile")) * pas * 1.5;
        if (!boucle) { cible = Math.max(0, Math.min(cible, bande.scrollWidth - bande.clientWidth)); }
      });
    });
    bande.addEventListener("mouseenter", function () { survol = true; });
    bande.addEventListener("mouseleave", function () { survol = false; pause(800); });
    bande.addEventListener("focusin", function () { pause(6000); });

    var tour = function (t) {
      var dt = dernier === null ? 0 : Math.min((t - dernier) / 1000, 0.1);
      dernier = t;
      if (cible !== null) {
        var reste = cible - pos;
        if (Math.abs(reste) < 0.5) { pos = cible; cible = null; }
        else { pos += reste * Math.min(1, dt * 7); }
        if (boucle) { var w = largeur(); if (w > 0 && cible !== null && (pos >= w || pos < 0)) { var dec = pos >= w ? -w : w; pos += dec; cible += dec; } }
        appliquer();
      } else if (boucle && !survol && !depart && t > pauseJusqua) {
        pos += VITESSE * dt; appliquer();
      }
      window.requestAnimationFrame(tour);
    };
    window.requestAnimationFrame(tour);
  }

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
