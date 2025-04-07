// --- Component Specific State ---
let lastFocusedElement = null;
let progressCircleCircumference = 0; 

// --- Lazy Loading Images ---
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const LAZY_LOAD_MARGIN = '200px'; // Config specific to lazy loading

    if (!lazyImages.length) return;

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
                    img.removeAttribute('data-src'); 
                    img.onload = () => {
                        img.classList.add('loaded'); 
                    };
                     img.onerror = () => {
                         console.error('Error loading image:', src);
                         img.classList.add('error'); 
                     };
                    observer.unobserve(img); 
                }
            });
        }, observerOptions);

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        console.warn('IntersectionObserver not supported. Loading all images immediately.');
        lazyImages.forEach(img => {
             const src = img.dataset.src;
             if (src) {
                 img.src = src;
                 img.removeAttribute('data-src');
                 img.classList.add('loaded'); 
             }
        });
    }
}

// --- Modal Functionality ---
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = document.querySelectorAll('.modal');

    if (!modalTriggers.length || !modals.length) {
        // console.warn('Modal functionality cannot initialize: Triggers or Modals missing.');
        return; // Don't warn if no modals are intended
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modalTrigger;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                lastFocusedElement = document.activeElement;
                openModal(targetModal);
            } else {
                console.warn(`Modal with ID '${modalId}' not found.`);
            }
        });
    });

    modals.forEach(modal => {
        const closeTriggers = modal.querySelectorAll('[data-modal-close]');
        closeTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                closeModal(modal);
            });
        });
    });
}

function openModal(modal) {
    if (!modal) return;

    document.addEventListener('keydown', handleEscapeKey, { capture: true }); // Use capture
    modal.addEventListener('keydown', handleFocusTrap);

    modal.classList.remove('closing'); 
    modal.style.display = 'flex'; 
    document.body.style.overflow = 'hidden'; 

    requestAnimationFrame(() => {
         modal.classList.add('active');
         modal.setAttribute('aria-hidden', 'false');

         const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
         const firstFocusable = focusableElements.length > 0 ? focusableElements[0] : modal.querySelector('.modal-container');
         // Delay focus slightly to ensure modal is fully rendered
         setTimeout(() => firstFocusable?.focus(), 50);
    });
}

function closeModal(modal) {
    if (!modal || !modal.classList.contains('active')) return;

    document.removeEventListener('keydown', handleEscapeKey, { capture: true });
    modal.removeEventListener('keydown', handleFocusTrap);

    modal.classList.add('closing');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; 

    modal.addEventListener('animationend', () => {
        if (modal.classList.contains('closing')) {
             modal.classList.remove('active', 'closing');
             modal.style.display = 'none';
             if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null; 
            }
        }
    }, { once: true });
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
             event.stopPropagation(); // Prevent other escape listeners if modal is open
            closeModal(activeModal);
        }
    }
}

function handleFocusTrap(event) {
    if (event.key !== 'Tab') return;

    const modal = event.currentTarget; 
    const focusableElements = Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.offsetParent !== null); 

    if (focusableElements.length === 0) return; 

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Check if the currently focused element is INSIDE the modal
    if (!modal.contains(document.activeElement)) {
        // If focus somehow escaped, bring it back to the first element
         event.preventDefault();
         firstFocusable.focus();
         return;
    }

    if (event.shiftKey) { 
        if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        }
    } else { 
        if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
}

// --- Back to Top Button --- 
function initializeScrollTopButton() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollTopProgress = document.querySelector('.progress-ring__circle'); 

    if (!scrollTopBtn || !scrollTopProgress) {
        console.warn('Scroll top button or progress circle not found.');
        return;
    }

    const radius = scrollTopProgress.r.baseVal.value;
    progressCircleCircumference = 2 * Math.PI * radius;

    scrollTopProgress.style.strokeDasharray = `${progressCircleCircumference} ${progressCircleCircumference}`;
    scrollTopProgress.style.strokeDashoffset = progressCircleCircumference;

    scrollTopBtn.hidden = true;
    scrollTopBtn.classList.remove('visible'); // Ensure hidden initially

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Listen to scroll events (could be combined with header scroll)
    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    handleScrollTopVisibility(); // Initial check
}

