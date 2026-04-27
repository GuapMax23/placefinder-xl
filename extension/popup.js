const BACKEND_URL = 'http://localhost:3000';

document.getElementById('searchButton').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  const zone = document.getElementById('zone').value.trim();
  const status = document.getElementById('status');

  if (!keyword || !zone) {
    status.textContent = "Remplis tous les champs";
    return;
  }

  status.textContent = "Recherche...";

  try {
    const res = await fetch(`${BACKEND_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, zone })
    });

    if (!res.ok) throw new Error("Erreur API");

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result_${keyword}_${zone}.xlsx`;
    a.click();

    status.textContent = "✅ Téléchargé !";

  } catch (err) {
    status.textContent = "❌ Erreur";
  }
});
