const featuredCat = document.getElementById('featuredCat');
const moodPill = document.getElementById('moodPill');
const caption = document.getElementById('caption');
const strip = document.getElementById('strip');
const position = document.getElementById('position');

const moodSelect = document.getElementById('moodSelect');
const batchSelect = document.getElementById('batchSelect');
const autoPlayToggle = document.getElementById('autoPlayToggle');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleOneBtn = document.getElementById('shuffleOneBtn');
const shuffleBatchBtn = document.getElementById('shuffleBatchBtn');
const copyBtn = document.getElementById('copyBtn');

const moodText = {
  playful: ['Zoomies detected.', 'Mischief level: high.', 'Tiny chaos artist.'],
  sleepy: ['Nap approved.', 'Pillow commander.', 'Slow blink mode.'],
  serious: ['Judging silently.', 'Board meeting face.', 'No-nonsense whiskers.'],
  chaotic: ['Absolute gremlin energy.', 'Rules are optional.', 'Unexpected leap incoming.']
};

let cats = [];
let activeIndex = -1;
let autoTimer = null;

init();

function init() {
  prevBtn.addEventListener('click', () => shift(-1));
  nextBtn.addEventListener('click', () => shift(1));
  shuffleOneBtn.addEventListener('click', shuffleOne);
  shuffleBatchBtn.addEventListener('click', fetchBatch);
  copyBtn.addEventListener('click', copyCurrentLink);
  moodSelect.addEventListener('change', () => updateMoodOnly());
  autoPlayToggle.addEventListener('change', toggleAutoPlay);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      shift(-1);
    }
    if (event.key === 'ArrowRight') {
      shift(1);
    }
  });

  fetchBatch();
}

async function fetchBatch() {
  const count = Number(batchSelect.value);
  shuffleBatchBtn.disabled = true;
  shuffleBatchBtn.textContent = 'Loading...';

  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}&size=med`);
    if (!response.ok) {
      throw new Error('Failed to fetch cats');
    }

    cats = await response.json();
    activeIndex = 0;
    renderStrip();
    renderFeatured();
  } catch (error) {
    cats = [];
    activeIndex = -1;
    strip.innerHTML = '<p class="empty">Could not load cats right now.</p>';
    featuredCat.removeAttribute('src');
    caption.textContent = 'Try again in a moment.';
    position.textContent = 'No images loaded';
  } finally {
    shuffleBatchBtn.disabled = false;
    shuffleBatchBtn.textContent = 'Shuffle Batch';
  }
}

function renderStrip() {
  if (!cats.length) {
    strip.innerHTML = '<p class="empty">No cats in strip yet.</p>';
    return;
  }

  strip.innerHTML = cats
    .map((cat, index) => `
      <button class="thumb ${index === activeIndex ? 'active' : ''}" data-index="${index}" aria-label="Cat ${index + 1}">
        <img src="${cat.url}" alt="Cat thumbnail ${index + 1}">
      </button>
    `)
    .join('');

  strip.querySelectorAll('.thumb').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      activeIndex = index;
      renderStrip();
      renderFeatured();
    });
  });
}

function renderFeatured() {
  if (activeIndex < 0 || !cats[activeIndex]) {
    return;
  }

  const cat = cats[activeIndex];
  featuredCat.src = cat.url;

  const mood = moodSelect.value;
  const lines = moodText[mood];
  const randomLine = lines[Math.floor(Math.random() * lines.length)];

  moodPill.textContent = mood[0].toUpperCase() + mood.slice(1);
  caption.textContent = randomLine;
  position.textContent = `Showing ${activeIndex + 1} of ${cats.length}`;
}

function updateMoodOnly() {
  if (activeIndex >= 0) {
    renderFeatured();
  }
}

function shift(direction) {
  if (!cats.length) {
    return;
  }

  activeIndex = (activeIndex + direction + cats.length) % cats.length;
  renderStrip();
  renderFeatured();
}

function shuffleOne() {
  if (!cats.length) {
    return;
  }

  activeIndex = Math.floor(Math.random() * cats.length);
  renderStrip();
  renderFeatured();
}

async function copyCurrentLink() {
  if (activeIndex < 0 || !cats[activeIndex]) {
    return;
  }

  const link = cats[activeIndex].url;
  try {
    await navigator.clipboard.writeText(link);
    const old = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = old;
    }, 1000);
  } catch (error) {
    copyBtn.textContent = 'Copy failed';
    setTimeout(() => {
      copyBtn.textContent = 'Copy Featured Link';
    }, 1000);
  }
}

function toggleAutoPlay() {
  if (autoPlayToggle.checked) {
    autoTimer = setInterval(() => {
      shift(1);
    }, 5000);
    return;
  }

  clearInterval(autoTimer);
  autoTimer = null;
}

window.addEventListener('beforeunload', () => {
  clearInterval(autoTimer);
});
