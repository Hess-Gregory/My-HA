# coin_dj.yaml — Interrupteur « Sono DJ »

`switch.sono_dj` allume / éteint toute la sono du coin DJ dans l'ordre qui évite les clacs :

| Action | Séquence | Script |
|---|---|---|
| Marche | barres + table de mixage + lecteurs, **9 s**, puis enceintes Adam | `script.demarrage_mixer` |
| Arrêt | enceintes Adam + barres, **6 s**, puis table de mixage + lecteurs | `script.1786831774432` (« Éteindre la sono ») |

- L'état suit les prises réelles (`light.sono`, groupe Hue mixage + lecteurs + Adam).
- Les deux scripts sont en mode `single` : un appui pendant une séquence est ignoré.
- `script.sono_dj_basculer` fait la même chose (bascule selon l'état) ; « Bonne nuit », « Tout éteindre », « Je pars » et « Sieste / Calme » appellent le script d'arrêt.
- Les barres seules : `light.lumieres_sono` (« Barres (toutes) ») ; ne jamais utiliser `light.coin_dj_coin_dj` (pièce Hue qui contient aussi les prises de la sono).
