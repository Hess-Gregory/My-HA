# packages/mode_nuit.yaml — Documentation

## Rôle
Mode nuit déclenché par le bouton **Bonne nuit**, annonces vocales de la tablette du salon, et annonces de l'alarme Ajax.

## Mode nuit (`input_boolean.mode_nuit`)
| Moment | Ce qui se passe |
|---|---|
| Activation (bouton Bonne nuit) | Mémorise le volume actuel de la tablette dans `input_number.tablette_volume_memorise` (s'il est ≥ 30 %), coupe l'économiseur d'écran, garde l'écran allumé, luminosité **20 %** (51/255), annonce « Le mode nuit est activé. Bonne nuit à tous. » à **60 %**. Le volume reste à 60 %. |
| Désactivation manuelle (bouton **Annuler** de l'Accueil, ou l'entité elle-même) | Restaure le volume mémorisé et la luminosité 100 %. Aucune annonce. |
| 6 h 00 | Désactivation automatique (donc restauration). |
| Redémarrage de HA | Entre 6 h et 20 h : désactivation. La nuit : volume 60 % et luminosité 20 % réappliqués, sans nouvelle annonce. |

Pas d'annonce répétée : l'annonce n'est faite que sur le passage réel off → on.

## Annonces vocales (`script.annonce_tablette`)
Service commun pour parler sur la tablette (Home Assistant Cloud TTS, fr-FR) : volume 60 % en mode nuit, sinon le volume mémorisé (100 % par défaut). Paramètre `volume` optionnel pour forcer un niveau. Utilisé par la cave (`script.cave_annonce`), le mode nuit et l'alarme.

Les sons de la tablette (carillon de porte, interphone) suivent la même règle : carillon au volume mémorisé le jour / 60 % la nuit ; interphone à 100 % le jour / 50 % la nuit, puis retour au volume normal 30 s après.

## Annonces de l'alarme Ajax
Sur la centrale globale `alarm_control_panel.buanderie_local_tech_centrale_alarme_ajax` :
- passage en **armed_night** → « L'alarme est activée en mode nuit. »
- passage de armed_night / armed_away / armed_home vers armed_custom_bypass (cave seule armée) ou disarmed → « L'alarme est désactivée. »

Une seule annonce par changement d'état réel (déclencheurs d'état, pas de répétition).

## Je pars
Le décompte vocal des 10 dernières secondes est joué par la tablette elle-même (`www/plan3d/jp-decompte.js`) : il utilise le volume courant de la tablette, donc 60 % si le mode nuit est actif, sans toucher au volume mémorisé.

## Historique
- 21/10/2026 : création (remplace la mise en veille de la tablette par le bouton Bonne nuit).
