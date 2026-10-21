# packages/tablette_sam.yaml — Documentation

## Rôle
Comportements de la tablette murale du salon (Xiaomi, Fully Kiosk + Fotoo, compte HA « Sam AI », browser_mod `browser_mod_59a39768_1e3bd7e4`).

| Automatisation | Ce qu'elle fait |
|---|---|
| `tablette_sam_relance_ha_apres_fotoo` | En quittant le diaporama Fotoo, relance l'app Home Assistant. |
| `tablette_sam_carillon_porte` | Porte d'entrée ouverte : carillon (volume mémorisé le jour, 60 % en mode nuit) + app HA au premier plan. La bascule sur l'Accueil sans rechargement est faite côté tablette par `www/plan3d/door-home.js`, et le plan 3D affiche la caméra du couloir (popup en bas au milieu). |
| `tablette_sam_interphone` | On sonne à la platine BTicino : sonnerie (100 % le jour, 50 % en mode nuit, retour au volume normal 30 s après) + app HA au premier plan. Sur l'Accueil, le plan 3D affiche un popup avec la carte BTicino (vidéo, répondre/parler, ouvrir le SAS). |

## Popups liés (autres fichiers)
- `automations.yaml` › `interphone_popup_appel_entrant_tablette` : popup browser_mod de l'interphone, **sauf** si la tablette est déjà sur l'Accueil (le plan 3D s'en charge, pas de doublon).
- `automations.yaml` › `je_pars_popup_decompte_ouverture` : popup « Départ en cours » (présentation d'origine) avec `custom:jp-countdown-card` (grand compte à rebours, petits boutons Pause / Annuler).
- `www/plan3d/jp-decompte.js` : décompte vocal « dix … un » + bip final pendant les 10 dernières secondes, calé sur la fin réelle du timer, coupé immédiatement en cas d'annulation ou de pause.

## Volume
Voir `packages/mode_nuit.md` : `input_number.tablette_volume_memorise` (100 % par défaut) et 60 % en mode nuit.

## Si les popups ne s'affichent plus
La tablette a probablement reçu un nouvel identifiant browser_mod (cache de l'app vidé). Remettre `browser_mod_59a39768_1e3bd7e4` via le service `browser_mod.change_browser_id` (après enregistrement automatique) ou depuis le panneau Browser Mod connecté en admin ; activer « Sync Browser ID to login session ».

## Historique
- 21/10/2026 : volumes selon le mode nuit, popup interphone sur l'Accueil, retour au volume normal après la sonnerie.
- 13/10/2026 : bascule Accueil instantanée à l'ouverture de la porte.
