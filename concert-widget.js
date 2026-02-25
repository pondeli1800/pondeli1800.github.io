const BASE_PATH = "";

let upcomingConcerts = [];
let pastConcerts = [];
let showingPast = false;

fetch(`${BASE_PATH}/data/events.json`)
  .then(r => {
    if (!r.ok) throw new Error("events.json nenalezen");
    return r.json();
  })
  .then(events => {
    const now = new Date();

    upcomingConcerts = events.filter(e => new Date(e.starts_at) > now);
    pastConcerts = events.filter(e => new Date(e.starts_at) <= now);

    renderConcerts(upcomingConcerts, "Nadcházející koncerty");

    document
      .getElementById("toggle-past")
      .addEventListener("click", toggleConcerts);
  })
  .catch(err => {
    document.getElementById("concert-widget").innerHTML =
      "<p class='concert-meta'>Nepodařilo se načíst koncerty.</p>";
    console.error(err);
  });

function toggleConcerts() {
  showingPast = !showingPast;

  if (showingPast) {
    renderConcerts(pastConcerts, "Předchozí koncerty");
    this.textContent = "Zpět na nadcházející";
  } else {
    renderConcerts(upcomingConcerts, "Nadcházející koncerty");
    this.textContent = "Předchozí koncerty";
  }
}