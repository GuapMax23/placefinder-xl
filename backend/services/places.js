const axios = require('axios');

const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

// Champs optimisés (coût + utile Excel structuré)
const FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.businessStatus',
  'places.currentOpeningHours.weekdayDescriptions'
].join(',');

async function searchPlaces({ keyword, zone, radius = 5000, pageToken = null }) {

  const body = {
    textQuery: `${keyword} ${zone}`,
    maxResultCount: 20
  };

  if (pageToken) {
    body.pageToken = pageToken;
  }

  const response = await axios.post(PLACES_API_URL, body, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK
    }
  });

  const raw = response.data.places || [];

  const places = raw.map(p => {

    // 🕒 Horaires
    const horaires = p.currentOpeningHours?.weekdayDescriptions || [];

    return {
      nom: p.displayName?.text || "",
      adresse: p.formattedAddress || "",

      // 📞 Téléphones
      telephone: p.nationalPhoneNumber || "",
      telephoneInternational: p.internationalPhoneNumber || "",

      // 🌐 Web
      siteWeb: p.websiteUri || "",

      // ⭐ Note
      note: p.rating || "",

      // 🟢 Statut (booléen exploitable)
      statut: p.businessStatus === "OPERATIONAL",

      // 🕒 Horaires brut (sera traité dans excel.js)
      horaires: horaires
    };
  });

  return {
    places,
    nextPageToken: response.data.nextPageToken || null
  };
}

module.exports = { searchPlaces };
