// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for in-page section links (e.g. #about, #skills, #contact)
document.querySelectorAll('a[href^="#"]:not([href="#"]):not(.cert-modal-btn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#') || href === '#') return;
        try {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            // Not a valid selector, let default navigation proceed
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .about-text, .skills');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// Add click tracking for analytics (placeholder)
function trackClick(element, action) {
    // Placeholder for analytics tracking
    console.log(`Tracked: ${action} on ${element}`);
}

// Track project link clicks
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const projectName = e.target.closest('.project-card').querySelector('h3').textContent;
        trackClick(e.target, `Project link clicked: ${projectName}`);
    });
});

// Track contact link clicks
document.querySelectorAll('.contact-item').forEach(link => {
    link.addEventListener('click', (e) => {
        const contactType = e.target.textContent.trim();
        trackClick(e.target, `Contact link clicked: ${contactType}`);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Initialize all functionality safely
document.addEventListener('DOMContentLoaded', () => {
    // Check if required elements exist before adding event listeners
    const requiredElements = [
        { selector: '#hamburger', name: 'hamburger menu' },
        { selector: '#nav-menu', name: 'navigation menu' },
        { selector: '#navbar', name: 'navbar' }
    ];
    
    requiredElements.forEach(({ selector, name }) => {
        if (!safeQuerySelector(selector)) {
            console.warn(`${name} element not found`);
        }
    });
});

// Add service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Contact form submission: tries Formspree when data-endpoint is set on the form,
// otherwise falls back to opening the user's email client via mailto:.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = form.querySelector('.form-status');
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending...';

        const formData = new FormData(form);
        const payload = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            message: formData.get('message') || ''
        };

        const endpoint = form.getAttribute('data-endpoint') || '';
        try {
            if (endpoint) {
                // POST to Formspree or any endpoint that accepts JSON
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    if (statusEl) statusEl.textContent = 'Message sent — thank you!';
                    form.reset();
                } else {
                    const text = await res.text();
                    if (statusEl) statusEl.textContent = 'Sending failed. Please try again or email directly.';
                    console.error('Form submission error:', text);
                }
            } else {
                // Fallback: open mail client using mailto:
                const subject = encodeURIComponent('Portfolio contact from ' + payload.name);
                const body = encodeURIComponent(payload.message + '\n\nFrom: ' + payload.name + ' <' + payload.email + '>');
                window.location.href = `mailto:mazen.shams6999@gmail.com?subject=${subject}&body=${body}`;
                if (statusEl) statusEl.textContent = 'Opening mail client...';
            }
        } catch (err) {
            console.error('Contact form error', err);
            if (statusEl) statusEl.textContent = 'An unexpected error occurred. Try emailing directly.';
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (statusEl) setTimeout(() => { statusEl.textContent = ''; }, 5000);
        }
    });
});

// Copy email button handler (small feedback)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-email');
    if (!btn) return;
    const email = btn.getAttribute('data-email');
    if (!email) return;
    navigator.clipboard?.writeText(email).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Copied';
        setTimeout(() => btn.innerHTML = orig, 1800);
    }).catch(() => {
        // fallback: select text
        const el = document.getElementById('primary-email');
        if (el) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
});

// ==========================================================================
// Certificate Lightbox Modal Implementation
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const certModal = document.getElementById('certModal');
    if (!certModal) return;

    const modalImg = document.getElementById('certModalImg');
    const modalTitle = document.getElementById('certModalTitle');
    const modalOrg = document.getElementById('certModalOrg');
    const modalDate = document.getElementById('certModalDate');
    const modalId = document.getElementById('certModalId');
    const modalLink = document.getElementById('certModalExternalLink');
    const closeBtn = document.getElementById('certModalClose');
    const dismissBtn = document.getElementById('certModalDismiss');
    const backdrop = document.getElementById('certModalBackdrop');

    function openModal(data) {
        modalImg.src = data.img || '';
        modalImg.alt = data.title || 'Certificate preview';
        modalTitle.textContent = data.title || 'Certificate Preview';
        modalOrg.textContent = data.org || '';
        modalDate.textContent = data.date || '';
        modalId.textContent = data.id || '';

        if (data.verify) {
            modalLink.href = data.verify;
            modalLink.setAttribute('href', data.verify);
            modalLink.style.display = 'inline-flex';
            const linkText = modalLink.querySelector('span');
            if (linkText) {
                if (data.verify.includes('credly.com')) {
                    linkText.textContent = 'Verify on Credly';
                } else if (data.verify.includes('datacamp.com')) {
                    linkText.textContent = 'Verify on DataCamp';
                } else if (data.verify.includes('udacity.com')) {
                    linkText.textContent = 'Verify on Udacity';
                } else if (data.verify.includes('efset.org')) {
                    linkText.textContent = 'Verify on EF SET';
                } else if (data.verify.endsWith('.png') || data.verify.endsWith('.jpg') || data.verify.endsWith('.pdf')) {
                    linkText.textContent = 'View Full Certificate';
                } else {
                    linkText.textContent = 'Verify Credential';
                }
            }
            modalImg.style.cursor = 'pointer';
            modalImg.title = 'Click to open verification page';
            modalImg.onclick = () => {
                window.open(data.verify, '_blank', 'noopener,noreferrer');
            };
        } else {
            modalLink.style.display = 'none';
            modalLink.removeAttribute('href');
            modalImg.style.cursor = 'default';
            modalImg.title = '';
            modalImg.onclick = null;
        }

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!certModal.classList.contains('active')) {
                modalImg.src = '';
            }
        }, 250);
    }

    // Attach click listener to all certificate triggers
    document.querySelectorAll('.cert-lightbox-trigger, [data-cert-img]').forEach(el => {
        el.addEventListener('click', (e) => {
            const img = el.getAttribute('data-cert-img');
            if (!img) return;

            e.preventDefault();
            openModal({
                img: img,
                title: el.getAttribute('data-cert-title') || el.querySelector('h4')?.textContent || '',
                org: el.getAttribute('data-cert-org') || el.querySelector('.cert-org')?.textContent || '',
                date: el.getAttribute('data-cert-date') || el.querySelector('.cert-date')?.textContent || '',
                id: el.getAttribute('data-cert-id') || el.querySelector('.cert-id')?.textContent || '',
                verify: el.getAttribute('data-cert-verify') || el.getAttribute('href') || ''
            });
        });
    });

    // Explicit click handler for modalLink to guarantee reliable external navigation
    modalLink?.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = modalLink.getAttribute('href');
        if (href && href !== '#' && href !== 'javascript:void(0)' && href !== '') {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    });

    closeBtn?.addEventListener('click', closeModal);
    dismissBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeModal();
        }
    });
});

// ==========================================================================
// Dynamic Age Calculation (Birthdate: January 1, 2001)
// ==========================================================================
function updateDynamicAge() {
    const ageEl = document.getElementById('dynamicAge');
    if (!ageEl) return;

    const birthdateStr = ageEl.getAttribute('data-birthdate') || '2001-01-01';
    const [birthYear, birthMonth, birthDay] = birthdateStr.split('-').map(Number);
    const today = new Date();

    let age = today.getFullYear() - birthYear;
    const monthDiff = (today.getMonth() + 1) - birthMonth;
    const dayDiff = today.getDate() - birthDay;

    // Adjust if birthday has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    ageEl.textContent = age;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDynamicAge);
} else {
    updateDynamicAge();
}
