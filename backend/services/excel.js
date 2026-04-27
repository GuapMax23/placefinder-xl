const XLSX = require("xlsx");

function generateExcel(places, keyword, zone) {
  // Définition des colonnes avec les entêtes françaises
  const headers = [
    "Nom",
    "Adresse",
    "Contact Téléphonique", // Nouveau champ pour le lien WhatsApp
    "Site Web",
    "Note (sur 5)",
    "Latitude",
    "Longitude",
    "Statut",
    "Horaires", // Champ pour les horaires formatés
  ];

  // Transformation des données en tableau de lignes
  const rows = places.map((p) => {
    // Création du lien WhatsApp
    // On nettoie le numéro international pour n'avoir que des chiffres
    const cleanedPhoneNumber = p.telephoneInternational.replace(/\D/g, "");
    let whatsappLink = 
      cleanedPhoneNumber !== "N/A" && cleanedPhoneNumber !== "" 
        ? `https://wa.me/${cleanedPhoneNumber}` 
        : "";
    
    return [
      p.nom,
      p.adresse,
      // Pour le contact téléphonique, nous mettrons le numéro national visible et le lien en arrière-plan
      // Le format { v: value, l: { Target: url, Tooltip: text } } est utilisé par SheetJS pour les hyperliens
      whatsappLink ? { v: p.telephoneNational, l: { Target: whatsappLink, Tooltip: "Contacter via WhatsApp" } } : p.telephoneNational,
      p.siteWeb ? { v: p.siteWeb, l: { Target: p.siteWeb, Tooltip: "Visiter le site" } } : "N/A",
      p.note,
      p.latitude,
      p.longitude,
      p.statut,
      p.horaires, // Utilisation des horaires formatés
    ];
  } );

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // --- Styles et mise en forme ---
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: { 
      top: { style: "thin", color: { rgb: "DDDDDD" } },
      bottom: { style: "thin", color: { rgb: "DDDDDD" } },
      left: { style: "thin", color: { rgb: "DDDDDD" } },
      right: { style: "thin", color: { rgb: "DDDDDD" } }
    }
  };

  headers.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
    if (!worksheet[cellRef]) worksheet[cellRef] = {};
    worksheet[cellRef].s = headerStyle;
  });

  const rowStyleEven = { fill: { fgColor: { rgb: "FFFFFF" } } };
  const rowStyleOdd = { fill: { fgColor: { rgb: "FFFFE0" } } }; // Jaune très clair

  for (let r = 0; r < rows.length; r++) {
    const style = (r % 2 === 0) ? rowStyleEven : rowStyleOdd;
    for (let c = 0; c < headers.length; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: r + 1, c: c });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = style;
      }
    }
  }

  // Largeur des colonnes
  worksheet["!cols"] = [
    { wch: 30 }, // Nom
    { wch: 45 }, // Adresse
    { wch: 20 }, // Contact Téléphonique
    { wch: 35 }, // Site Web
    { wch: 12 }, // Note
    { wch: 12 }, // Latitude
    { wch: 12 }, // Longitude
    { wch: 15 }, // Statut
    { wch: 40 }, // Horaires
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats");

  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return excelBuffer;
}

module.exports = { generateExcel };
