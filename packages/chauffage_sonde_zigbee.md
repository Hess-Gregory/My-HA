# Chauffage – vannes régulées sur la sonde Zigbee de chaque pièce (v1.1.0 · 29/10/2026)

Package : `packages/chauffage_sonde_zigbee.yaml`

## Pourquoi
Les vannes Bosch régulent sur leur capteur interne, placé bas et près des fenêtres. Il lit environ 1 °C de moins que la pièce, et chute quand on aère, ce qui relance le chauffage. L'intégration Bosch SHC ne permet pas de leur donner une sonde externe.

## Comment
L'automatisation `chauffage_living_sonde_zigbee` tourne toutes les 5 min et à chaque changement d'une sonde. Pour chaque vanne, avec la sonde Sonoff de sa pièce :
- température brute de la vanne = température affichée − décalage actuel ;
- nouveau décalage = sonde Zigbee − température brute (borné entre −5 et +5) ;
- écriture seulement si l'écart dépasse 0,3 °C (pour ménager les piles), au plus une fois par 15 min et par vanne, et seulement si la vanne a renvoyé sa température depuis le dernier changement (sinon le calcul s'emballerait).
La vanne « voit » donc la température de la sonde Zigbee et régule dessus.

## Sécurité
Rien n'est modifié si la sonde est indisponible ou muette depuis plus de 3 h : les vannes gardent leur dernier décalage.

## Revenir en arrière
Désactiver l'automatisation et remettre `number.piece_de_vie_vanne_living_*_decalage` à 0.

## Correspondance vanne → sonde
| Vanne (décalage) | Sonde Zigbee |
|---|---|
| living salon, cuisine, salle à manger | `sensor.temp_piece_de_vie_sonoff_a480146b56_temperature` |
| chambre adulte | `sensor.temp_chambre_adulte_sonoff_a480146b5b_temperature` |
| chambre enfants | `sensor.temp_chambre_enfants_sonoff_a480146b58_temperature` |
| couloir (hall d'entrée) | `sensor.temp_couloir_sonoff_a480146b60_temperature` |
| salle de bain | `sensor.temp_salle_de_bain_sonoff_a480146b5d_temperature` |

## Historique
- 1.0.0 : pièce de vie seulement.
- 1.1.0 : toutes les pièces.
