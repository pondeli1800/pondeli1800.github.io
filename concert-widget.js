// ====== CONFIG ======
const EVENTS_URL = "/data/events.json";
const PAST_CONCERTS_OFFSET = 32;

// ====== LANGUAGE DETECTION ======
const LANGUAGE = /^\/en(?:\/|$)/.test(window.location.pathname)
    ? "en"
    : "cs";

const TEXT = {
    cs: {
        upcoming: "Nadcházející koncerty",
        past: "Předchozí koncerty",
        tickets: "Vstupenky",
        moreInfo: "ℹ️ Více informací",
        unknownVenue: "Neznámé místo",
        noDate: "Datum není k dispozici",
        noEvents: "Žádné koncerty k zobrazení.",
        backToUpcoming: "Zpět na nadcházející",
        pastButton: "Předchozí koncerty",
        loadError: "Nepodařilo se načíst koncerty."
    },

    en: {
        upcoming: "Upcoming concerts",
        past: "Past concerts",
        tickets: "Tickets",
        moreInfo: "ℹ️ More information",
        unknownVenue: "Unknown venue",
        noDate: "Date unavailable",
        noEvents: "There are no concerts to display.",
        backToUpcoming: "Back to upcoming concerts",
        pastButton: "Past concerts",
        loadError: "Failed to load concerts."
    }
};

const T = TEXT[LANGUAGE];

const DATE_LOCALE = LANGUAGE === "en" ? "en-GB" : "cs-CZ";

// ====== STATE ======
let upcomingConcerts = [];
let pastConcerts = [];
let showingPast = false;


// ====== HELPERS ======

function getEventDate(event) {
    const value = event.starts_at || event.datetime;

    if (!value) return null;

    const date = new Date(value);

    return isNaN(date.getTime()) ? null : date;
}


function formatDate(date) {
    return date.toLocaleString(DATE_LOCALE, {
        dateStyle: "long",
        timeStyle: "short"
    });
}


function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


function animateCounter(el) {
    const target = Math.max(0, parseInt(el.dataset.target) || 0);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        el.textContent = Math.floor(progress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}


// ====== RENDER CONCERTS ======

function renderConcerts(concerts, type) {
    const el = document.getElementById("concert-widget");

    if (!Array.isArray(concerts) || concerts.length === 0) {
        el.innerHTML = `
            <p class="concert-meta">${T.noEvents}</p>
        `;
        return;
    }

    const title = type === "upcoming" ? T.upcoming : T.past;

    el.innerHTML = `
        <div>
            <h2 class="concert-header">${title}</h2>

            ${concerts.map(concert => {

                const date = getEventDate(concert);

                const venue = escapeHtml(
                    concert.venue?.name || T.unknownVenue
                );

                const location = [
                    concert.venue?.street_address,
                    concert.venue?.city,
                    concert.venue?.country
                ]
                .filter(Boolean)
                .map(escapeHtml)
                .join(", ");

                const hasTickets =
                    Array.isArray(concert.offers) &&
                    concert.offers.length > 0;

                const eventUrl =
                    (hasTickets && concert.offers[0].url) ||
                    concert.url;

                const buttonHtml =
                    type === "upcoming" && eventUrl
                        ? `
                            <a class="concert-link"
                               href="${escapeHtml(eventUrl)}"
                               target="_blank"
                               rel="noopener noreferrer">
                                ${hasTickets ? T.tickets : T.moreInfo}
                            </a>
                        `
                        : "";

                return `
                    <div class="concert-item"
                         style="border-bottom:1px solid #ddd; padding:12px 0">

                        <div class="concert-place">
                            ${venue}
                        </div>

                        <div class="concert-meta">
                            📍 ${location}<br>
                            📅 ${date ? formatDate(date) : T.noDate}
                        </div>

                        ${buttonHtml}

                    </div>
                `;

            }).join("")}

        </div>
    `;
}


// ====== INITIALIZATION ======

function initializeConcertWidget() {

    const widget = document.getElementById("concert-widget");
    const toggleBtn = document.getElementById("toggle-past");
    const counterEl = document.querySelector(".counter");

    if (!widget) {
        console.error("Missing element #concert-widget");
        return;
    }

    if (!toggleBtn) {
        console.error("Missing button #toggle-past");
        return;
    }

    // Set initial button text
    toggleBtn.textContent = T.pastButton;

    // Load events (same JSON for both languages)
    fetch(EVENTS_URL)

        .then(response => {
            if (!response.ok) {
                throw new Error("events.json not found");
            }

            return response.json();
        })

        .then(events => {

            const now = new Date();

            // Separate upcoming concerts
            upcomingConcerts = events
                .filter(event => {
                    const date = getEventDate(event);
                    return date && date > now;
                })
                .sort((a, b) =>
                    getEventDate(a) - getEventDate(b)
                );

            // Separate past concerts
            pastConcerts = events
                .filter(event => {
                    const date = getEventDate(event);
                    return date && date <= now;
                })
                .sort((a, b) =>
                    getEventDate(b) - getEventDate(a)
                );

            // Update concert counter
            if (counterEl) {
                counterEl.dataset.target =
                    pastConcerts.length + PAST_CONCERTS_OFFSET;

                counterEl.textContent = "0";

                animateCounter(counterEl);
            }

            // Display upcoming concerts by default
            renderConcerts(upcomingConcerts, "upcoming");

            // Toggle between past and upcoming concerts
            toggleBtn.addEventListener("click", () => {

                showingPast = !showingPast;

                if (showingPast) {

                    renderConcerts(pastConcerts, "past");

                    toggleBtn.textContent = T.backToUpcoming;

                } else {

                    renderConcerts(upcomingConcerts, "upcoming");

                    toggleBtn.textContent = T.pastButton;

                }
            });

        })

        .catch(error => {

            widget.innerHTML = `
                <p class="concert-meta">${T.loadError}</p>
            `;

            console.error(error);

        });
}


// ====== START AFTER DOM LOAD ======

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeConcertWidget
    );
} else {
    initializeConcertWidget();
}