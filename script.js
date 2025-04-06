// --- DOM Elements Cache ---
const elements = {
    header: document.querySelector('header'),
    mobileMenuBtn: document.querySelector('.mobile-menu'),
    mobileNav: document.querySelector('.mobile-nav'),
    themeToggle: document.querySelector('.theme-toggle'),
    preloader: document.querySelector('.preloader'),
    notificationBanner: document.querySelector('.notification-banner'),
    notificationClose: document.querySelector('.notification-close'),
    navLinks: document.querySelectorAll('nav a[href^="#"], .mobile-nav a[href^="#"]'),
    sections: document.querySelectorAll('main section[id]'), // Target sections within main
    portfolioFilters: document.querySelectorAll('.portfolio-filter'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    lazyImages: document.querySelectorAll('img[data-src]'),
    modalTriggers: document.querySelectorAll('[data-modal-trigger]'),
    modals: document.querySelectorAll('.modal')
};

// --- Configuration ---
const SCROLL_OFFSET = elements.header ? elements.header.offsetHeight + 20 : 100; // Dynamic offset + extra space
const LAZY_LOAD_MARGIN = '200px'; // Load images 200px before they enter viewport

// --- State ---
let currentTheme = localStorage.getItem('theme') || 'dark';
let isMobileMenuOpen = false;
let lastScroll = 0;
let scrollTicking = false;

// --- Initialization ---
function initializeWebsite() {
    console.log("Initializing website..."); // Debug log

    // Check if essential elements exist
    if (!elements.header) console.warn("Header element not found.");
    if (!elements.mobileMenuBtn) console.warn("Mobile menu button not found.");
    if (!elements.mobileNav) console.warn("Mobile navigation element not found.");
    if (!elements.themeToggle) console.warn("Theme toggle button not found.");

    setInitialTheme();
    initializePreloader();
    initializeMobileMenu();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeActiveNavHighlighting();
    initializePortfolioFiltering();
    initializeLazyLoading();
    initializeModals();
    adjustBodyPadding(); // Call initially

    console.log("Website initialization complete."); // Debug log
}

// --- Theme Management ---
function setInitialTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    // The CSS now handles the icon display based on the data-theme attribute
    // No specific JS update needed here if using the CSS approach
}

// --- Preloader ---
function initializePreloader() {
    if (!elements.preloader) return;
    window.addEventListener('load', () => {
        setTimeout(() => { // Ensure minimum display time
            elements.preloader.classList.add('fade-out');
            // Remove from DOM after transition
            elements.preloader.addEventListener('transitionend', () => {
                elements.preloader.remove();
            }, { once: true });
        }, 500); // Adjust timing as needed
    }, { once: true });
}

// --- Notification Banner ---
function initializeNotificationBanner() {
    if (!elements.notificationBanner || !elements.notificationClose) {
        adjustBodyPadding(); // Adjust padding in case banner is initially present
        return;
    }

    elements.notificationClose.addEventListener('click', () => {
        elements.notificationBanner.style.height = elements.notificationBanner.offsetHeight + 'px';
        elements.notificationBanner.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            elements.notificationBanner.style.height = '0';
            elements.notificationBanner.style.paddingTop = '0';
            elements.notificationBanner.style.paddingBottom = '0';
            elements.notificationBanner.style.opacity = '0';

            elements.notificationBanner.addEventListener('transitionend', () => {
                if (elements.notificationBanner) { // Check if it wasn't already removed
                    elements.notificationBanner.remove();
                    adjustBodyPadding(); // Adjust padding after banner is removed
                }
            }, { once: true });
        });
    });
}

// --- Mobile Menu ---
function initializeMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.mobileNav) return;

    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen &&
            !elements.mobileNav.contains(e.target) &&
            !elements.mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking a link inside it
    elements.mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
}

function openMobileMenu() {
    if (isMobileMenuOpen || !elements.mobileNav || !elements.mobileMenuBtn) return;
    isMobileMenuOpen = true;
    elements.mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
    elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    // Optional: Change icon to close (X)
    elements.mobileMenuBtn.querySelector('i').className = 'ph ph-x';
}

function closeMobileMenu() {
    if (!isMobileMenuOpen || !elements.mobileNav || !elements.mobileMenuBtn) return;
    isMobileMenuOpen = false;
    elements.mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
     // Optional: Change icon back to list
    elements.mobileMenuBtn.querySelector('i').className = 'ph ph-list';
}

// --- Theme Toggle ---
function initializeThemeToggle() {
    if (!elements.themeToggle) return;
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// --- Smooth Scrolling ---
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link
            if (targetId.length <= 1) return; 

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault(); // Only prevent default if target exists
                const elementPosition = targetElement.offsetTop;
                // Recalculate header height dynamically if needed, or use constant
                const currentHeaderHeight = elements.header ? elements.header.offsetHeight : 80;
                const offsetPosition = elementPosition - currentHeaderHeight - 20; // Adjust offset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
            } else {
                 console.warn(`Smooth scroll target not found: ${targetId}`);
            }
        });
    });
}

