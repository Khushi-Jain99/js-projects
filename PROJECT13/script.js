// DOM Elements
const jokeEmojiElement = document.querySelector('.joke-emoji');
const jokeTextElement = document.getElementById('joke');
const categoryBadgeElement = document.getElementById('jokeCategory');
const categorySelect = document.getElementById('jokeType');
const safeModeToggle = document.getElementById('safeMode');
const btnGetJoke = document.getElementById('getJoke');
const btnCopy = document.getElementById('copyJoke');
const btnShare = document.getElementById('shareJoke');
const totalJokesElement = document.getElementById('jokesCount');
const streakElement = document.getElementById('streakCount');

// State
let currentJoke = null;
let stats = {
  totalJokes: 0,
  streak: 0,
  lastVisit: null
};

// Joke emojis for different moods
const jokeEmojis = ['😂', '🤣', '😄', '😆', '😁', '😅', '🤪', '😜', '😝', '🥳'];

// Initialize
init();

function init() {
  loadStats();
  updateStats();
  getJoke();
  
  // Event listeners
  btnGetJoke.addEventListener('click', getJoke);
  btnCopy.addEventListener('click', copyJoke);
  btnShare.addEventListener('click', shareJoke);
  categorySelect.addEventListener('change', getJoke);
  safeModeToggle.addEventListener('change', getJoke);
  
  // Check streak
  checkStreak();
}

async function getJoke() {
  try {
    btnGetJoke.textContent = 'Loading...';
    btnGetJoke.disabled = true;
    
    const category = categorySelect.value;
    const safeMode = safeModeToggle.checked;
    
    let url;
    if (category === 'random') {
      url = 'https://official-joke-api.appspot.com/random_joke';
    } else {
      url = `https://official-joke-api.appspot.com/jokes/${category}/random`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch joke');
    }
    
    const data = await response.json();
    const joke = Array.isArray(data) ? data[0] : data;
    
    // Filter explicit content if safe mode is on
    if (safeMode && containsExplicitContent(joke)) {
      getJoke(); // Try another joke
      return;
    }
    
    currentJoke = {
      id: joke.id,
      setup: joke.setup,
      punchline: joke.punchline,
      type: joke.type,
      fullText: `${joke.setup} - ${joke.punchline}`
    };
    
    displayJoke(currentJoke);
    
    // Update stats
    stats.totalJokes++;
    stats.lastVisit = new Date().toISOString();
    saveStats();
    updateStats();
    
  } catch (error) {
    console.error('Error fetching joke:', error);
    jokeTextElement.textContent = '😕 Oops! Could not fetch a joke. Please try again!';
    categoryBadgeElement.textContent = 'Error';
  } finally {
    btnGetJoke.textContent = '🎲 Get New Joke';
    btnGetJoke.disabled = false;
  }
}

function displayJoke(joke) {
  // Random emoji
  const randomEmoji = jokeEmojis[Math.floor(Math.random() * jokeEmojis.length)];
  jokeEmojiElement.textContent = randomEmoji;
  
  // Display joke
  jokeTextElement.textContent = joke.fullText;
  
  // Display category
  categoryBadgeElement.textContent = joke.type.toUpperCase();
}

function containsExplicitContent(joke) {
  const explicitWords = ['damn', 'hell', 'ass', 'sex', 'drugs', 'alcohol'];
  const text = `${joke.setup} ${joke.punchline}`.toLowerCase();
  return explicitWords.some(word => text.includes(word));
}

function copyJoke() {
  if (!currentJoke) return;
  
  navigator.clipboard.writeText(currentJoke.fullText).then(() => {
    const originalText = btnCopy.textContent;
    btnCopy.textContent = '✓ Copied!';
    setTimeout(() => {
      btnCopy.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy joke to clipboard!');
  });
}

async function shareJoke() {
  if (!currentJoke) return;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Check out this joke!',
        text: currentJoke.fullText
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    // Fallback - copy to clipboard
    copyJoke();
  }
}

function checkStreak() {
  const today = new Date().toDateString();
  const lastVisit = stats.lastVisit ? new Date(stats.lastVisit).toDateString() : null;
  
  if (lastVisit === today) {
    // Same day, keep streak
    return;
  }
  
  if (lastVisit) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastVisit === yesterdayStr) {
      // Consecutive day, increase streak
      stats.streak++;
    } else {
      // Streak broken
      stats.streak = 1;
    }
  } else {
    // First visit
    stats.streak = 1;
  }
  
  saveStats();
}

function updateStats() {
  totalJokesElement.textContent = stats.totalJokes;
  streakElement.textContent = stats.streak;
}

function loadStats() {
  const saved = localStorage.getItem('jokesGeneratorStats');
  if (saved) {
    stats = JSON.parse(saved);
  }
}

function saveStats() {
  localStorage.setItem('jokesGeneratorStats', JSON.stringify(stats));
}