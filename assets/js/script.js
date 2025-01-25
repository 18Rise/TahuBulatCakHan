// hamburger menu
const hamburgerMenu = document.querySelector('#hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');

hamburgerMenu.addEventListener('click', (e) => {
    e.preventDefault();
    navbarNav.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navbarNav.classList.contains('active')) {
        navbarNav.classList.remove('active');
    }
});

navbarNav.addEventListener('click', (e) => {
    e.stopPropagation();
});

navbarNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navbarNav.classList.remove('active');
    });
});

// navbar hide/show on scroll
let lastScrollY = window.scrollY;
let lastScrollPosition = 0;
const navbar = document.querySelector('.navbar');
let hideTimeout;
const maxScroll = 500;

window.addEventListener('scroll', () => {
    clearTimeout(hideTimeout);

    if (window.scrollY > lastScrollY) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = window.scrollY;

    if (window.scrollY > 0) {
        hideTimeout = setTimeout(() => {
            navbar.style.transform = 'translateY(-100%)';
        }, 3000);
    }
});

// hero bg parralax effect
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function updateHeroBackground() {
    const scrolled = window.scrollY;
    const bgText = document.querySelector('.hero-bg');
    
    const opacity = Math.max(0, 1 - (scrolled / maxScroll));
    const translateY = scrolled * 0.3;
    
    if (bgText) {
        bgText.style.opacity = opacity;
        bgText.style.transform = `translate3d(-10%, calc(-50% + ${translateY}px), 0)`;
    }
}

window.addEventListener('scroll', throttle(() => {
    requestAnimationFrame(updateHeroBackground);
}, 16));

updateHeroBackground();

// review card with fetch API
async function fetchReviews() {
    const reviewsContainer = document.getElementById('reviews');
    
    if (!reviewsContainer) {
        console.error('Reviews container not found');
        return;
    }

    reviewsContainer.innerHTML = `
        <div class="loading-spinner">
            <p>Loading reviews...</p>
        </div>
    `;

    try {
        const response = await fetch('https://randomuser.me/api/?results=10');
        
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();

        const reviewMessages = [
            "Tahu bulatnya enak banget! Gurih dan murah. Bumbunya pas di lidah. Recommended!",
            "Pelayanannya ramah, tempatnya bersih. Tahu bulatnya jadi cemilan favorit keluarga.",
            "Harga terjangkau dengan rasa premium. Worth it banget buat yang suka cemilan!",
            "Rasanya konsisten dan selalu fresh. Saya jadi pelanggan setia!",
            "Menu favoritku kalau lagi butuh cemilan. Porsinya pas dan harganya terjangkau.",
            "Tahu bulat terenak yang pernah saya coba! Wajib dicoba sambalnya.",
            "Sering beli buat acara kantor. Selalu jadi rebutan!",
            "Tempatnya bersih dan pelayanannya cepat. Worth it!",
            "Rasa nostalgik yang bikin ketagihan. Mantap!",
            "Best tahu bulat in town! Ga pernah mengecewakan."
        ];

        reviewsContainer.innerHTML = '';
        reviewsContainer.className = 'reviews-container';

        data.results.forEach((user, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div>
                    <img src="${user.picture.large}" alt="${user.name.first}" loading="lazy">
                    <h3>${user.name.first} ${user.name.last}</h3>
                    <p class="location">${user.location.city}, ${user.location.country}</p>
                    <p class="review-text">"${reviewMessages[index]}"</p>
                </div>
            `;
            reviewsContainer.appendChild(reviewCard);

            setTimeout(() => {
                reviewCard.style.opacity = '1';
                reviewCard.style.transform = 'translateY(0)';
            }, index * 200);
        });

        setTimeout(() => {
            reviewsContainer.classList.add('animate');
        }, 2000);

    } catch (error) {
        console.error('Error fetching reviews:', error);
        reviewsContainer.innerHTML = `
            <div class="error-message">
                <p>Gagal memuat review. Silakan coba lagi nanti.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', fetchReviews);