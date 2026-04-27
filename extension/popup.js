const BACKEND_URL = 'http://10.48.173.133:3000';

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

document.getElementById('searchButton').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  const zone = document.getElementById('zone').value.trim();
  let maxResults = parseInt(document.getElementById('maxResults').value, 10);
  const btn = document.getElementById('searchButton');

  if (!keyword || !zone) {
    showStatus("⚠️ Veuillez remplir tous les champs obligatoires.", "error");
    return;
  }

  // Validation du nombre de résultats
  if (isNaN(maxResults) || maxResults < 1) maxResults = 1;
  if (maxResults > 60) maxResults = 60;

  showStatus("⏳ Recherche en cours, veuillez patienter...", "loading");
  btn.disabled = true;
  btn.style.opacity = "0.7";

  try {
    const res = await fetch(`${BACKEND_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, zone, maxResults })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Erreur lors de la recherche");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    
    // Déclenchement du téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlaceFinder_${keyword.replace(/[^a-z0-9]/gi, '_')}_${zone.replace(/[^a-z0-9]/gi, '_')}.xlsx`;
    a.click();
    
    // Nettoyage de l'URL objet après un court délai
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showStatus("✅ Super ! Fichier Excel téléchargé avec succès.", "success");

  } catch (err) {
    showStatus(`❌ Erreur: ${err.message}`, "error");
  } finally {
    btn.disabled = false;
    btn.style.opacity = "1";
  }
});
