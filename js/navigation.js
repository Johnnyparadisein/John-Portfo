// --- Navigation Specific State ---
let isMobileMenuOpen = false;
let scrollTicking = false;
let lastScroll = 0;

// --- Mobile Menu ---
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const scrim = document.querySelector('.scrim'); // Assume scrim exists

    if (!mobileMenuBtn || !mobileNav) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking outside or on the scrim
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen &&
            !mobileNav.contains(e.target) &&
            !mobileMenuBtn.contains(e.target) &&
            e.target !== scrim) { // Don't close if scrim clicked directly (handled by scrim listener)
            closeMobileMenu();
        }
    });

    if (scrim) {
        scrim.addEventListener('click', closeMobileMenu); 
    }

    // Close menu when clicking a link inside it
    mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            // Smooth scroll handles closing, no need to call closeMobileMenu here
            // Unless smooth scroll is disabled or fails, then: closeMobileMenu();
        });
    });
}

function toggleMobileMenu() {
    isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
}

function openMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const scrim = document.querySelector('.scrim');

    if (isMobileMenuOpen || !mobileNav || !mobileMenuBtn) return;
    isMobileMenuOpen = true;
    mobileNav.classList.add('active');
    if(scrim) scrim.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenuBtn.querySelector('i').className = 'ph ph-x'; // Change to close icon
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const scrim = document.querySelector('.scrim');

    if (!isMobileMenuOpen || !mobileNav || !mobileMenuBtn) return;
    isMobileMenuOpen = false;
    mobileNav.classList.remove('active');
    if(scrim) scrim.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.querySelector('i').className = 'ph ph-list'; // Change back to list icon
}

// --- Smooth Scrolling ---
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link
            if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('header'); 
                const headerOffset = header ? header.offsetHeight : 0; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if it's open and the click was inside it
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active') && mobileNav.contains(this)) {
                    closeMobileMenu();
                }
                 // Close sitemap modal if link clicked inside it
                 const sitemapModal = this.closest('.modal');
                 if (sitemapModal && sitemapModal.id === 'sitemap-modal') {
                     closeModal(sitemapModal); // Assumes closeModal is globally available or imported
                 }
            }
        });
    });
}

// --- Header Scroll Effect ---
function initializeHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
     // Initial check
     handleHeaderScroll(); 
}

function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    const header = document.querySelector('header');
    if (!header) return;

    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            header.classList.toggle('scrolled', currentScroll > 50);
            // Header show/hide logic (optional)
            // if (currentScroll > lastScroll && currentScroll > header.offsetHeight){
            //     // Scrolling down - hide header
            //     header.style.transform = `translateY(-${header.offsetHeight}px)`;
            // } else {
            //     // Scrolling up or near top - show header
            //     header.style.transform = 'translateY(0)';
            // }
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

// --- Active Navigation Highlighting ---
function initializeActiveNavHighlighting() {
    const sections = document.querySelectorAll('main section[id]'); 
    const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-nav a[href^="#"]');
    const header = document.querySelector('header');

    if (!sections.length || !navLinks.length) {
        console.warn('Active nav highlighting cannot initialize: Sections or NavLinks missing.');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: `-${header ? header.offsetHeight + 20 : 100}px 0px -50% 0px`, 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        let bestVisibleSectionId = null;
        let maxVisibleRatio = 0;

        entries.forEach(entry => {
            // Prioritize fully visible sections or sections closer to the top
            if (entry.isIntersecting) {
                // Option 1: Prioritize highest intersection ratio
                // if (entry.intersectionRatio > maxVisibleRatio) {
                //     maxVisibleRatio = entry.intersectionRatio;
                //     bestVisibleSectionId = entry.target.getAttribute('id');
                // }

                 // Option 2: Prioritize the first intersecting element from the top
                 // This often feels more natural for nav highlighting
                 if (bestVisibleSectionId === null) {
                      bestVisibleSectionId = entry.target.getAttribute('id');
                 }
            }
        });
        
        // If scrolled to the bottom, ensure the last section is active
        const bottomReached = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2; // Add tolerance
        if(bottomReached && sections.length > 0) {
             bestVisibleSectionId = sections[sections.length - 1].id;
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${bestVisibleSectionId}`) {
                link.classList.add('active');
            }
        });

    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// --- Adjust Body Padding based on Header Height ---
function adjustBodyPadding() {
    const header = document.querySelector('header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = `${headerHeight}px`;
        // console.log("Adjusting body padding-top to:", headerHeight); 
    } else {
         document.body.style.paddingTop = `0px`;
    }
}

// --- Initialize Navigation Related Functions ---
function initializeNavigation() {
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeActiveNavHighlighting();
    adjustBodyPadding(); // Call initially
    window.addEventListener('resize', debounce(adjustBodyPadding, 100)); // Adjust on resize
}

// Debounce function (needed here or globally)
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