// --- Header Scroll Effect ---
function initializeHeaderScrollEffect() {
    if (!elements.header) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function handleScroll() {
    const currentScroll = window.scrollY;

    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            // Toggle scrolled class for background/shadow
            elements.header.classList.toggle('scrolled', currentScroll > 50);

            elements.header.style.transform = 'translateY(0)'; // Ensure header stays visible

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

// --- Active Navigation Highlighting (using Intersection Observer) ---
function initializeActiveNavHighlighting() {
    if (!elements.sections.length || !elements.navLinks.length) {
        console.warn('Active nav highlighting cannot initialize: Sections or NavLinks missing.');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: `-${SCROLL_OFFSET}px 0px -50% 0px`, // Adjust top/bottom margin
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        let bestVisibleSectionId = null;
        let maxVisibleRatio = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
                 maxVisibleRatio = entry.intersectionRatio;
                 bestVisibleSectionId = entry.target.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${bestVisibleSectionId}`) {
                link.classList.add('active');
            }
        });

    }, observerOptions);

    elements.sections.forEach(section => {
        observer.observe(section);
    });
}

// --- Portfolio Filtering ---
function initializePortfolioFiltering() {
    if (!elements.portfolioFilters.length || !elements.portfolioItems.length) {
        console.warn('Portfolio filtering cannot initialize: Filters or Items missing.');
        return;
    }

    // Set initial state (show all)
    filterPortfolioItems('*');

    elements.portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            elements.portfolioFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.dataset.filter;
            filterPortfolioItems(filterValue);
        });
    });
}

function filterPortfolioItems(filter) {
    elements.portfolioItems.forEach(item => {
        const itemCategories = item.dataset.categories?.split(' ') || [];
        const shouldShow = filter === '*' || itemCategories.includes(filter);

        // Animate and manage display/focus
        if (shouldShow) {
            item.style.pointerEvents = '';
            item.removeAttribute('tabindex');
            item.style.display = ''; // Reset display before animation
            // Force reflow before adding animation class/styles if needed
             // item.offsetHeight; 
            requestAnimationFrame(() => {
                 item.style.opacity = '1';
                 item.style.transform = 'scale(1)';
             });

        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.pointerEvents = 'none';
            item.setAttribute('tabindex', '-1');
            // Hide completely after transition
            item.addEventListener('transitionend', () => {
                if (item.style.opacity === '0') { // Check if it should still be hidden
                     item.style.display = 'none';
                }
            }, { once: true });
        }
    });
}

// --- Lazy Loading Images ---
function initializeLazyLoading() {
    if (!elements.lazyImages.length) return;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: `0px 0px ${LAZY_LOAD_MARGIN} 0px`,
            threshold: 0
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (!src) {
                         console.warn('Lazy image missing data-src:', img);
                         observer.unobserve(img);
                         return;
                    }
                    
                    img.src = src;
                    img.removeAttribute('data-src'); // Remove data-src
                    img.onload = () => {
                        img.classList.add('loaded'); // Add class for CSS transition
                    };
                     img.onerror = () => {
                         console.error('Error loading image:', src);
                         // Optional: Show a fallback image or style
                         img.classList.add('error'); 
                     };
                    observer.unobserve(img); // Stop observing once triggered
                }
            });
        }, observerOptions);

        elements.lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        console.warn('IntersectionObserver not supported. Loading all images immediately.');
        elements.lazyImages.forEach(img => {
             const src = img.dataset.src;
             if (src) {
                 img.src = src;
                 img.removeAttribute('data-src');
                 img.classList.add('loaded'); // Add loaded class immediately
             }
        });
    }
}

// --- Modal Functionality ---
function initializeModals() {
    if (!elements.modalTriggers.length || !elements.modals.length) {
        console.warn('Modal functionality cannot initialize: Triggers or Modals missing.');
        return;
    }

    elements.modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modalTrigger;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                openModal(targetModal);
            } else {
                console.warn(`Modal with ID '${modalId}' not found.`);
            }
        });
    });

    elements.modals.forEach(modal => {
        // Find close triggers within *this specific* modal
        const closeTriggers = modal.querySelectorAll('[data-modal-close]');
        closeTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // Don't prevent default if it's a link inside the modal we might want to follow
                // e.preventDefault(); 
                closeModal(modal);
            });
        });

         // Optional: Close on Escape key press
         // We add the listener only when a modal is open for efficiency
    });
}

function openModal(modal) {
    if (!modal) return;

    // Add listener for Escape key
    document.addEventListener('keydown', handleEscapeKey);

    modal.classList.remove('closing'); // Remove closing class if it exists
    modal.style.display = 'flex'; // Set display before triggering animation
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Use rAF to ensure display:flex is applied before adding active class
    requestAnimationFrame(() => {
         modal.classList.add('active');
         modal.setAttribute('aria-hidden', 'false');

         // Focus management: focus the container or the first focusable element
         const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
         const firstFocusable = focusableElements.length > 0 ? focusableElements[0] : modal.querySelector('.modal-container');
         firstFocusable?.focus();
    });
}

function closeModal(modal) {
    if (!modal) return;

     // Remove listener for Escape key
    document.removeEventListener('keydown', handleEscapeKey);

    modal.classList.add('closing');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling

    modal.addEventListener('animationend', () => {
        // Only hide if the closing animation finished
        if (modal.classList.contains('closing')) {
             modal.classList.remove('active', 'closing');
             modal.style.display = 'none';
        }
    }, { once: true });
}

// Separate function to handle Escape key, added/removed in open/closeModal
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal);
        }
    }
}

// --- Utility: Adjust Body Padding ---
function adjustBodyPadding() {
    let totalOffset = 0;
    if (elements.header) {
        totalOffset += elements.header.offsetHeight;
    }
    // Check if notification banner exists *in the DOM*
    const currentBanner = document.querySelector('.notification-banner');
    if (currentBanner && getComputedStyle(currentBanner).display !== 'none') {
         // Ensure banner height calculation is accurate
        totalOffset += currentBanner.offsetHeight;
    }
    console.log("Adjusting body padding-top to:", totalOffset); // Debug log
    document.body.style.paddingTop = `${totalOffset}px`;
}

// --- Run Initializers ---
document.addEventListener('DOMContentLoaded', initializeWebsite);

// --- Add listener for resize events to readjust padding ---
window.addEventListener('resize', debounce(adjustBodyPadding, 200));

// --- Helper Functions (Example: Debounce) ---
function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}; 