const BASE_PATH = "";
// pokud máš repo např. https://username.github.io/mojerepo/
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
    el.innerHTML = "<p class='concert-meta'>Žádné nadcházející koncerty.</p>";
    return;
  }

  el.innerHTML = `
    <div>
      ${concerts.map(c => `
        <div style="border-bottom:1px solid #ddd; padding:12px 0">
          <div class="concert-place">${c.venue.name}</div>
          <div class="concert-meta">
            ${c.venue.city}<br>
            ${formatDate(c.starts_at)}
          </div>
          <a class="concert-link" href="${
            c.offers?.length ? c.offers[0].url : c.url
          }" target="_blank">Vstupenky</a>
        </div>
      `).join("")}
    </div>
  `;
}