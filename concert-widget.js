fetch("data/events.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Nelze načíst events.json");
    }
    return response.json();
  })
  .then(concerts => renderConcerts(concerts))
  .catch(err => {
    document.getElementById("concert-widget").innerText =
      "Nepodařilo se načíst koncerty.";
    console.error(err);
  });

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

function renderConcerts(concerts) {
  const container = document.getElementById("concert-widget");

  if (!concerts.length) {
    container.innerHTML = "<p>Žádné nadcházející koncerty.</p>";
    return;
  }

  container.innerHTML = `
    <div style="font-family: system-ui; max-width: 480px">
      <h2>🎶 Nadcházející koncerty</h2>
      ${concerts.map(c => `
        <div style="border-bottom:1px solid #ddd; padding:12px 0">
          <strong>${c.artist?.name ?? "Neznámý interpret"}</strong><br>
          <span>${c.title}</span><br>
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