// Progress Bar
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');

function updateProgressBar() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const progress = (scrollTop / documentHeight) * 100;
  progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', () => {
  updateProgressBar();
  
  // Navbar scroll effect
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

updateProgressBar();

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in-up, .feature-content');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
  fadeObserver.observe(element);
});

// Parallax Effect
const parallaxSections = document.querySelectorAll('[data-speed]');

function parallaxScroll() {
  parallaxSections.forEach(section => {
    const speed = section.getAttribute('data-speed');
    const scrollPosition = window.pageYOffset;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    // Only apply parallax when section is in viewport
    if (scrollPosition + window.innerHeight > sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const yPos = (scrollPosition - sectionTop) * speed;
      section.style.transform = `translateY(${yPos}px)`;
    }
  });
}

window.addEventListener('scroll', parallaxScroll);

// Mouse parallax for parallax demo layers
const parallaxDemo = document.querySelector('.parallax-demo');

if (parallaxDemo) {
  parallaxDemo.addEventListener('mousemove', (e) => {
    const rect = parallaxDemo.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const layer1 = parallaxDemo.querySelector('.layer-1');
    const layer2 = parallaxDemo.querySelector('.layer-2');
    const layer3 = parallaxDemo.querySelector('.layer-3');
    
    if (layer1) layer1.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    if (layer2) layer2.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
    if (layer3) layer3.style.transform = `translate(${x * 0.01}px, ${y * 0.01}px)`;
  });
  
  parallaxDemo.addEventListener('mouseleave', () => {
    const layer1 = parallaxDemo.querySelector('.layer-1');
    const layer2 = parallaxDemo.querySelector('.layer-2');
    const layer3 = parallaxDemo.querySelector('.layer-3');
    
    if (layer1) layer1.style.transform = 'translate(0, 0)';
    if (layer2) layer2.style.transform = 'translate(0, 0)';
    if (layer3) layer3.style.transform = 'translate(0, 0)';
  });
}

// Smooth reveal for animation demo boxes
const demoBoxes = document.querySelectorAll('.demo-box');
const boxObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
      }, index * 100);
    }
  });
}, {
  threshold: 0.5
});

demoBoxes.forEach(box => {
  box.style.opacity = '0';
  box.style.transform = 'scale(0.5)';
  box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  boxObserver.observe(box);
});

// Design cards staggered reveal
const designCards = document.querySelectorAll('.design-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.3
});

designCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(card);
});