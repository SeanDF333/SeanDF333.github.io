// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bar    = document.getElementById('loaderBar');
    const hero   = document.getElementById('hero');

    // Extend the bar to full width
    requestAnimationFrame(() => {
        bar.style.width = '100%';
    });

    // Done: fade out loader, trigger hero reveal
    setTimeout(() => {
        loader.classList.add('done');
        hero.classList.add('hero-animate');
    }, 620);
});


// ===== NAVIGATION =====
const nav      = document.getElementById('nav');
const heroEl   = document.getElementById('hero');

// Show nav when hero scrolls out of view
const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        nav.classList.toggle('visible', !entry.isIntersecting);
    });
}, { threshold: 0.1 });

heroObserver.observe(heroEl);

// Add frosted-glass background after a small scroll
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ===== SECTION FADE-IN ON SCROLL =====
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
});

document.querySelectorAll('.fade-section').forEach(el => {
    fadeObserver.observe(el);
});


// ===== HOBBY MODAL =====

// To add photos later, add objects to each array:
// { src: 'images/hobbies/lego/photo1.jpg', caption: 'Optional caption' }
const hobbyPhotos = {
    drama:     [],
    film:      [],
    lego:      [],
    miniature: [],
    piano:     [],
    comics:    [],
    tcg:       [],
    travel:    [],
};

const hobbyLabels = {
    drama:     'Drama',
    film:      'Film',
    lego:      'LEGO',
    miniature: 'Miniature Painting',
    piano:     'Piano',
    comics:    'Comics',
    tcg:       'TCG',
    travel:    'Travel',
};

const modal      = document.getElementById('hobbyModal');
const overlay    = document.getElementById('modalOverlay');
const closeBtn   = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const photoGrid  = document.getElementById('photoGrid');
const emptyState = document.getElementById('modalEmpty');

function openModal(hobby) {
    modalTitle.textContent = hobbyLabels[hobby] || hobby;

    const photos = hobbyPhotos[hobby] || [];
    photoGrid.innerHTML = '';

    if (photos.length > 0) {
        emptyState.style.display = 'none';
        photos.forEach(({ src, caption }) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = caption || hobbyLabels[hobby];
            img.loading = 'lazy';
            photoGrid.appendChild(img);
        });
    } else {
        emptyState.style.display = 'flex';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.hobby-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.hobby));
});

overlay.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});


// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const offset = 72; // nav height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
