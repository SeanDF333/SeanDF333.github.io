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


// ===== TRAVEL MAP =====
(async function () {
    const VISITED = new Set([156, 158, 458, 702, 392, 462]); // China+Taiwan, Malaysia, Singapore, Japan, Maldives

    const CITIES = [
        // China
        { name: 'Wuhan',         lon: 114.306, lat: 30.593, rooted: true },
        { name: 'Xuzhou',        lon: 117.186, lat: 34.261 },
        { name: 'Enshi',         lon: 109.466, lat: 30.272 },
        { name: 'Xianning',      lon: 114.322, lat: 29.853 },
        { name: 'Ezhou',         lon: 114.894, lat: 30.391 },
        { name: 'Beijing',       lon: 116.407, lat: 39.904, rooted: true },
        { name: 'Shanghai',      lon: 121.474, lat: 31.230, rooted: true },
        { name: 'Guangzhou',     lon: 113.264, lat: 23.129 },
        { name: 'Shenzhen',      lon: 114.058, lat: 22.543 },
        { name: 'Hangzhou',      lon: 120.155, lat: 30.274 },
        { name: 'Chengdu',       lon: 104.067, lat: 30.573 },
        { name: 'Sanya',         lon: 109.512, lat: 18.253 },
        { name: 'Baotou',        lon: 109.840, lat: 40.657 },
        { name: 'Hohhot',        lon: 111.749, lat: 40.843 },
        { name: 'Weihai',        lon: 122.114, lat: 37.513 },
        { name: 'Yantai',        lon: 121.448, lat: 37.464 },
        { name: 'Jiuzhaigou',    lon: 103.919, lat: 33.260 },
        { name: 'Hong Kong',     lon: 114.169, lat: 22.319 },
        { name: 'Zhoukou',       lon: 114.653, lat: 33.648 },
        { name: 'Nanchang',      lon: 115.858, lat: 28.682 },
        { name: 'Jiujiang',      lon: 115.993, lat: 29.706 },
        { name: 'Kunming',       lon: 102.718, lat: 25.039 },
        { name: 'Dali',          lon: 100.268, lat: 25.607 },
        { name: 'Xiamen',        lon: 118.089, lat: 24.480 },
        // Malaysia
        { name: 'Kuala Lumpur',  lon: 101.687, lat:  3.139, rooted: true },
        { name: 'Penang',        lon: 100.329, lat:  5.414 },
        { name: 'Malacca',       lon: 102.250, lat:  2.190 },
        { name: 'Johor Bahru',   lon: 103.741, lat:  1.493 },
        // Singapore
        { name: 'Singapore',     lon: 103.820, lat:  1.352 },
        // Japan
        { name: 'Kyoto',         lon: 135.768, lat: 35.012, rooted: true },
        { name: 'Osaka',         lon: 135.502, lat: 34.694 },
        { name: 'Otsu',          lon: 135.869, lat: 35.005 },
        { name: 'Tokyo',         lon: 139.650, lat: 35.676, rooted: true },
        { name: 'Inatori',       lon: 139.039, lat: 34.745 },
        { name: 'Sapporo',       lon: 141.355, lat: 43.062 },
        { name: 'Monbetsu',      lon: 143.354, lat: 44.356 },
        { name: 'Noboribetsu',   lon: 141.103, lat: 42.413 },
        { name: 'Kobe',          lon: 135.196, lat: 34.690 },
        { name: 'Gotemba',       lon: 138.934, lat: 35.308 },
        // Maldives
        { name: 'Malé',          lon:  73.509, lat:  4.176 },
        { name: 'Kuramathi',     lon:  72.900, lat:  4.267 },
    ];

    const svgEl = document.getElementById('travel-map');
    if (!svgEl) return;

    const W = 960, H = 500;
    const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`);

    const projection = d3.geoNaturalEarth1()
        .scale(155)
        .translate([W / 2, H / 2 + 20]);

    const path = d3.geoPath().projection(projection);
    const tooltip = document.getElementById('mapTooltip');
    const mapWrap = svgEl.closest('.map-wrap');

    try {
        const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const countries = topojson.feature(world, world.objects.countries);

        // Subtle graticule grid
        svg.append('path')
            .datum(d3.geoGraticule()())
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', '#C8D8E2')
            .attr('stroke-width', 0.3);

        // All countries
        svg.selectAll('.country')
            .data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('fill', d => VISITED.has(+d.id) ? 'rgba(155,123,90,0.22)' : 'var(--tag-bg)')
            .attr('stroke', 'var(--border)')
            .attr('stroke-width', 0.5);

        // Accent border on visited countries
        svg.selectAll('.country-hi')
            .data(countries.features.filter(d => VISITED.has(+d.id)))
            .enter().append('path')
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', 'var(--accent)')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);

        // Rooted city outer rings (drawn first, behind the fill dot)
        svg.selectAll('.city-ring')
            .data(CITIES.filter(d => d.rooted))
            .enter().append('circle')
            .attr('cx', d => projection([d.lon, d.lat])[0])
            .attr('cy', d => projection([d.lon, d.lat])[1])
            .attr('r', 6.5)
            .attr('fill', 'none')
            .attr('stroke', '#5C3D20')
            .attr('stroke-width', 1)
            .attr('opacity', 0.45);

        // City dots
        svg.selectAll('.city-dot')
            .data(CITIES)
            .enter().append('circle')
            .attr('class', 'city-dot')
            .attr('cx', d => projection([d.lon, d.lat])[0])
            .attr('cy', d => projection([d.lon, d.lat])[1])
            .attr('r', d => d.rooted ? 4 : 2.5)
            .attr('fill', d => d.rooted ? '#5C3D20' : 'var(--accent)')
            .attr('stroke', 'var(--bg)')
            .attr('stroke-width', 1)
            .attr('opacity', 0.9)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('r', d.rooted ? 5.5 : 4).attr('opacity', 1);
                if (tooltip) {
                    tooltip.textContent = d.name;
                    tooltip.style.opacity = '1';
                }
            })
            .on('mousemove', function (event) {
                if (!tooltip || !mapWrap) return;
                const rect = mapWrap.getBoundingClientRect();
                tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
                tooltip.style.top  = (event.clientY - rect.top  - 32) + 'px';
            })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('r', d.rooted ? 4 : 2.5).attr('opacity', 0.9);
                if (tooltip) tooltip.style.opacity = '0';
            });

    } catch (e) {
        console.error('Map failed to load:', e);
    }
})();


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