function handleScrollTopVisibility() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollTopProgress = document.querySelector('.progress-ring__circle'); 
    if (!scrollTopBtn || !scrollTopProgress) return;

    const currentScroll = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = document.documentElement.clientHeight;
    const scrollableHeight = pageHeight - viewportHeight;

    if (scrollableHeight > 0) {
        const scrollPercentage = (currentScroll / scrollableHeight);
        const progressOffset = progressCircleCircumference * (1 - scrollPercentage);
        scrollTopProgress.style.strokeDashoffset = Math.max(0, Math.min(progressOffset, progressCircleCircumference));

        if (currentScroll > viewportHeight * 0.5) { // Show after scrolling 50% VH
            if (scrollTopBtn.hidden) {
                 scrollTopBtn.hidden = false;
                 // Trigger transition by adding class slightly after display change
                 requestAnimationFrame(() => scrollTopBtn.classList.add('visible'));
            }
        } else {
            if (!scrollTopBtn.hidden) {
                 scrollTopBtn.classList.remove('visible');
                 // Hide with display:none after transition
                 scrollTopBtn.addEventListener('transitionend', () => {
                     if (!scrollTopBtn.classList.contains('visible')) { // Double check state
                         scrollTopBtn.hidden = true;
                     }
                 }, { once: true });
            }
        }
    } else {
        scrollTopBtn.hidden = true;
        scrollTopBtn.classList.remove('visible');
        scrollTopProgress.style.strokeDashoffset = progressCircleCircumference;
    }
}

// --- Preloader --- 
function initializePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
        console.warn('Preloader element not found.');
        return;
    }
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
        }, { once: true });
    });
}

// --- Cookie Consent --- 
function initializeCookieConsent() {
    const cookieConsentBanner = document.getElementById('cookie-consent');
    const cookieAcceptBtn = document.querySelector('.cookie-accept');
    // Add settings button if logic is implemented later
    // const cookieSettingsBtn = document.querySelector('.cookie-settings'); 

    if (!cookieConsentBanner || !cookieAcceptBtn) {
        // console.warn('Cookie consent elements not found.'); // Don't warn if not used
        return;
    }

    const consentGiven = localStorage.getItem('cookieConsent');

    if (!consentGiven) {
        setTimeout(() => {
            cookieConsentBanner.hidden = false;
             // Force reflow before adding class
            cookieConsentBanner.offsetHeight; 
            cookieConsentBanner.classList.add('visible');
        }, 1500); 
    }

    cookieAcceptBtn.addEventListener('click', () => {
        cookieConsentBanner.classList.remove('visible');
        localStorage.setItem('cookieConsent', 'true');
        cookieConsentBanner.addEventListener('transitionend', () => {
            cookieConsentBanner.hidden = true;
        }, { once: true });
    });
}

// --- Fullscreen Image Viewer --- 
const fullscreenViewer = document.getElementById('fullscreen-viewer');
const fullscreenImage = document.getElementById('fullscreen-image');
const fullscreenCloseBtn = fullscreenViewer?.querySelector('.fullscreen-close');

function initializeFullscreenViewer() {
    const clickableItems = document.querySelectorAll('.showcase-item-clickable');

    if (!fullscreenViewer || !fullscreenImage || !fullscreenCloseBtn) {
        console.warn("Fullscreen viewer elements not found. Viewer disabled.");
        return;
    }

    clickableItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.dataset.fullscreenSrc;
            if (imgSrc) {
                openFullscreen(imgSrc);
            } else {
                console.warn('Clicked showcase item missing data-fullscreen-src attribute.');
            }
        });
    });

    fullscreenCloseBtn.addEventListener('click', closeFullscreen);
    // Close viewer if user clicks on the background overlay
    fullscreenViewer.addEventListener('click', (e) => {
        if (e.target === fullscreenViewer) { // Check if the click is on the overlay itself
            closeFullscreen();
        }
    });

    // Close viewer with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenViewer.classList.contains('active')) {
            closeFullscreen();
        }
    });

    console.log("Fullscreen viewer initialized.");
}

function openFullscreen(src) {
    if (!fullscreenViewer || !fullscreenImage) return;

    fullscreenImage.src = src; // Set the image source
    fullscreenViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    fullscreenViewer.classList.add('active');
    fullscreenCloseBtn.focus(); // Focus the close button for accessibility
}

function closeFullscreen() {
    if (!fullscreenViewer) return;

    fullscreenViewer.classList.remove('active');
    fullscreenViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scroll
    // Optionally clear the src after transition ends to save memory
    fullscreenViewer.addEventListener('transitionend', () => {
        if (!fullscreenViewer.classList.contains('active')) {
            fullscreenImage.src = ''; 
        }
    }, { once: true });
}

// --- Utility: Announce Status (Accessibility) --- 
// ... existing code ... 