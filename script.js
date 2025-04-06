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
    modals: document.querySelectorAll('.modal'),
    scrollTopBtn: document.querySelector('.scroll-top'), // Back to top button
    scrollTopProgress: document.querySelector('.progress-ring__circle') // Progress circle
};

// --- Configuration ---
// const SCROLL_OFFSET = elements.header ? elements.header.offsetHeight + 20 : 100; // Removed initial calculation
const LAZY_LOAD_MARGIN = '200px';

// --- State ---
let currentTheme = localStorage.getItem('theme') || 'dark';
let isMobileMenuOpen = false;
let lastScroll = 0;
let scrollTicking = false;
let lastFocusedElement = null; // Variable to store the element focused before modal opens
let progressCircleCircumference = 0; // Store circumference for progress

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
    initializeScrollTopButton(); // Initialize back-to-top button

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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('header'); // Get header element

            if (targetElement && header) {
                const headerOffset = header.offsetHeight; // Use dynamic header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileNav = document.getElementById('mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                     toggleMobileMenu(); // Ensure toggleMobileMenu is accessible or defined here
                }
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

    // Define header height here, ensuring header exists
    const headerHeight = elements.header ? elements.header.offsetHeight : 80; // Use a fallback
    const topMargin = headerHeight + 20; // Add a little extra space

    const observerOptions = {
        root: null,
        // Use calculated offset for top margin
        rootMargin: `-${topMargin}px 0px -50% 0px`, 
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
                // Store the element that triggered the modal
                lastFocusedElement = document.activeElement;
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
    // Add listener for focus trapping
    modal.addEventListener('keydown', handleFocusTrap);

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
    // Remove listener for focus trapping
    modal.removeEventListener('keydown', handleFocusTrap);

    modal.classList.add('closing');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling

    modal.addEventListener('animationend', () => {
        // Only hide if the closing animation finished
        if (modal.classList.contains('closing')) {
             modal.classList.remove('active', 'closing');
             modal.style.display = 'none';

            // Restore focus to the element that opened the modal
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null; // Clear after use
            }
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

// Function to handle focus trapping within the modal
function handleFocusTrap(event) {
    if (event.key !== 'Tab') return;

    const modal = event.currentTarget; // The modal element itself
    const focusableElements = Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.offsetParent !== null); // Filter out hidden elements

    if (focusableElements.length === 0) return; // No focusable elements

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const currentFocus = document.activeElement;

    if (event.shiftKey) { // Shift + Tab
        if (currentFocus === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        }
    } else { // Tab
        if (currentFocus === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
}

// --- Back to Top Button --- // Added Section
function initializeScrollTopButton() {
    if (!elements.scrollTopBtn || !elements.scrollTopProgress) {
        console.warn('Scroll top button or progress circle not found.');
        return;
    }

    // Calculate circumference
    const radius = elements.scrollTopProgress.r.baseVal.value;
    progressCircleCircumference = 2 * Math.PI * radius;

    // Set initial dash array and offset
    elements.scrollTopProgress.style.strokeDasharray = `${progressCircleCircumference} ${progressCircleCircumference}`;
    elements.scrollTopProgress.style.strokeDashoffset = progressCircleCircumference;

    // Hide initially
    elements.scrollTopBtn.hidden = true;

    // Add click listener
    elements.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial check in case the page loads scrolled down
    updateOnScroll(); 
}

// Function to update scroll-related elements (Header, Back-to-Top)
function updateOnScroll() {
    const currentScroll = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = document.documentElement.clientHeight;

    // Toggle header scrolled class
    if (elements.header) {
        elements.header.classList.toggle('scrolled', currentScroll > 50);
        elements.header.style.transform = 'translateY(0)'; // Ensure header stays visible
    }

    // Back to Top Button Logic
    if (elements.scrollTopBtn && elements.scrollTopProgress) {
        const scrollableHeight = pageHeight - viewportHeight;

        if (scrollableHeight > 0) {
            const scrollPercentage = (currentScroll / scrollableHeight);
            const progressOffset = progressCircleCircumference * (1 - scrollPercentage);
            elements.scrollTopProgress.style.strokeDashoffset = Math.max(0, Math.min(progressOffset, progressCircleCircumference));

            // Show/Hide Button
            if (currentScroll > viewportHeight * 0.8) { // Show after scrolling 80% of viewport height
                elements.scrollTopBtn.hidden = false;
                elements.scrollTopBtn.classList.add('visible'); // Add class for potential CSS transitions
            } else {
                elements.scrollTopBtn.hidden = true;
                elements.scrollTopBtn.classList.remove('visible');
            }
        } else {
            // Hide if page isn't scrollable
            elements.scrollTopBtn.hidden = true;
            elements.scrollTopBtn.classList.remove('visible');
            elements.scrollTopProgress.style.strokeDashoffset = progressCircleCircumference;
        }
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
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
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
    AOS.init({ // Initialize AOS
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });
    initializeTypedJs(); // Initialize Typed.js
    initializeLightGallery(); // Initialize LightGallery
});

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

// --- Initialize Typed.js --- // Added Section
function initializeTypedJs() {
    const typedElement = document.getElementById('typed-output');
    if (typedElement) {
        const typed = new Typed('#typed-output', {
            strings: [
                'Motion Designer',
                'Graphic Designer',
                'AI Enthusiast'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true,
            smartBackspace: true // Default value
        });
    } else {
        console.warn('Typed.js target element #typed-output not found.');
    }
}

// --- Initialize lightGallery --- // Added Section
function initializeLightGallery() {
    const galleryContainer = document.getElementById('lightgallery-container');
    if (galleryContainer) {
        lightGallery(galleryContainer, {
            selector: '.portfolio-item > a', // Target the link within each item
            plugins: [lgZoom, lgThumbnail], // Enable zoom and thumbnail plugins
            thumbnail: true,
            licenseKey: 'YOUR_LICENSE_KEY', // Optional: Add license key if you have one
            speed: 500,
            download: false // Optional: Disable download button
        });
    } else {
        console.warn('lightGallery container #lightgallery-container not found.');
    }
} 