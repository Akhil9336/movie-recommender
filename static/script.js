const form = document.getElementById('search-form');
const input = document.getElementById('movie-input');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');
const chips = document.querySelectorAll('.chip');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const movie = input.value.trim();
  if (movie) fetchRecommendations(movie);
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const movie = chip.dataset.movie;
    input.value = movie;
    fetchRecommendations(movie);
  });
});

async function fetchRecommendations(movie) {
  setStatus(`Pulling recommendations for "${movie}"...`, false);
  resultsEl.innerHTML = '';

  try {
    const response = await fetch('/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `We couldn't find "${movie}" in our catalog.`);
    }

    const data = await response.json();
    renderResults(data.recommendations || []);
  } catch (err) {
    setStatus(err.message || 'Something went wrong. Try another title.', true);
  }
}

function renderResults(titles) {
  if (!titles.length) {
    setStatus('No recommendations found for that title.', true);
    return;
  }

  setStatus('', false);

  titles.forEach((title, i) => {
    const stub = document.createElement('article');
    stub.className = 'stub';
    stub.style.animationDelay = `${i * 60}ms`;

    const index = document.createElement('div');
    index.className = 'stub-index';
    index.textContent = String(i + 1).padStart(2, '0');

    const titleEl = document.createElement('div');
    titleEl.className = 'stub-title';
    titleEl.textContent = title;

    stub.append(index, titleEl);
    resultsEl.append(stub);
  });
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('is-error', isError);
}
