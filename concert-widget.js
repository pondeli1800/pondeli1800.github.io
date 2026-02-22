const BASE_PATH = "";
// if your repo is e.g., https://username.github.io/mojerepo/
// use: const BASE_PATH = "/mojerepo";

fetch(`${BASE_PATH}/data/events.json`)
  .then(r => {
    if (!r.ok) throw new Error("events.json nenalezen");
    return r.json();
  })
  .then(renderConcerts)
  .catch(err => {
    document.getElementById("concert-widget").innerHTML =
      "<p class='concert-meta'>Nepodařilo se načíst koncerty.</p>";
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
    el.innerHTML = "<p class='concert-meta'>Nejsou naplánovány žádné nadcházející koncerty.</p>";
    return;
  }

  el.innerHTML = `
    <div>
      <h2 class="concert-header">🎶 Nadcházející koncerty</h2>
      ${concerts.map(c => `
        <div class="concert-item" style="border-bottom:1px solid #ddd; padding:12px 0">
          <div class="concert-place">${c.venue.name}</div>
          <div class="concert-meta">
            📍 ${c.venue.city}<br>
            📅 ${formatDate(c.starts_at)}
          </div>
          <a class="concert-link" href="${
            c.offers?.length ? c.offers[0].url : c.url
          }" target="_blank">🎟 Vstupenky</a>
        </div>
      `).join("")}
    </div>
  `;
}