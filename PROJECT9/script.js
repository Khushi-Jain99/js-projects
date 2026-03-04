const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");
const interactiveCards = document.querySelectorAll(".interactive-card");
const modeButtons = document.querySelectorAll(".mode-btn");

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;
let currentMode = 'default';
let particleInterval = null;

// Update cursor position
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  // Create particles in particle mode
  if (currentMode === 'particles' && Math.random() > 0.7) {
    createParticle(mouseX, mouseY);
  }
});

// Smooth follower animation
function animateFollower() {
  // Smooth follow with delay
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  
  cursorFollower.style.left = followerX + "px";
  cursorFollower.style.top = followerY + "px";
  
  requestAnimationFrame(animateFollower);
}

animateFollower();

// Interactive card hover effects
interactiveCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const hoverType = card.dataset.cursor;
    cursor.classList.add(`hover-${hoverType}`);
    cursorFollower.classList.add(`hover-${hoverType}`);

    // Special trail effect
    if (hoverType === 'trail') {
      startTrailEffect();
    }
  });

  card.addEventListener('mouseleave', () => {
    const hoverType = card.dataset.cursor;
    cursor.classList.remove(`hover-${hoverType}`);
    cursorFollower.classList.remove(`hover-${hoverType}`);

    if (hoverType === 'trail') {
      stopTrailEffect();
    }
  });
});

// Trail effect
let trailInterval = null;

function startTrailEffect() {
  trailInterval = setInterval(() => {
    createTrail(mouseX, mouseY);
  }, 50);
}

function stopTrailEffect() {
  if (trailInterval) {
    clearInterval(trailInterval);
    trailInterval = null;
  }
}

function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'trail';
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  trail.style.background = randomColor;
  trail.style.boxShadow = `0 0 10px ${randomColor}`;
  
  document.body.appendChild(trail);
  
  setTimeout(() => {
    trail.remove();
  }, 500);
}

// Particle creation
function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 10 + 5;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  
  const colors = ['#667eea', '#764ba2', '#f093fb', '#00f2fe', '#4facfe'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  particle.style.background = randomColor;
  particle.style.boxShadow = `0 0 10px ${randomColor}`;
  
  // Random direction
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50 + 20;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  
  particle.style.setProperty('--tx', tx + 'px');
  particle.style.setProperty('--ty', ty + 'px');
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Mode switching
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    modeButtons.forEach(b => b.classList.remove('active'));
    
    // Add active to clicked button
    btn.classList.add('active');
    
    // Remove all mode classes
    document.body.classList.remove('mode-default', 'mode-glow', 'mode-particles', 'mode-rainbow', 'mode-blend');
    
    // Get and apply new mode
    currentMode = btn.dataset.mode;
    document.body.classList.add(`mode-${currentMode}`);
    
    // Visual feedback
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    setTimeout(() => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 200);
  });
});

// Hover effect for all clickable elements
const clickableElements = document.querySelectorAll('a, button');

clickableElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderColor = '#f093fb';
    cursorFollower.style.width = '60px';
    cursorFollower.style.height = '60px';
  });

  element.addEventListener('mouseleave', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderColor = '#667eea';
    cursorFollower.style.width = '40px';
    cursorFollower.style.height = '40px';
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorFollower.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorFollower.style.opacity = '1';
});