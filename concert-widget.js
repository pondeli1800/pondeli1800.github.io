// ====== CONFIG ======
const BASE_PATH = ""; 
// pokud je repo např. https://username.github.io/mojerepo/
// použij: const BASE_PATH = "/mojerepo";

// ====== STATE ======
let upcomingConcerts = [];
let pastConcerts = [];
let showingPast = false;

// ====== INIT AFTER DOM ======
document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("concert-widget");
  const toggleBtn = document.getElementById("toggle-past");

  if (!widget) {
    console.error("Chybí element #concert-widget");
    return;
  }

  if (!toggleBtn) {
    console.error("Chybí tlačítko #toggle-past");
    return;
  }

  fetch(`${BASE_PATH}/data/events.json`)
    .then(r => {
      if (!r.ok) throw new Error("events.json nenalezen");
      return r.json();
    })
    .then(events => {
      const now = new Date();

      upcomingConcerts = events
        .filter(e => new Date(e.starts_at) > now)
        .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

      pastConcerts = events
        .filter(e => new Date(e.starts_at) <= now)
        .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));

      renderConcerts(upcomingConcerts, "Nadcházející koncerty");

      toggleBtn.addEventListener("click", () => {
        showingPast = !showingPast;

        if (showingPast) {
          renderConcerts(pastConcerts, "Předchozí koncerty");
          toggleBtn.textContent = "Zpět na nadcházející";
        } else {
          renderConcerts(upcomingConcerts, "Nadcházející koncerty");
          toggleBtn.textContent = "Předchozí koncerty";
        }
      });
    })
    .catch(err => {
      widget.innerHTML =
        "<p class='concert-meta'>Nepodařilo se načíst koncerty.</p>";
      console.error(err);
    });
});

// ====== HELPERS ======
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

// ====== RENDER ======
function renderConcerts(concerts, title) {
  const el = document.getElementById("concert-widget");

  if (!Array.isArray(concerts) || concerts.length === 0) {
    el.innerHTML = `<p class="concert-meta">Žádné koncerty k zobrazení.</p>`;
    return;
  }

  el.innerHTML = `
    <div>
      <h2 class="concert-header">${title}</h2>
      ${concerts.map(c => `
        <div class="concert-item" style="border-bottom:1px solid #ddd; padding:12px 0">
          <div class="concert-place">${c.venue?.name ?? ""}</div>
          <div class="concert-meta">
            📍 ${c.venue?.city ?? ""}<br>
            📅 ${formatDate(c.starts_at)}
          </div>
          ${
            title === "Nadcházející koncerty"
              ? `<a class="concert-link" href="${
                  c.offers?.length ? c.offers[0].url : c.url
                }" target="_blank" rel="noopener">🎟 Vstupenky</a>`
              : ""
          }
        </div>
      `).join("")}
    </div>
  `;
}