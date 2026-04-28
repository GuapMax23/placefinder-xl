# ![rocket](https://img.shields.io/badge/-PlaceFinder_XL-0A0A0A?style=for-the-badge&logo=googlemaps&logoColor=F5D800) PlaceFinder XL

PlaceFinder XL est une solution complète permettant de rechercher automatiquement des établissements (restaurants, hôtels, etc.) via l'API Google Places et d'exporter les résultats dans un fichier Excel structuré, exploitable et prêt à l'usage.

---

## ![list](https://img.shields.io/badge/-Fonctionnalités-0A0A0A?style=flat-square&logo=checkmarx&logoColor=F5D800) Fonctionnalités

* ![search](https://img.shields.io/badge/Recherche-mot--clé_+_zone-1E1E1E?style=flat-square&logo=googlemaps&logoColor=F5D800) Recherche de lieux via mot-clé + zone
* ![api](https://img.shields.io/badge/API-Google_Places_(New)-1E1E1E?style=flat-square&logo=google&logoColor=F5D800) Utilisation de Google Places API (New)
* ![excel](https://img.shields.io/badge/Export-Excel_automatique-1E1E1E?style=flat-square&logo=microsoftexcel&logoColor=22C55E) Export automatique en fichier Excel
* ![whatsapp](https://img.shields.io/badge/WhatsApp-liens_cliquables-1E1E1E?style=flat-square&logo=whatsapp&logoColor=22C55E) Numéros convertis en liens WhatsApp cliquables
* ![clock](https://img.shields.io/badge/Horaires-format_24h-1E1E1E?style=flat-square&logo=clockify&logoColor=F5D800) Horaires formatés (24h, lisibles)
* ![palette](https://img.shields.io/badge/Design-noir_/_jaune-1E1E1E?style=flat-square&logo=adobexd&logoColor=F5D800) Mise en forme avancée (noir / jaune, tableau structuré)
* ![chrome](https://img.shields.io/badge/Extension-Chrome_Manifest_V3-1E1E1E?style=flat-square&logo=googlechrome&logoColor=3B82F6) Extension Chrome simple à utiliser

---

## ![architecture](https://img.shields.io/badge/-Architecture-0A0A0A?style=flat-square&logo=diagrams.net&logoColor=F5D800) Architecture du projet

```
placefinder-xl/
├── extension/        # Extension Chrome
├── backend/          # Serveur Node.js
├── docker-compose.yml
├── .env.example
├── .gitignore
└── docs/
```

---

## ![stack](https://img.shields.io/badge/-Technologies-0A0A0A?style=flat-square&logo=stackshare&logoColor=F5D800) Technologies utilisées

### Backend

![nodejs](https://img.shields.io/badge/Node.js-1E1E1E?style=flat-square&logo=nodedotjs&logoColor=22C55E)
![express](https://img.shields.io/badge/Express-1E1E1E?style=flat-square&logo=express&logoColor=white)
![axios](https://img.shields.io/badge/Axios-1E1E1E?style=flat-square&logo=axios&logoColor=5A29E4)
![xlsx](https://img.shields.io/badge/XLSX-1E1E1E?style=flat-square&logo=microsoftexcel&logoColor=22C55E)
![dotenv](https://img.shields.io/badge/Dotenv-1E1E1E?style=flat-square&logo=dotenv&logoColor=ECD53F)
![docker](https://img.shields.io/badge/Docker-1E1E1E?style=flat-square&logo=docker&logoColor=2496ED)

### Frontend (Extension)

![html](https://img.shields.io/badge/HTML-1E1E1E?style=flat-square&logo=html5&logoColor=E34F26)
![css](https://img.shields.io/badge/CSS-1E1E1E?style=flat-square&logo=css3&logoColor=1572B6)
![js](https://img.shields.io/badge/JavaScript-1E1E1E?style=flat-square&logo=javascript&logoColor=F5D800)
![chrome](https://img.shields.io/badge/Chrome_Manifest_V3-1E1E1E?style=flat-square&logo=googlechrome&logoColor=3B82F6)

### API externe

![google](https://img.shields.io/badge/Google_Places_API_(New)-1E1E1E?style=flat-square&logo=google&logoColor=F5D800)

---

## ![rocket](https://img.shields.io/badge/-Installation_(Local)-0A0A0A?style=flat-square&logo=rocket.chat&logoColor=F5D800) Installation (Local)

### 1. Cloner le projet

```bash
git clone https://github.com/GuapMax23/placefinder-xl.git
cd placefinder-xl
```

---

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
GOOGLE_API_KEY=ta_cle_google
PORT=3000
```

> ![warning](https://img.shields.io/badge/ATTENTION-Ne_jamais_commit_ce_fichier-EF4444?style=flat-square&logo=git&logoColor=white)

---

### 3. Lancer le backend avec Docker

```bash
sudo docker-compose up --build
```

---

### 4. Vérifier que le serveur fonctionne

```bash
curl http://localhost:3000/health
```

Réponse attendue :

```json
{"status":"ok"}
```

---

## ![api](https://img.shields.io/badge/-API_Backend-0A0A0A?style=flat-square&logo=fastapi&logoColor=F5D800) API Backend

### Endpoint principal

```
POST /search
```

### Exemple de requête

```bash
curl -X POST http://localhost:3000/search \
-H "Content-Type: application/json" \
-d '{"keyword":"restaurant","zone":"Cotonou"}'
```

---

## ![chrome](https://img.shields.io/badge/-Installation_Extension_Chrome-0A0A0A?style=flat-square&logo=googlechrome&logoColor=F5D800) Installation de l'extension Chrome

1. Aller sur :

```
chrome://extensions
```

2. Activer le **mode développeur**

3. Cliquer sur :

```
Charger l'extension non empaquetée
```

4. Sélectionner le dossier :

```
extension/
```

---

## ![network](https://img.shields.io/badge/-Réseau_local-0A0A0A?style=flat-square&logo=cisco&logoColor=F5D800) Utilisation sur un autre PC (réseau local)

> ![warning](https://img.shields.io/badge/Important-Le_backend_doit_être_accessible_depuis_le_réseau-F97316?style=flat-square&logo=cloudflare&logoColor=white)

### 1. Modifier `popup.js`

```js
const BACKEND_URL = "http://IP_LOCALE:3000";
```

Exemple :

```js
const BACKEND_URL = "http://10.48.173.133:3000";
```

---

### 2. Configurer le backend

Dans `server.js` :

```js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
```

---

### 3. Ouvrir le port 3000 (Kali)

```bash
sudo ufw allow 3000/tcp
```

---

### 4. Tester depuis un autre PC

```
http://IP_LOCALE:3000/health
```

---

## ![excel](https://img.shields.io/badge/-Format_Excel-0A0A0A?style=flat-square&logo=microsoftexcel&logoColor=F5D800) Format du fichier Excel

Le fichier généré contient :

* Nom
* Adresse
* Contact téléphonique (lien WhatsApp cliquable)
* Site web
* Note
* Statut
* Horaires (format structuré 24h)

### Améliorations

* Données propres (valeurs vides si absentes)
* Mise en forme professionnelle
* Tableaux lisibles
* Alternance de couleurs

---

## ![shield](https://img.shields.io/badge/-Sécurité-0A0A0A?style=flat-square&logo=shield&logoColor=F5D800) Sécurité

* Clé API stockée dans `.env`
* `.env` ignoré via `.gitignore`
* Recommandation : restreindre la clé API (IP ou domaine)

---

## ![roadmap](https://img.shields.io/badge/-Améliorations_futures-0A0A0A?style=flat-square&logo=blueprint&logoColor=F5D800) Améliorations futures

* Déploiement cloud (Railway / Vercel)
* Filtres avancés (note, ouvert maintenant...)
* Pagination complète
* UI améliorée
* Export PDF / CSV
* Cache pour limiter les appels API

---

## ![user](https://img.shields.io/badge/-Auteur-0A0A0A?style=flat-square&logo=github&logoColor=F5D800) Auteur

Projet réalisé dans le cadre d'un travail pratique.

[![github](https://img.shields.io/badge/GuapMax23-0A0A0A?style=flat-square&logo=github&logoColor=white)](https://github.com/GuapMax23/placefinder-xl)

---

## ![license](https://img.shields.io/badge/-Licence-0A0A0A?style=flat-square&logo=opensourceinitiative&logoColor=F5D800) Licence

![license](https://img.shields.io/badge/Usage-Éducatif_/_Personnel-1E1E1E?style=flat-square&logoColor=white)
