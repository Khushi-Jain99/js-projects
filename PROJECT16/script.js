const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const loadingSpinner = document.getElementById('loadingSpinner');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

const STORAGE_KEY = 'smartSearchHistory';
const DEBOUNCE_DELAY = 600;
let searchHistory = [];

// Mock search data
const mockResults = {
  javascript: [
    { title: 'JavaScript Guide', desc: 'Complete guide to modern JavaScript development' },
    { title: 'JS Array Methods', desc: 'Master map, filter, reduce and more' },
    { title: 'ES6 Features', desc: 'Learn about arrow functions, promises, async/await' }
  ],
  react: [
    { title: 'React Hooks', desc: 'Understanding useState, useEffect, and custom hooks' },
    { title: 'React Router', desc: 'Client-side routing for single page applications' },
    { title: 'State Management', desc: 'Redux, Context API, and Zustand comparison' }
  ],
  css: [
    { title: 'CSS Grid Layout', desc: 'Master modern 2D layout system' },
    { title: 'Flexbox Guide', desc: 'Flexible box layout for responsive designs' },
    { title: 'CSS Animations', desc: 'Create smooth transitions and keyframe animations' }
  ],
  python: [
    { title: 'Python Basics', desc: 'Getting started with Python programming' },
    { title: 'Data Structures', desc: 'Lists, dictionaries, sets, and tuples' },
    { title: 'Django Framework', desc: 'Build web applications with Django' }
  ]
};

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function search(query) {
  if (!query.trim()) {
    showWelcome();
    return;
  }

  showLoading();

  // Simulate API call with delay
  setTimeout(() => {
    const searchResults = findResults(query);
    displayResults(query, searchResults);
    addToHistory(query);
    hideLoading();
  }, 800);
}

function findResults(query) {
  const lowerQuery = query.toLowerCase();
  
  // Find matching category
  for (const [key, items] of Object.entries(mockResults)) {
    if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
      return items;
    }
  }
  
  // Return random results if no exact match
  const allResults = Object.values(mockResults).flat();
  return allResults.slice(0, 3);
}

function displayResults(query, searchResults) {
  if (searchResults.length === 0) {
    results.innerHTML = `
      <div class="result-item">
        <div class="result-icon">🔍</div>
        <div>
          <h3>No Results Found</h3>
          <p>Try searching for: JavaScript, React, CSS, or Python</p>
        </div>
      </div>
    `;
    return;
  }

  results.innerHTML = searchResults.map(item => `
    <div class="result-item">
      <div class="result-icon">📄</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');
}

function showWelcome() {
  results.innerHTML = `
    <div class="result-item welcome">
      <div class="result-icon">✨</div>
      <div>
        <h3>Ready to Search</h3>
        <p>Type anything to see intelligent debouncing in action</p>
      </div>
    </div>
  `;
}

function showLoading() {
  loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function addToHistory(query) {
  if (!query.trim()) return;
  
  // Remove duplicates and add to front
  searchHistory = searchHistory.filter(item => item !== query);
  searchHistory.unshift(query);
  
  // Keep only last 10 searches
  searchHistory = searchHistory.slice(0, 10);
  
  saveHistory();
  renderHistory();
}

function renderHistory() {
  if (searchHistory.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No searches yet</p>';
    return;
  }

  historyList.innerHTML = searchHistory.map(query => `
    <button class="history-item" data-query="${query}">${query}</button>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const query = item.dataset.query;
      searchInput.value = query;
      search(query);
    });
  });
}

function clearHistory() {
  searchHistory = [];
  saveHistory();
  renderHistory();
}

function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      searchHistory = JSON.parse(saved);
    } catch {
      searchHistory = [];
    }
  }
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
}

const debouncedSearch = debounce(search, DEBOUNCE_DELAY);

// Initialize
loadHistory();
renderHistory();

// Event listeners
searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

clearHistoryBtn.addEventListener('click', clearHistory);

// Focus input on load
searchInput.focus();