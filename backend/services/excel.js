const ExcelJS = require('exceljs');

async function generateExcel(places, keyword, zone) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Placefinder XL';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Résultats');

  // Définition des colonnes (Ajout Email et Lien Maps)
  worksheet.columns = [
    { header: 'Nom', key: 'nom', width: 35 },
    { header: 'Adresse', key: 'adresse', width: 45 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Contact Téléphonique', key: 'telephone', width: 25 },
    { header: 'Site Web', key: 'siteWeb', width: 35 },
    { header: 'Note (sur 5)', key: 'note', width: 15 },
    { header: 'Horaires', key: 'horaires', width: 55 },
    { header: 'Localisation', key: 'localisation', width: 20 } // Colonne pour le lien Maps
  ];

  // Style de l'en-tête (Noir avec texte Jaune)
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFD700' } }; // Jaune
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' } // Noir
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF000000' } },
      left: { style: 'medium', color: { argb: 'FF000000' } },
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
      right: { style: 'medium', color: { argb: 'FF000000' } }
    };
  });
  headerRow.height = 30;

  // Remplissage des données
  places.forEach((p, index) => {
    const rowNumber = index + 2;
    const row = worksheet.getRow(rowNumber);

    // Téléphone avec lien WhatsApp si possible
    let telephoneCell = p.telephone || null;
    if (p.telephoneInternational) {
      const cleanedPhoneNumber = p.telephoneInternational.replace(/\D/g, "");
      if (cleanedPhoneNumber) {
        telephoneCell = {
          text: p.telephone || p.telephoneInternational,
          hyperlink: `https://wa.me/${cleanedPhoneNumber}`,
          tooltip: 'Contacter via WhatsApp'
        };
      }
    }

    // Site web
    let siteWebCell = null;
    if (p.siteWeb) {
      siteWebCell = {
        text: p.siteWeb,
        hyperlink: p.siteWeb,
        tooltip: 'Visiter le site'
      };
    }

    // Localisation (Maps)
    let mapsCell = null;
    if (p.googleMapsUri) {
      mapsCell = {
        text: 'Voir sur la carte',
        hyperlink: p.googleMapsUri,
        tooltip: 'Ouvrir dans Google Maps'
      };
    }

    // Horaires (avec retours à la ligne)
    let horairesStr = null;
    if (p.horaires && Array.isArray(p.horaires) && p.horaires.length > 0) {
      horairesStr = p.horaires.join('\n');
    }

    row.values = {
      nom: p.nom || null,
      adresse: p.adresse || null,
      email: p.email || null, // Sera probablement null la majorité du temps
      telephone: telephoneCell,
      siteWeb: siteWebCell,
      note: p.note || null,
      horaires: horairesStr,
      localisation: mapsCell
    };

    // Style des cellules de la ligne
    row.eachCell((cell, colNumber) => {
      // Alignement global (au centre verticalement pour bien lire)
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      
      // Alternance des couleurs de lignes pour la lisibilité
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFDF0' } // Jaune ultra-clair
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' } // Blanc
        };
      }

      // Bordures noires
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };

      // Styles spécifiques pour les liens (Site Web, WhatsApp, Localisation)
      // Colonnes 4 (Téléphone), 5 (Site Web), 8 (Localisation)
      if ((colNumber === 4 && cell.value && cell.value.hyperlink) || 
          (colNumber === 5 && cell.value && cell.value.hyperlink) ||
          (colNumber === 8 && cell.value && cell.value.hyperlink)) {
        cell.font = { color: { argb: 'FF0563C1' }, underline: true };
        // Pour "Localisation", centrer le texte "Voir sur la carte"
        if (colNumber === 8) {
           cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    });

    // Ajustement de la hauteur de ligne pour les horaires
    if (p.horaires && p.horaires.length > 0) {
      row.height = Math.max(25, p.horaires.length * 15); // Hauteur adaptative plus généreuse
    } else {
      row.height = 25;
    }
  });

  // Export en buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { generateExcel };
