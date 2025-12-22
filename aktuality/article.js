const MAX_LENGTH = 160;
const INITIAL_COUNT = 6; // number of articles to show initially

async function loadArticles() {
  const res = await fetch('/aktuality/articles.json');
  const articles = await res.json();

  const container = document.getElementById('articles-list');

  // create a wrapper div for articles
  const articlesWrapper = document.createElement('div');
  articlesWrapper.id = 'articles-wrapper';
  container.appendChild(articlesWrapper);

  let showingAll = false;

  function renderArticles(count) {
    articlesWrapper.innerHTML = '';

    for (let i = 0; i < count && i < articles.length; i++) {
      const article = articles[i];
      loadExcerpt(article.url).then(excerpt => {
        const articleHTML = document.createElement('article');
        articleHTML.className = 'mb-5';
        articleHTML.innerHTML = `
          <h2>
            <a href="${article.url}">${article.title}</a>
          </h2>
          <p class="text-muted">${article.meta}</p>
          <p>${excerpt}</p>
          <a href="${article.url}">Číst celý článek</a>
        `;
        articlesWrapper.appendChild(articleHTML);
      });
    }
  }

  renderArticles(INITIAL_COUNT);

  // Only show "Show more" if there are more articles
  if (articles.length > INITIAL_COUNT) {
    const showMoreBtn = document.createElement('button');
    showMoreBtn.textContent = 'Zobrazit více';
    showMoreBtn.className = 'btn btn-outline-primary mb-4';
    container.appendChild(showMoreBtn);

    showMoreBtn.addEventListener('click', () => {
      if (!showingAll) {
        renderArticles(articles.length); // show all
        showMoreBtn.style.display = 'none'; // hide button
        showingAll = true;
      }
    });
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
