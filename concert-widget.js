const BASE_PATH = ""; 
// pokud je repo https://username.github.io/mojerepo/
// změň na: const BASE_PATH = "/mojerepo";

fetch(`${BASE_PATH}/data/events.json`)
  .then(r => {
    if (!r.ok) throw new Error("events.json nenalezen");
    return r.json();
  })
  .then(renderConcerts)
  .catch(err => {
    document.getElementById("concert-widget").innerText =
      "Koncerty se nepodařilo načíst.";
    console.error(err);
  });

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

function renderConcerts(concerts) {
  const el = document.getElementById("concert-widget");

  if (!Array.isArray(concerts) || concerts.length === 0) {
    el.innerHTML = "<p>Žádné nadcházející koncerty.</p>";
    return;
  }

  el.innerHTML = `
    <div style="font-family: system-ui; max-width: 480px">
      <h2>🎶 Nadcházející koncerty</h2>
      ${concerts.map(c => `
        <div style="border-bottom:1px solid #ddd; padding:12px 0">
          <strong>${c.title}</strong><br>
          <small>
            📍 ${c.venue.name}, ${c.venue.city}<br>
            📅 ${formatDate(c.starts_at)}
          </small><br>
          ${
            c.offers?.length
              ? `<a href="${c.offers[0].url}" target="_blank">🎟 Koupit vstupenky</a>`
              : `<a href="${c.url}" target="_blank">ℹ️ Detail akce</a>`
          }
        </div>
      `).join("")}
    </div>
  `;
}