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
  'places.currentOpeningHours.weekdayDescriptions',
  'places.googleMapsUri',
  'nextPageToken'
].join(',');

// Fonction pour scraper un site web et trouver un email
async function extractEmailFromWebsite(url) {
  if (!url) return null;
  try {
    // Timeout court (5s) pour ne pas bloquer le serveur
    const response = await axios.get(url, { timeout: 5000, maxRedirects: 3 });
    const html = response.data;
    
    // Regex basique pour trouver des emails
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = typeof html === 'string' ? html.match(emailRegex) : null;
    
    if (matches) {
      // Filtrer les faux positifs courants (images, sentry, wix, etc.)
      const invalidExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
      const invalidDomains = ['sentry.io', 'example.com', 'wix.com'];
      
      const validEmails = matches.filter(email => {
        const lowerEmail = email.toLowerCase();
        const hasInvalidExt = invalidExtensions.some(ext => lowerEmail.endsWith(ext));
        const hasInvalidDomain = invalidDomains.some(domain => lowerEmail.includes(domain));
        return !hasInvalidExt && !hasInvalidDomain;
      });

      if (validEmails.length > 0) {
        return validEmails[0].toLowerCase(); // On retourne le premier trouvé
      }
    }
  } catch (error) {
    // Si le site crash, est très lent ou bloque les requêtes (403, 404, etc.)
    return null;
  }
  return null;
}

async function searchPlaces({ keyword, zone, radius = 5000, targetResults = 20 }) {
  let allPlaces = [];
  let pageToken = null;
  let pagesFetched = 0;
  const maxPages = Math.ceil(targetResults / 20); // Ex: pour 60 résultats, max 3 pages

  do {
    const body = {
      textQuery: `${keyword} ${zone}`,
      maxResultCount: 20, // Toujours demander le max par page à Google
      languageCode: 'fr'
    };

    if (pageToken) {
      body.pageToken = pageToken;
      // Google API requiert souvent un court délai avant que le nextPageToken ne soit actif
      await new Promise(r => setTimeout(r, 2000));
    }

    const response = await axios.post(PLACES_API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask': FIELD_MASK
      }
    });

    const raw = response.data.places || [];

    const formatted = raw.map(p => {
      // 🕒 Horaires
      const horaires = p.currentOpeningHours?.weekdayDescriptions || [];

      return {
        nom: p.displayName?.text || "",
        adresse: p.formattedAddress || "",
        email: null, // Google Places ne fournit pas d'emails publiquement
        
        // 📞 Téléphones
        telephone: p.nationalPhoneNumber || "",
        telephoneInternational: p.internationalPhoneNumber || "",

        // 🌐 Web
        siteWeb: p.websiteUri || "",

        // ⭐ Note
        note: p.rating || "",

        // 🕒 Horaires brut (sera traité dans excel.js)
        horaires: horaires,
        
        // 📍 Lien Maps
        googleMapsUri: p.googleMapsUri || null
      };
    });

    // --- ETAPE D'ENRICHISSEMENT DES EMAILS (SCRAPING) ---
    // On lance la recherche d'emails sur tous les sites web en parallèle pour cette page
    await Promise.allSettled(
      formatted.map(async (place) => {
        if (place.siteWeb) {
          const email = await extractEmailFromWebsite(place.siteWeb);
          if (email) {
            place.email = email;
          }
        }
      })
    );

    allPlaces = allPlaces.concat(formatted);
    pagesFetched++;

    pageToken = response.data.nextPageToken || null;

  } while (pageToken && allPlaces.length < targetResults && pagesFetched < maxPages);

  return {
    places: allPlaces.slice(0, targetResults) // Coupe le tableau au nombre exact demandé
  };
}

module.exports = { searchPlaces };
