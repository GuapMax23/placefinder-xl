# 🚀 PlaceFinder XL

PlaceFinder XL est une solution complète permettant de rechercher automatiquement des établissements (restaurants, hôtels, etc.) via l’API Google Places et d’exporter les résultats dans un fichier Excel structuré, exploitable et prêt à l’usage.

---

## 📌 Fonctionnalités

* 🔍 Recherche de lieux via mot-clé + zone
* 🌍 Utilisation de Google Places API (New)
* 📊 Export automatique en fichier Excel
* 📞 Numéros convertis en liens WhatsApp cliquables
* 🕒 Horaires formatés (24h, lisibles)
* 🎨 Mise en forme avancée (noir / jaune, tableau structuré)
* 🧩 Extension Chrome simple à utiliser

---

## 🏗️ Architecture du projet

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

## ⚙️ Technologies utilisées

### Backend

* Node.js
* Express
* Axios
* XLSX
* Dotenv
* Docker

### Frontend (Extension)

* HTML / CSS / JavaScript
* Chrome Manifest V3

### API externe

* Google Places API (New)

---

## 🚀 Installation (Local)

### 1. Cloner le projet

```bash
git clone https://github.com/GuapMax23/placefinder-xl.git
cd placefinder-xl
```

---

### 2. Configurer les variables d’environnement

Créer un fichier `.env` à la racine :

```env
GOOGLE_API_KEY=ta_cle_google
PORT=3000
```

⚠️ Ne jamais commit ce fichier.

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

## 🔌 API Backend

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

## 🧩 Installation de l’extension Chrome

1. Aller sur :

```
chrome://extensions
```

2. Activer le **mode développeur**

3. Cliquer sur :

```
Charger l’extension non empaquetée
```

4. Sélectionner le dossier :

```
extension/
```

---

## 🌐 Utilisation sur un autre PC (réseau local)

### ⚠️ Important

Le backend doit être accessible depuis le réseau.

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

## 📊 Format du fichier Excel

Le fichier généré contient :

* Nom
* Adresse
* Contact téléphonique (lien WhatsApp cliquable)
* Site web
* Note
* Statut
* Horaires (format structuré 24h)

### ✔️ Améliorations

* Données propres (valeurs vides si absentes)
* Mise en forme professionnelle
* Tableaux lisibles
* Alternance de couleurs


## 🔐 Sécurité

* Clé API stockée dans `.env`
* `.env` ignoré via `.gitignore`
* Recommandation : restreindre la clé API (IP ou domaine)

---

## 🚀 Améliorations futures

* Déploiement cloud (Railway / Vercel)
* Filtres avancés (note, ouvert maintenant…)
* Pagination complète
* UI améliorée
* Export PDF / CSV
* Cache pour limiter les appels API

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre d’un travail pratique.

---

## 📄 Licence

Usage éducatif / personnel.

