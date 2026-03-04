const image = document.getElementById('image');
const generateBtn = document.getElementById('generate');
const imageSizeSelect = document.getElementById('imageSize');
const imageCategorySelect = document.getElementById('imageCategory');
const autoRefreshSelect = document.getElementById('autoRefresh');
const copyUrlBtn = document.getElementById('copyUrl');
const downloadBtn = document.getElementById('downloadBtn');
const addFavoriteBtn = document.getElementById('addFavorite');
const clearFavoritesBtn = document.getElementById('clearFavorites');
const spinner = document.getElementById('spinner');
const imageInfo = document.getElementById('imageInfo');
const statusMsg = document.getElementById('statusMsg');
const generatedCount = document.getElementById('generatedCount');
const favoriteCount = document.getElementById('favoriteCount');
const favoritesGallery = document.getElementById('favoritesGallery');

let generatedImages = 0;
let currentImageUrl = '';
let favorites = JSON.parse(localStorage.getItem('imageFavorites')) || [];
let autoRefreshInterval = null;

// API categories mapping
const categoryKeywords = {
  nature: 'landscape',
  city: 'urban',
  people: 'portrait',
  animals: 'wildlife',
  food: 'food',
  abstract: 'abstract'
};

function getRandomImage() {
  const size = imageSizeSelect.value;
  const category = imageCategorySelect.value;
  const randomId = Math.floor(Math.random() * 10000);
  
  spinner.style.display = 'block';
  generateBtn.disabled = true;
  
  let imageUrl = `https://picsum.photos/${size}?random=${randomId}`;
  
  // Create a temporary image to test loading
  const tempImg = new Image();
  tempImg.onload = () => {
    image.src = imageUrl;
    currentImageUrl = imageUrl;
    generatedImages++;
    generatedCount.textContent = generatedImages;
    spinner.style.display = 'none';
    generateBtn.disabled = false;
    
    // Update image info
    const dimensions = `${size}x${size}`;
    const categoryText = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Random';
    imageInfo.textContent = `📊 ${dimensions} • 🏷️ ${categoryText}`;
    
    // Update status
    statusMsg.textContent = '✅ Image loaded!';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
  };
  
  tempImg.onerror = () => {
    spinner.style.display = 'none';
    generateBtn.disabled = false;
    statusMsg.textContent = '❌ Failed to load image';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
  };
  
  tempImg.src = imageUrl;
}

function copyImageUrl() {
  if (!currentImageUrl) {
    statusMsg.textContent = '⚠️ No image to copy';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
    return;
  }
  
  navigator.clipboard.writeText(currentImageUrl).then(() => {
    statusMsg.textContent = '✅ URL copied to clipboard!';
    copyUrlBtn.textContent = '✅ Copied!';
    setTimeout(() => {
      copyUrlBtn.textContent = '📋 Copy URL';
      statusMsg.textContent = 'Ready';
    }, 2000);
  }).catch(() => {
    statusMsg.textContent = '❌ Failed to copy';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
  });
}

function downloadImage() {
  if (!currentImageUrl) {
    statusMsg.textContent = '⚠️ No image to download';
    return;
  }
  
  const link = document.createElement('a');
  link.href = currentImageUrl;
  link.download = `image-${Date.now()}.jpg`;
  link.click();
  
  statusMsg.textContent = '📥 Downloading...';
  setTimeout(() => {
    statusMsg.textContent = '✅ Download complete!';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
  }, 500);
}

function addToFavorites() {
  if (!currentImageUrl) {
    statusMsg.textContent = '⚠️ No image to favorite';
    return;
  }
  
  // Check if already favorited
  if (favorites.find(fav => fav.url === currentImageUrl)) {
    statusMsg.textContent = '⚠️ Already in favorites';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
    return;
  }
  
  const favorite = {
    url: currentImageUrl,
    timestamp: new Date().toLocaleString()
  };
  
  favorites.unshift(favorite);
  localStorage.setItem('imageFavorites', JSON.stringify(favorites));
  updateFavoritesDisplay();
  
  statusMsg.textContent = '❤️ Added to favorites!';
  addFavoriteBtn.textContent = '❤️ Favorited!';
  setTimeout(() => {
    addFavoriteBtn.textContent = '❤️ Favorite';
    statusMsg.textContent = 'Ready';
  }, 2000);
}

function updateFavoritesDisplay() {
  favoriteCount.textContent = favorites.length;
  
  if (favorites.length === 0) {
    favoritesGallery.innerHTML = '<p class="empty-message">No favorites yet. Click ❤️ to add!</p>';
    clearFavoritesBtn.style.display = 'none';
    return;
  }
  
  clearFavoritesBtn.style.display = 'block';
  favoritesGallery.innerHTML = '';
  
  favorites.forEach((fav, index) => {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    favoriteItem.innerHTML = `
      <img src="${fav.url}" alt="Favorite image" title="${fav.timestamp}">
      <button class="remove-btn" onclick="removeFavorite(${index})" title="Remove">✕</button>
    `;
    favoritesGallery.appendChild(favoriteItem);
    
    // Click to load
    favoriteItem.querySelector('img').addEventListener('click', () => {
      currentImageUrl = fav.url;
      image.src = fav.url;
      imageInfo.textContent = `⭐ Favorite from ${fav.timestamp}`;
    });
  });
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem('imageFavorites', JSON.stringify(favorites));
  updateFavoritesDisplay();
  
  statusMsg.textContent = '🗑️ Removed from favorites';
  setTimeout(() => {
    statusMsg.textContent = 'Ready';
  }, 2000);
}

function setAutoRefresh() {
  clearInterval(autoRefreshInterval);
  const interval = parseInt(autoRefreshSelect.value);
  
  if (interval > 0) {
    autoRefreshInterval = setInterval(getRandomImage, interval * 1000);
    statusMsg.textContent = `⏱️ Auto-refresh every ${interval}s`;
  } else {
    statusMsg.textContent = 'Ready';
  }
}

// Event listeners
generateBtn.addEventListener('click', getRandomImage);
copyUrlBtn.addEventListener('click', copyImageUrl);
downloadBtn.addEventListener('click', downloadImage);
addFavoriteBtn.addEventListener('click', addToFavorites);
clearFavoritesBtn.addEventListener('click', () => {
  if (confirm('Clear all favorites?')) {
    favorites = [];
    localStorage.setItem('imageFavorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
    statusMsg.textContent = '🗑️ Favorites cleared';
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, 2000);
  }
});

imageSizeSelect.addEventListener('change', getRandomImage);
imageCategorySelect.addEventListener('change', getRandomImage);
autoRefreshSelect.addEventListener('change', setAutoRefresh);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    getRandomImage();
  }
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    copyImageUrl();
  }
});

// Initialize
updateFavoritesDisplay();
getRandomImage();

console.log('🖼️ Image Gallery loaded!');