// Detect current language from URL
const path = window.location.pathname;

let language = 'cs';

if (path === '/en' || path.startsWith('/en/')) {
    language = 'en';
} else if (path === '/de' || path.startsWith('/de/')) {
    language = 'de';
}

// Select correct header
const headers = {
    cs: '/partials/header.html',
    en: '/partials/header-en.html',
    de: '/partials/header-de.html'
};

// Load partial
function loadPartial(id, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(error => console.error(error));
}

// Load language-specific header
loadPartial('site-header', headers[language]);

// Load the same footer everywhere
loadPartial('site-footer', '/partials/footer.html');