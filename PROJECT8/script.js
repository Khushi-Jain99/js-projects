class Typer {
  constructor(element, words, speed = 100, delay = 1500) {
    this.element = element;
    this.words = words;
    this.speed = speed;
    this.initialSpeed = speed;
    this.delay = delay;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    this.totalChars = 0;
    this.cycleCount = 0;

    this.type();
  }

  type() {
    if (this.isPaused) {
      setTimeout(() => this.type(), 100);
      return;
    }

    const currentWord = this.words[this.wordIndex];
    const displayedText = currentWord.substring(0, this.charIndex);

    this.element.textContent = displayedText;

    if (!this.isDeleting && this.charIndex < currentWord.length) {
      this.charIndex++;
      this.totalChars++;
      this.updateStats();
      setTimeout(() => this.type(), this.speed);
    } else if (this.isDeleting && this.charIndex > 0) {
      this.charIndex--;
      setTimeout(() => this.type(), this.speed / 2);
    } else {
      this.isDeleting = !this.isDeleting;

      if (!this.isDeleting) {
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        this.cycleCount++;
        this.updateStats();
      }

      setTimeout(() => this.type(), this.delay);
    }
  }

  updateStats() {
    const charsElement = document.getElementById('charsTyped');
    const cycleElement = document.getElementById('cycleCount');
    
    if (charsElement) {
      charsElement.textContent = this.totalChars;
    }
    if (cycleElement) {
      cycleElement.textContent = this.cycleCount;
    }
  }

  pause() {
    this.isPaused = !this.isPaused;
  }

  setSpeed(speed) {
    this.speed = speed;
  }
}

const element = document.getElementById("type");

const typer = new Typer(element, [
    "Khushi Jain",
  "a Web Developer",
  "a Designer",
  "a Creator",
  "Building Amazing Things",
  "a Machine Learning Enthusiast",
    "a Tech Explorer",
    "a Lifelong Learner",
    "a Passionate Coder"
], 100, 2000);

// Pause/Resume Button
const pauseBtn = document.getElementById('pauseBtn');
let isPaused = false;

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  typer.pause();
  
  if (isPaused) {
    pauseBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      Resume
    `;
    pauseBtn.classList.add('active');
  } else {
    pauseBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      Pause
    `;
    pauseBtn.classList.remove('active');
  }
});

// Speed Control Button
const speedBtn = document.getElementById('speedBtn');
const speeds = [
  { value: 150, label: 'Slow' },
  { value: 100, label: 'Normal' },
  { value: 50, label: 'Fast' },
  { value: 25, label: 'Very Fast' }
];
let currentSpeedIndex = 1;

speedBtn.addEventListener('click', () => {
  currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
  const currentSpeed = speeds[currentSpeedIndex];
  typer.setSpeed(currentSpeed.value);
  speedBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
    Speed: ${currentSpeed.label}
  `;
  
  // Visual feedback
  speedBtn.classList.add('active');
  setTimeout(() => {
    speedBtn.classList.remove('active');
  }, 300);
});

// Add smooth entrance animation
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});