const express = require('express');
const router = express.Router();

const { searchPlaces } = require('../services/places');
const { generateExcel } = require('../services/excel');

router.post('/', async (req, res) => {
  const { keyword, zone, radius } = req.body;

  // 🔍 Validation basique
  if (!keyword || !zone) {
    return res.status(400).json({
      error: 'keyword et zone sont requis'
    });
  }

  try {
    // 📡 Appel Google Places
    const { places } = await searchPlaces({
      keyword,
      zone,
      radius
    });

    if (!places || places.length === 0) {
      return res.status(404).json({
        error: 'Aucun résultat trouvé'
      });
    }

    // 🧪 MODE DEBUG (optionnel)
    if (req.query.debug === "true") {
      return res.json({ places });
    }

    // 📊 Génération Excel
    const buffer = generateExcel(places, keyword, zone);

    // 📥 Headers téléchargement
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="placefinder_${keyword}_${zone}.xlsx"`
    );

    // 📤 Envoi fichier
    res.send(buffer);

  } catch (error) {
    console.error('Erreur /search:', error.message);

    // ⚠️ Gestion erreurs Google
    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Quota Google Maps dépassé'
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        error: 'Clé API invalide ou non autorisée'
      });
    }

    // ❌ Erreur générale
    res.status(500).json({
      error: 'Erreur serveur interne'
    });
  }
});

module.exports = router;
