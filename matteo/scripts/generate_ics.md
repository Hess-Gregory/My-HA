# generate_ics.py — agenda partagé

**Appelé par** : l'automatisation « Export agenda partagé » (à chaque changement du planning et au démarrage).

## Sorties
| Fichier | Usage |
|---|---|
| `/config/www/matteo/planning_<jeton>.ics` | Abonnement iPhone / Android / Google (lien secret) |
| `/config/.storage/local_calendar.matteo.ics` | Calendrier HA « Matteo » (vues Semaine/Mois) : périodes de garde uniquement ; les événements ajoutés à la main sont conservés |
| (via `generate_print.build()`) | Page imprimable + CSV |

- Le jeton est créé une fois dans `data/ics_token` (ne pas le diffuser : il donne accès au planning).
- Les week-ends recouverts par une part de congé ne sont pas exportés.
- La description de chaque événement indique qui fait l'aller / le retour et le lieu.
- Après écriture du calendrier local, l'automatisation recharge l'intégration « Matteo » pour afficher les changements.
