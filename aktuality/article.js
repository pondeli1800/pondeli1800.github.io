const MAX_LENGTH = 160;

async function loadArticles() {
  const res = await fetch('/aktuality/articles.json');
  const articles = await res.json();

  const container = document.getElementById('articles-list');

  for (const article of articles) {
    const excerpt = await loadExcerpt(article.url);

    container.innerHTML += `
      <article class="mb-5">
        <h2>
          <a href="${article.url}">${article.title}</a>
        </h2>
        <p class="text-muted">${article.meta}</p>
        <p>${excerpt}</p>
        <a href="${article.url}">Číst celý článek</a>
      </article>
    `;
  }
}

async function loadExcerpt(url) {
  const res = await fetch(url);
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const content = doc.querySelector('.article-content');

  if (!content) return '';

  const text = content.textContent.trim().replace(/\s+/g, ' ');

  return text.length > MAX_LENGTH
    ? text.slice(0, MAX_LENGTH) + '…'
    : text;
}

loadArticles();
