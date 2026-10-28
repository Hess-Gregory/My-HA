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
- 28/10/2026 : fausses sonneries corrigées — on ne réagit plus au compteur d'appels (il varie aux reconnexions du pont BTicino) mais seulement au passage réel à `incoming_call` (hors retour de `unavailable`).
- 25/10/2026 : si Fully Kiosk est injoignable, annonce vocale de secours via l'app HA (« Porte d'entrée ouverte » / « On sonne à l'interphone »), et `tablette_sam_relance_fully` relance Fully via l'app HA (command_launch_app) après 2 min d'indisponibilité, puis recharge l'intégration.
- 25/10/2026 : l'appel BTicino est détecté via `sensor.bticino_intercom_greg_et_sandrine_last_event_type` = `incoming_call` (l'entité event et le binary_sensor de la platine ne changent plus d'état) — sonnerie, popup browser_mod et popup du plan 3D.
- 21/10/2026 : volumes selon le mode nuit, popup interphone sur l'Accueil, retour au volume normal après la sonnerie.
- 13/10/2026 : bascule Accueil instantanée à l'ouverture de la porte.
