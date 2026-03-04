// Search and Filter Functionality
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Filter by category
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter projects
    filterProjects(filter, searchInput.value.toLowerCase());
  });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  filterProjects(activeFilter, searchTerm);
});

function filterProjects(category, searchTerm) {
  projectCards.forEach(card => {
    const cardCategory = card.dataset.category;
    const cardText = card.textContent.toLowerCase();
    const matchesCategory = category === 'all' || cardCategory === category;
    const matchesSearch = cardText.includes(searchTerm);
    
    if (matchesCategory && matchesSearch) {
      card.style.display = 'block';
      card.classList.add('fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

console.log('🚀 JavaScript Projects Hub loaded!');
