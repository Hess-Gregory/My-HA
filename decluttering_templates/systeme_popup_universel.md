# 🛠️ Documentation : `systeme_popup_universel.yaml`

**Version :** 1.0.0  
**Auteur :** Home Assistant Architecture  
**Dernière mise à jour :** 18 Septembre 2026  
**Type :** Template `decluttering-card` colocalisé  

---

## 📌 1. Vue d'ensemble & Philosophie UX/AX

Le template `systeme_popup_universel` répond au besoin d'harmoniser l'expérience utilisateur (UX) et de prévenir les erreurs de manipulation sur les entités interactives de Home Assistant (tâches `todo`, événements de calendrier, rappels, commutateurs).

Il implémente un **flux guidé en 3 étapes (3-Step Modal Workflow)** :
1. **Étape 1 : Consultation (Detail)** ➔ Affiche la fiche descriptive complète sans risquer d'altérer les données par erreur.
2. **Étape 2 : Édition (Modify)** ➔ Ouvre un sous-dialogue dédié à la mise à jour des paramètres de l'entité.
3. **Étape 3 : Confirmation (Delete/Action)** ➔ Intercepte l'action critique par une modale de confirmation explicite avec focus visuel rouge pour prévenir les suppressions accidentelles.

---

## 🧰 2. Prérequis & Dépendances HACS

Pour utiliser ce template, les 3 composants Lovelace suivants doivent être installés via HACS :

| Dépendance | Type | Rôle dans le template |
| :--- | :--- | :--- |
| **`decluttering-card`** | Frontend | Permet d'instancier le template et d'injecter des variables réutilisables. |
| **`browser_mod`** | Intégration / Frontend | Moteur de gestion des fenêtres modales (`browser_mod.popup`). |
| **`button-card`** | Frontend | Rendu graphique des cartes-boutons interactives et gestion du style CSS. |

---

## ⚙️ 3. Installation & Déclaration dans Lovelace

### Option A : Tableaux de bord en mode YAML (Recommandé)
Ajoutez l'inclusion du fichier dans l'en-tête de votre tableau de bord principal :

```yaml
decluttering_templates:
  systeme_popup_universel:
    !include decluttering_templates/systeme_popup_universel.yaml
