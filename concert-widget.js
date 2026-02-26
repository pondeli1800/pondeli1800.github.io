// ====== CONFIG ======
const BASE_PATH = ""; 
const PAST_CONCERTS_OFFSET = 30; // number of older shows not in Bandsintown

// ====== STATE ======
let upcomingConcerts = [];
let pastConcerts = [];
let showingPast = false;

// ====== HELPERS ======
function getEventDate(e) {
  // prefer starts_at, fallback to datetime
  const d = e.starts_at || e.datetime;
  return d ? new Date(d) : null;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target) || 0;
  let start = 0;
  const duration = 2000;
  let increment = target / (duration / 16);

  function update() {
    start += increment;
    increment *= 0.993;
    if (start >= target) {
      el.textContent = target;
    } else {
      el.textContent = Math.ceil(start);
      requestAnimationFrame(update);
    }
  }

  update();
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
      ${concerts.map(c => {
        const date = getEventDate(c);
        return `
          <div class="concert-item" style="border-bottom:1px solid #ddd; padding:12px 0">
            <div class="concert-place">
            ${c.venue?.name ?? "Neznámé místo"}
          </div>
          <div class="concert-meta">
            📍 ${[
              c.venue?.street_address,
              c.venue?.city,
              c.venue?.country
            ].filter(Boolean).join(", ")}<br>
            📅 ${date ? formatDate(date) : "Datum není k dispozici"}
          </div>
            ${
              title === "Nadcházející koncerty"
                ? `<a class="concert-link" href="${
                    c.offers?.length ? c.offers[0].url : c.url
                  }" target="_blank" rel="noopener">🎟 Vstupenky</a>`
                : ""
            }
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ====== INIT AFTER DOM ======
document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("concert-widget");
  const toggleBtn = document.getElementById("toggle-past");
  const counterEl = document.querySelector('.counter');

  if (!widget) return console.error("Chybí element #concert-widget");
  if (!toggleBtn) return console.error("Chybí tlačítko #toggle-past");

  fetch(`${BASE_PATH}/data/events.json`)
    .then(r => {
      if (!r.ok) throw new Error("events.json nenalezen");
      return r.json();
    })
    .then(events => {
      const now = new Date();

      // Separate upcoming and past concerts using getEventDate
      upcomingConcerts = events
        .filter(e => {
          const date = getEventDate(e);
          return date && date > now;
        })
        .sort((a, b) => getEventDate(a) - getEventDate(b));

      pastConcerts = events
        .filter(e => {
          const date = getEventDate(e);
          return date && date <= now;
        })
        .sort((a, b) => getEventDate(b) - getEventDate(a));

      // Update counter for past concerts
      if (counterEl) {
        counterEl.dataset.target = pastConcerts.length + PAST_CONCERTS_OFFSET;
        counterEl.textContent = '0'; // reset
        animateCounter(counterEl);
      }

      // Render default upcoming concerts
      renderConcerts(upcomingConcerts, "Nadcházející koncerty");

      // Toggle button for past/upcoming
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
      widget.innerHTML = "<p class='concert-meta'>Nepodařilo se načíst koncerty.</p>";
      console.error(err);
    });
});