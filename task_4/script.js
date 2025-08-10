const blogPosts = [
    {
        id: 1,
        title: "Getting Started with React Hooks",
        description: "Learn the fundamentals of React Hooks and how they can simplify your component logic. From useState to useEffect, we'll cover the essentials.",
        category: "tech",
        date: "2024-01-15",
        icon: "fas fa-code",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 2,
        title: "My Journey Through Japan",
        description: "An incredible adventure through the land of the rising sun. From Tokyo's bustling streets to Kyoto's peaceful temples.",
        category: "travel",
        date: "2024-01-10",
        icon: "fas fa-torii-gate",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 3,
        title: "The Perfect Homemade Pizza Recipe",
        description: "Master the art of pizza making at home with this foolproof recipe. From dough to toppings, everything you need to know.",
        category: "food",
        date: "2024-01-08",
        icon: "fas fa-pizza-slice",
        image: "https://www.shutterstock.com/image-photo/delicious-margherita-pizza-on-wooden-600nw-2466377147.jpg"
    },
    {
        id: 4,
        title: "Building Scalable APIs with Node.js",
        description: "Best practices for creating robust and scalable REST APIs using Node.js and Express. Performance tips and security considerations included.",
        category: "tech",
        date: "2024-01-05",
        icon: "fas fa-server",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&auto=format"
    },

    {
        id: 6,
        title: "Hidden Gems of Barcelona",
        description: "Discover the secret spots and local favorites in Barcelona that most tourists never see. Your guide to authentic experiences.",
        category: "travel",
        date: "2024-01-01",
        icon: "fas fa-map-marked-alt",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 7,
        title: "Mastering CSS Grid Layout",
        description: "A comprehensive guide to CSS Grid that will transform how you approach web layouts. From basics to advanced techniques.",
        category: "tech",
        date: "2023-12-28",
        icon: "fas fa-th",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 8,
        title: "Authentic Thai Street Food Tour",
        description: "Take a culinary journey through Thailand's vibrant street food scene. Must-try dishes and where to find them.",
        category: "food",
        date: "2023-12-25",
        icon: "fas fa-bowl-food",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop&auto=format"
    },

    {
        id: 10,
        title: "JavaScript ES2024 New Features",
        description: "Explore the latest features in JavaScript ES2024 and how they can improve your development workflow.",
        category: "tech",
        date: "2023-12-20",
        icon: "fab fa-js-square",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 11,
        title: "Backpacking Through Patagonia",
        description: "An epic adventure through one of the world's last wilderness frontiers. Tips for planning your own Patagonian expedition.",
        category: "travel",
        date: "2023-12-18",
        icon: "fas fa-mountain",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop&auto=format"
    },
    {
        id: 12,
        title: "Fermentation: The Art of Preservation",
        description: "Discover the ancient art of fermentation and how to create delicious, probiotic-rich foods at home.",
        category: "food",
        date: "2023-12-15",
        icon: "fas fa-jar",
        image: "https://www.pmfmeap.org/sites/default/files/inline-images/image-removebg-preview.png"
    }
];

let currentPage = 1;
let currentCategory = 'all';
let currentSearchTerm = '';
const postsPerPage = 6;

const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const noResults = document.getElementById('noResults');

document.addEventListener('DOMContentLoaded', function() {
    renderPosts();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', debounce(function(e) {
        currentSearchTerm = e.target.value.toLowerCase();
        currentPage = 1;
        renderPosts();
    }, 300));

    categoryFilter.addEventListener('change', function(e) {
        currentCategory = e.target.value;
        currentPage = 1;
        renderPosts();
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
            scrollToTop();
        }
    });

    nextBtn.addEventListener('click', function() {
        const filteredPosts = getFilteredPosts();
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
            scrollToTop();
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getFilteredPosts() {
    return blogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(currentSearchTerm) ||
                            post.description.toLowerCase().includes(currentSearchTerm);
        return matchesCategory && matchesSearch;
    });
}

function getCurrentPagePosts() {
    const filteredPosts = getFilteredPosts();
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getCategoryIcon(category) {
    const categoryIcons = {
        'tech': 'fas fa-laptop-code',
        'travel': 'fas fa-plane',
        'food': 'fas fa-utensils'
    };
    return categoryIcons[category] || 'fas fa-tag';
}

function createPostCard(post) {        
    return `
        <article class="post-card">
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="post-content">
                <span class="post-category">
                    <i class="${getCategoryIcon(post.category)}"></i>
                    ${post.category}
                </span>
                <h2 class="post-title">
                    <i class="fas fa-bookmark" style="color: #11998e; margin-right: 0.5rem; font-size: 0.9rem;"></i>
                    ${post.title}
                </h2>
                <p class="post-description">
                    <i class="fas fa-quote-left" style="color: #38ef7d; margin-right: 0.5rem; font-size: 0.8rem;"></i>
                    ${post.description}
                </p>
                <div class="post-meta">
                    <span class="post-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDate(post.date)}
                    </span>
                    <a href="#" class="read-more">
                        <i class="fas fa-arrow-right" style="margin-left: 0.3rem;"></i>
                        Read More
                    </a>
                </div>
            </div>
        </article>
    `;
}

function renderPosts() {
    const filteredPosts = getFilteredPosts();
    const currentPagePosts = getCurrentPagePosts();
    
    if (filteredPosts.length === 0) {
        postsContainer.style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
        noResults.style.display = 'block';
        return;
    } else {
        postsContainer.style.display = 'grid';
        document.getElementById('pagination').style.display = 'flex';
        noResults.style.display = 'none';
    }

    postsContainer.innerHTML = currentPagePosts.map(post => createPostCard(post)).join('');
    updatePagination(filteredPosts.length);
    animateCards();
}

function updatePagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    const paginationElement = document.getElementById('pagination');
    paginationElement.style.display = totalPages <= 1 ? 'none' : 'flex';
}

function animateCards() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.post-card')) {
            const card = e.target.closest('.post-card');
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.post-card')) {
            const card = e.target.closest('.post-card');
            card.style.transform = 'translateY(0) scale(1)';
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            alert('This would navigate to the full blog post!');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        }
    });
});

function showLoadingState() {
    postsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
            <p style="margin-top: 1rem; color: #718096;">Loading posts...</p>
        </div>
    `;
}

const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

function observeNewCards() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
}
