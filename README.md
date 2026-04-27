# PlaceFinder XL

API Node.js/Express qui reçoit une recherche (mot-clé + zone),
appelle Google Maps Places API, et retourne un fichier Excel prêt à l'emploi.


## Structure du projet

placefinder/
├── backend/
│   ├── server.js            ← Point d'entrée Express
│   ├── routes/
│   │   └── search.js        ← Route POST /search
│   ├── services/
│   │   ├── places.js        ← Appel Google Maps Places API
│   │   └── excel.js         ← Génération fichier .xlsx (SheetJS)
│   ├── .env.example         ← Modèle de configuration
│   ├── Dockerfile
│   └── package.json
├── extension/               ← (Phase 4) Extension Chrome
└── docker-compose.yml


## Colonnes du fichier Excel

| Colonne        | Source API              |
|----------------|-------------------------|
| Nom            | displayName.text        |
| Adresse        | formattedAddress        |
| Téléphone      | nationalPhoneNumber     |
| Site Web       | websiteUri              |
| Note (/5)      | rating                  |
| Nombre d'avis  | userRatingCount         |
| Statut         | businessStatus          |
| Latitude       | location.latitude       |
| Longitude      | location.longitude      |
| Google Maps    | googleMapsUri           |
