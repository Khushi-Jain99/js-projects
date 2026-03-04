const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const colorCode = document.querySelector('#colorCode');
const colorBox = document.querySelector('#colorBox');
const copyBtn = document.querySelector('#copyBtn');
const statusText = document.querySelector('#status');

let intervalId;

// Generate random hex color
function randomColor() {
  const hex = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hex[Math.floor(Math.random() * 16)];
  }

  return color;
}

// Update color display
function updateColorDisplay(color) {
  colorCode.textContent = color;
  colorBox.style.backgroundColor = color;
  
  // Add animation effect
  colorBox.style.transform = 'scale(1.05)';
  setTimeout(() => {
    colorBox.style.transform = 'scale(1)';
  }, 200);
}

// Start color changing
startBtn.addEventListener('click', () => {
  if (!intervalId) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = 'Color magic in progress...';
    statusText.classList.add('active');
    
    intervalId = setInterval(() => {
      const color = randomColor();
      document.body.style.backgroundColor = color;
      updateColorDisplay(color);
    }, 1000);
    
    // Immediate color change
    const color = randomColor();
    document.body.style.backgroundColor = color;
    updateColorDisplay(color);
  }
});

// Stop color changing
stopBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  statusText.textContent = 'Paused - Click start to resume';
  statusText.classList.remove('active');
});

// Copy color code to clipboard
copyBtn.addEventListener('click', async () => {
  const color = colorCode.textContent;
  
  try {
    await navigator.clipboard.writeText(color);
    
    // Visual feedback
    copyBtn.classList.add('copied');
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = originalHTML;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy color code:', err);
  }
});

// Initialize
stopBtn.disabled = true;
const initialColor = getComputedStyle(document.body).backgroundColor;
const rgbMatch = initialColor.match(/\d+/g);
if (rgbMatch) {
  const hex = '#' + rgbMatch.map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
  updateColorDisplay(hex);
}