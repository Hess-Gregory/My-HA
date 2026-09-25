# matteo_save_override.py — créer / modifier une ligne

**Appelé par** : `shell_command.matteo_override_enregistrer` (script HA `matteo_planning_enregistrer`).

## Arguments (dans l'ordre)
`KEY TYPE_CODE TYPE_LABEL GARDIEN ACTEUR_ALLER ACTEUR_ALLER_CODE ACTEUR_RETOUR ACTEUR_RETOUR_CODE CODE_ALLER CODE_RETOUR
MOTIF1_CODE MOTIF1 MOTIF_LIBRE REPORT_DATE REPORT_AGREED USER MOTIF2_CODE MOTIF2 DATE_DU DATE_AU REPORT_DATE_ALLER
ECHANGE_AVEC NOTES LIEU_ALLER LIEU_RETOUR MOTIF_LIEU_CODE MOTIF_LIEU`

Les 7 derniers sont optionnels (compatibilité) : s'ils sont absents, la valeur existante est conservée.

## Ce que fait le script
1. **Période de vacances** (`PERIODE_VAC`) : crée la période et ses parts (2, ou 4 pour l'été), puis s'arrête.
2. Met à jour la ligne : dates, type, garde, acteurs et codes des trajets, motifs, notes, **lieux** et **motif de lieu**.
3. Calcule `bank_delta` (+1 pour C, −1 pour D ou aller B) et `reason_code`.
4. **Banque** : lie le rattrapage (`report_date` / `report_date_aller`) à la dette choisie ; un retour **C**
   solde d'abord la plus ancienne dette de Grégory (`solde_dette` / `soldee_par`).
5. **Échange croisé** : applique ou annule l'inversion de garde du week-end partenaire.
6. **Pivot** : inverse la garde de tous les week-ends suivants (une seule fois).
7. `save()` (recalculs + moteur).

## Pièges
- Les week-ends masqués par un congé ne portent jamais de dette (`MASQ`).
- Chaque enregistrement ajoute une entrée `upsert` dans l'historique : la ligne devient « manuelle »
  et ne sera plus réalignée automatiquement.

## Inversion permanente des retours (args 27-28)

`INVERSION` = on/off, `COMP_KEY` = clé du trajet de compensation. Avec `on`, le retour (A ou B, obligatoirement l'autre parent que celui prévu par l'alternance) reçoit `inversion_retours`, `reprise_alternance` (ancre de l'alternance), `inversion_comp`, `rattrape_par` et un `bank_delta` de ±1 ; la ligne de compensation passe en C (+1) ou D (−1) avec `compense_inversion`. Avec `off` sur une ligne inversée, les champs sont retirés et `nettoyer_inversions()` (appelée par `save()`) remet la compensation à la normale.
