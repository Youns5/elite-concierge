# ÉLITE — Logiciel de gestion pour conciergeries haut de gamme

## Présentation

ÉLITE est un prototype de logiciel métier pensé pour les conciergeries de luxe. Il propose un tableau de bord, gestion des clients, demandes, réservations, prestataires, facturation et automatisations. L'application fonctionne entièrement en local et persiste les données dans le `localStorage` du navigateur.

Objectif : fournir une base propre, sobre et professionnelle pour gérer une conciergerie, avec une expérience d'onboarding premium pour la première ouverture.

---

## Points clés

- Design : premium, minimaliste et responsive.
- Persistance : `localStorage` (clé principale `elite_data_v1`).
- Données de démonstration intégrées via `data/demo-data.js`.
- Onboarding multi-étapes pour la première ouverture (import ou création d'espace).
- Import JSON (pleinement supporté) et CSV (format simplifié avec colonne `kind`) pour peupler les entités.

---

## Fonctionnalités principales

- Tableau de bord (overview)
- Gestion clients, demandes, réservations, prestataires
- Page Paramètres : exporter/importer, réinitialiser les données, modifier le profil et les informations d'entreprise
- Onboarding (première ouverture) : importer des données ou créer un espace en 4 étapes

---

## Architecture & structure des fichiers

- `index.html` — page d'accueil / dashboard
- `style.css` — styles globaux
- `script.js` — shell applicatif (sidebar, topbar, navigation)
- `data/demo-data.js` — jeu de données fictives exposé via `window.DEMO_DATA`
- `js/store.js` — couche de persistance et API locale (utilise `localStorage`)
- `js/components.js`, `js/icons.js` — petites UI utilities (Modal, Toast, Icon)
- `js/pages/*.js` — scripts spécifiques aux pages (ex: `parametres.js`, `onboarding.js`)
- `pages/*.html` — pages secondaires (clients, demandes, paramètres, ...)

---

## Lancer en local

1. Ouvrir le dossier du projet dans votre éditeur.
2. Lancer un serveur HTTP local (recommandé) pour éviter les limitations liées aux chemins fichiers :

```bash
# Exemple avec Python 3
python3 -m http.server 8000

# puis ouvrir http://localhost:8000/
```

3. Ouvrir `http://localhost:8000/` dans votre navigateur.

Remarque : l'application fonctionne aussi via `file://` mais certains navigateurs restreignent la lecture de fichiers locaux; préférez un serveur local.

---

## Onboarding — Première ouverture

Lors de la première ouverture (et tant que l'indicateur d'onboarding n'est pas positionné), l'application redirige vers `pages/onboarding.html`.

Expérience : écran d'accueil premium proposant :

- **Importer les données de ma conciergerie** (JSON recommandé, CSV simplifié possible)
- **Créer mon espace** — onboarding en 4 étapes :
  1. Identité (Prénom, Nom, Email, Téléphone)
 2. Entreprise (Nom, Fonction, Nb collaborateurs, Ville, Type)
 3. Vos besoins (sélection des services principaux)
 4. Finalisation — résumé et création de l'espace

La progression est sauvegardée localement dans `localStorage` sous la clé `elite_onboard_draft_v1` pour éviter toute perte en cas de rafraîchissement. À la fin, les informations sont fusionnées dans l'état principal et l'indicateur `user.onboardingCompleted` est positionné à `true`.

---

## Import de données

- JSON : déposer un fichier JSON au format similaire à `data/demo-data.js` (tableaux `clients`, `demands`, `reservations`, `providers`, etc.). L'interface permet de prévisualiser et d'importer en toute sécurité.
- CSV : prise en charge basique si le CSV contient une colonne `kind` (valeurs : `clients`, `demands`, `reservations`, `providers`) — chaque ligne est convertie en objet et groupée par `kind`.

Après confirmation, les tableaux détectés sont concaténés aux listes existantes dans l'application.

---

## Fonctionnement du `localStorage`

- Clé principale : `elite_data_v1` — contient l'objet d'état complet (utilisateur, clients, demandes, réservations, prestataires, etc.).
- Onboarding draft : `elite_onboard_draft_v1` — sauvegarde temporaire du formulaire d'onboarding.
- Import temporaire : `__elite_import_tmp__` — stockage momentané avant confirmation d'import.

Utilisez `pages/parametres.html` → `Données & RGPD` pour exporter, réinitialiser ou vider complètement le `localStorage`.

---

## Modifier / ajouter des fonctionnalités

Principes et étapes conseillées :

1. Respecter la structure existante : pages HTML dans `pages/`, scripts par page dans `js/pages/`, utilitaires partagés dans `js/`.
2. Ajouter les données côté `Store` : utilisez `Store.getAll()` pour récupérer l'état, modifier l'objet et appeler `Store.save()` pour persister.
3. Pour de nouvelles entités, suivez la convention : ajouter un tableau dans l'état (`state.myEntities = []`), puis créer les vues et formulaires correspondants.
4. Tester en local via le serveur (voir ci‑dessus). Vérifiez `localStorage` dans les DevTools pour valider les mutations.

Exemple rapide — ajouter un champ `company.vat` :

- Mettre à jour le formulaire d'entreprise dans `js/pages/onboarding.js` et `js/pages/parametres.js`.
- Lors de `Store.save()`, écrire `Store.getAll().company.vat = '...'`.

---

## Limitations actuelles

- Import CSV : format simplifié (colonne `kind`) — pas de mapping automatique avancé.
- Internationalisation : UI en français uniquement (anglais prévu ultérieurement).
- Thème sombre : présent dans l'UI mais non activé/enrichi.
- Aucune API serveur : tout est local (localStorage) — pas de synchronisation multi-utilisateurs.

---

## Prochaines évolutions possibles

- Ajout d'une API backend + authentification
- Import CSV avancé et assistant de mapping
- Synchronisation multi-utilisateurs et sauvegarde cloud
- Gestion avancée des rôles et permissions
- Thème sombre & préférences utilisateur enrichies

---

Si vous voulez que j'implémente l'une des évolutions ci‑dessus, dites laquelle et je prépare une PR (ou les fichiers nécessaires) avec tests et instructions de déploiement.

---

Licence: usage interne/démo — données fictives
