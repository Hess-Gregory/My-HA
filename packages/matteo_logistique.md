# 📦 Package : Matteo Logistique (`matteo_logistique.yaml`)

## 1. Rôle du package
Ce package gère l'ensemble de la logique, des alternances de garde, des exceptions et du suivi des trajets pour **Matteo**. Il combine des sélecteurs de formulaires, des compteurs de trajets, un stockage persistant en JSON pour les modifications de planning, ainsi qu'un moteur Jinja2 ultra-performant pour alimenter le tableau de bord.

---

## 2. Inventaire des Entités

### Sélecteurs (`input_select`)
* `input_select.matteo_rythme_actuel` : Statut de garde global actuel.
* `input_select.exception_matteo_type` : Type d'exception en cours (ponctuel, croisé, vacances, changement permanent).
* `input_select.raison_exception_matteo` : Motif détaillé de l'exception (anniversaires, organisation, santé, etc.).
* `input_select.lieu_recuperation_matteo` : Lieu de prise en charge (Aller).
* `input_select.trajet_retour_matteo` : Lieu de dépôt (Retour).
* `input_select.trajet_aller_acteur` : Acteur réalisant le trajet aller (Grégory / Élodie).
* `input_select.trajet_retour_acteur` : Acteur réalisant le trajet retour (Grégory / Élodie).

### Stockage & Saisie (`input_text` & `input_datetime`)
* `input_text.matteo_planning_overrides` : Base de données JSON stockant les modifications de planning et exceptions personnalisées.
* `input_datetime.matteo_editeur_date` : Date de début de l'exception/période.
* `input_datetime.matteo_form_date_fin` : Date de fin de l'exception/période.

### Compteurs de trajets (`input_number`)
* `input_number.banque_trajets_gregory` : Solde de la banque de trajets pour Grégory.
* `input_number.banque_trajets_maman` : Solde de la banque de trajets pour Maman.

### Capteurs & Moteur (`sensor`)
* `sensor.planning_matteo_engine` : Moteur de calcul Jinja2 (génère l'historique sur 2 ans et les prévisions sur 1 an, gère les dates pivots et les jours fériés).
* `sensor.matteo_statut_garde_calcule` : Statut de garde calculé en temps réel pour la journée courante.

### Scripts (`script`)
* `script.banque_trajets_ajuster` : Permet d'incrémenter ou décrémenter dynamiquement la banque de trajets d'un parent.

---

## 3. Guide de modification rapide

| Demande courante | Action à effectuer |
|------------------|--------------------|
| Ajouter un nouveau motif | Éditer le bloc `raison_exception_matteo` dans le fichier YAML. |
| Modifier l'ancre du cycle | Ajuster la date `2026-09-18` dans le code Jinja2 du `sensor.planning_matteo_engine`. |
| Ajuster la banque de trajets | Utiliser le script `script.banque_trajets_ajuster` avec les paramètres `parent` et `action`. |

---

## 4. Pièges connus & Bonnes pratiques
* Ne jamais modifier manuellement la structure JSON stockée dans `input_text.matteo_planning_overrides` sauf en cas de réinitialisation complète (`{}`).
* Le moteur de planning s'appuie sur un vendredi de référence fixé au **18/09/2026** ; tout changement de cette ancre décale l'ensemble du cycle bimensuel.