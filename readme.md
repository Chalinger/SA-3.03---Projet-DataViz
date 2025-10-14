# Documentation API

## Endpoints

Cette API est composée de fichiers JSON statiques accessibles en chemins relatifs dans `api/`. Chaque station possède:
- `location/location.json` (métadonnées de la station)
- `tx/TX_<STATION>.json` (série mensuelle TX)
- `tn/TN_<STATION>.json` (série mensuelle TN)

Un index global est disponible:
- `api/_locations/locations.json` (liste des stations avec coordonnées)

Exemples de chemins:
- `api/paris-mtsouris/location/location.json`
- `api/paris-mtsouris/tx/TX_PARIS-MTSOURIS.json`
- `api/paris-mtsouris/tn/TN_PARIS-MTSOURIS.json`
- `api/_locations/locations.json`

## Formats des JSON

### Index des stations: `_locations/locations.json`
- Type: tableau d’objets
- Champs:
  - `location-name`: string (nom lisible)
  - `dpt`: string (code département, ex: `"75"`)
  - `latitude`: number
  - `longitude`: number
  - `altitude`: number

### Métadonnées station: `<slug>/location/location.json`
- Type: objet unique
- Champs:
  - `location-name`: string
  - `dpt`: string
  - `latitude`: number
  - `longitude`: number
  - `altitude`: number

### Séries TX/TN: `<slug>/tx/TX_*.json` et `<slug>/tn/TN_*.json`
- Type: tableau d’objets
- Champs (pour les éléments suivants):
  - `DateYYYYMM`: number au format `YYYYMM` (ex: `195301`)
  - `VALEUR`: number (voir unités ci-dessous)
  - `Q_HOM`: number (indicateur de qualité/homogénéisation; `1` = valeur valide)

## Unités et définitions (TX / TN)

- `TX`: Température maximale moyenne mensuelle (moyenne des maxima journaliers par mois)
- `TN`: Température minimale moyenne mensuelle (moyenne des minima journaliers par mois)
- Unité de `VALEUR`: degrés Celsius (`°C`)
- Granularité temporelle: mensuelle (champ `DateYYYYMM`)

## Utilisation

Exemple pour charger TX Paris-Montsouris:

```js
// Ignorer la première ligne d'entête et parser YYYYMM
async function loadTxParis() {
  const res = await fetch('api/paris-mtsouris/tx/TX_PARIS-MTSOURIS.json');
  const raw = await res.json();
  const rows = raw.filter(r => typeof r.DateYYYYMM === 'number');

  const data = rows.map(r => ({
    date: new Date(Math.floor(r.DateYYYYMM / 100), (r.DateYYYYMM % 100) - 1, 1),
    valueC: r.VALEUR,
    quality: r.Q_HOM
  }));

  return data;
}
```

Exemple pour charger la liste des stations:

```js
async function loadStations() {
  const res = await fetch('api/_locations/locations.json');
  const stations = await res.json();

  return stations.map(s => ({
    name: s['location-name'],
    dpt: s.dpt,
    lat: Number(s.latitude),
    lon: Number(s.longitude),
    altitudeM: Number(s.altitude)
  }));
}
```

## Bonnes pratiques

- Construire une date JS: `new Date(YYYY, MM - 1, 1)` avec `YYYY = Math.floor(DateYYYYMM / 100)` et `MM = DateYYYYMM % 100`.
- Gérer la qualité: n’affichez que les valeurs avec `Q_HOM === 1` si vous voulez des séries “validées”.
- Caching: les fichiers peuvent être volumineux (~4k lignes). Cachez le résultat en mémoire ou localStorage si vous naviguez souvent.
- Coordonnées: préférez les métadonnées `location/location.json` pour une station donnée (types plus homogènes que l’index global).

## Notes

- Nommage: les dossiers (`paris-mtsouris`, `belle-ile`, etc.) sont des slugs; `location-name` est le label affichable.