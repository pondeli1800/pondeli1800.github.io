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

loadPartial('site-header', '/partials/header.html');
loadPartial('site-footer', '/partials/footer.html');
