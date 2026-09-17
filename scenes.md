# scenes.yaml — Documentation

## Rôle du fichier

Scènes d'ambiance d'éclairage pour le salon/salle à manger/cuisine/coin DJ. Chargé via `scene: !include scenes.yaml` dans `configuration.yaml`. Ce sont des valeurs de **départ** : une fois créées, chaque scène reste modifiable facilement à la souris dans *Paramètres > Automatisations et scènes > Scènes* (ouvrir la scène, régler chaque lumière avec les sliders, Enregistrer) — pas besoin de retoucher au YAML pour un simple réglage fin.

## Scènes définies

- **`ambiance_soiree` (Soirée)** : éclairage tamisé chaud (lustre salon 35% / 2700K, panneau mural orange 25%, lustre salle à manger 30%/2700K, vitrine 20%, chevet 25%/2400K), ambilight TV et cuisine/coin DJ éteints.
- **`ambiance_lecture` (Lecture)** : éclairage plus fort et plus neutre (lustre salon 80%/4000K, panneau mural 60%/4000K, lustre salle à manger 70%/4000K), pour une luminosité de confort de lecture.
- **`ambiance_fete_dj` (Fête Coin DJ)** : coin DJ en couleurs vives (violet/bleu/rose à pleine puissance), ambilight TV violet 60%, lustre salon très tamisé 15%/2700K, cuisine éteinte.
- **`ambiance_nuit` (Nuit)** : quasi tout éteint, seule la salle à manger reste à un très faible niveau (8%/2200K) comme veilleuse.

## Différence entre lumières "color_temp_kelvin" et "rgb_color"

Certaines lumières sont pilotées en `color_temp_kelvin` (blanc chaud/froid réglable — lustres/lampes classiques) et d'autres en `rgb_color` (rubans LED RGB, coin DJ). Si une lumière ne supporte pas l'attribut utilisé dans une scène, Home Assistant l'ignore simplement pour cette lumière au moment d'appliquer la scène — ce n'est pas une erreur bloquante.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajuster une couleur/luminosité d'une scène existante | Le plus simple : depuis l'interface HA (Scènes > ouvrir > régler > Enregistrer), pas ce fichier |
| Ajouter une nouvelle lumière à une scène | Ajouter son `entity_id` sous `entities:` de la scène concernée, avec `state: 'on'` + `brightness_pct` et `color_temp_kelvin` OU `rgb_color` selon son type |
| Créer une nouvelle scène | Dupliquer un bloc, changer `id` (unique) et `name` |
| Vérifier qu'une lumière supporte bien l'attribut utilisé | Outils de développement > États > l'entité `light.xxx` > attribut `supported_color_modes` |

## Piège connu

Une modification faite depuis l'interface HA réécrit ce fichier automatiquement (les scènes sont éditables en mode graphique, contrairement aux automatisations d'`automations.yaml` qui contiennent des `!secret`) — si vous éditez ce fichier à la main pendant que HA tourne, un enregistrement ultérieur depuis l'UI écrasera vos changements manuels non sauvegardés côté interface.
