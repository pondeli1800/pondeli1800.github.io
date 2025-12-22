const MAX_LENGTH = 160;
const INITIAL_COUNT = 6; // number of articles to show initially

async function loadArticles() {
  const res = await fetch('/aktuality/articles.json');
  const articles = await res.json();

  const container = document.getElementById('articles-list');

  // wrapper for articles
  const articlesWrapper = document.createElement('div');
  articlesWrapper.id = 'articles-wrapper';
  container.appendChild(articlesWrapper);

  let showingAll = false;

  // helper: add <hr> if wrapper already has content
  function addDividerIfNeeded() {
    if (articlesWrapper.children.length > 0) {
      const hr = document.createElement('hr');
      hr.className = 'my-4';
      articlesWrapper.appendChild(hr);
    }
  }

  async function renderArticles(count) {
    articlesWrapper.innerHTML = '';

    const articlesToShow = articles.slice(0, count);
    const excerpts = await Promise.all(
      articlesToShow.map(article => loadExcerpt(article.url))
    );

    articlesToShow.forEach((article, i) => {
      addDividerIfNeeded();

      const articleHTML = document.createElement('article');
      articleHTML.className = 'mb-5';

      articleHTML.innerHTML = `
        <h2>
          <a href="${article.url}">${article.title}</a>
        </h2>
        <p class="text-muted">${article.meta}</p>
        <p>${excerpts[i]}</p>
        <a href="${article.url}">Číst celý článek</a>
      `;

      articlesWrapper.appendChild(articleHTML);
    });
  }

  // initial render
  await renderArticles(INITIAL_COUNT);

  // show more button
  if (articles.length > INITIAL_COUNT) {
    const showMoreBtn = document.createElement('button');
    showMoreBtn.textContent = 'Zobrazit více';
    showMoreBtn.className = 'btn btn-outline-primary mb-4';
    container.appendChild(showMoreBtn);

    showMoreBtn.addEventListener('click', async () => {
      if (showingAll) return;

      const currentCount = articlesWrapper.querySelectorAll('article').length;
      const articlesToAdd = articles.slice(currentCount);

      const excerpts = await Promise.all(
        articlesToAdd.map(article => loadExcerpt(article.url))
      );

      articlesToAdd.forEach((article, i) => {
        addDividerIfNeeded();

        const articleHTML = document.createElement('article');
        articleHTML.className = 'mb-5';

        articleHTML.innerHTML = `
          <h2>
            <a href="${article.url}">${article.title}</a>
          </h2>
          <p class="text-muted">${article.meta}</p>
          <p>${excerpts[i]}</p>
          <a href="${article.url}">Číst celý článek</a>
        `;

        articlesWrapper.appendChild(articleHTML);
      });

      showMoreBtn.style.display = 'none';
      showingAll = true;
    });
  }
}

async function loadExcerpt(url) {
  const res = await fetch(url);
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const content = doc.querySelector('.article-content');

  if (!content) return '';

  // Remove any link pointing to "/" at the end
  const backLink = content.querySelector('a[href="/"]');
  if (backLink) backLink.remove();

  const text = content.textContent.trim().replace(/\s+/g, ' ');

  return text.length > MAX_LENGTH
    ? text.slice(0, MAX_LENGTH) + '…'
    : text;
}


loadArticles();
