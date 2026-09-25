# sauvegarde.py — archive complète

**Appelé par** : `script.matteo_planning_sauvegarder` (bouton 💾 du dashboard) et l'automatisation hebdomadaire (dimanche 03h17).

Crée `/config/matteo/sauvegardes/matteo_AAAAMMJJ_HHMM.tar.gz` contenant :
- `matteo/` (scripts, données, documentation — sans les sauvegardes elles-mêmes) ;
- `packages/matteo/` ;
- `custom_templates/matteo_planning.jinja` (+ sa doc) ;
- `.storage/lovelace.dashboard_calendrier` (le dashboard).

Garde les **8** archives les plus récentes. **Restaurer** : extraire l'archive dans `/config` puis redémarrer HA.
