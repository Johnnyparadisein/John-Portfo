// --- Initialize AOS (Animate on Scroll) ---
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, 
            easing: 'ease-in-out', 
            once: true, 
            mirror: false, 
            anchorPlacement: 'top-bottom', 
        });
    } else {
        console.warn('AOS library not loaded.');
    }
}

// --- Initialize Typed.js ---
function initializeTypedJs() {
    const typedElement = document.getElementById('typed-output');
    if (typedElement && typeof Typed !== 'undefined') {
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
            smartBackspace: true
        });
    } else {
        if (!typedElement) console.warn('Typed.js target element #typed-output not found.');
        if (typeof Typed === 'undefined') console.warn('Typed.js library not loaded.');
    }
}

// --- Initialize Vendor Libraries --- (Called from main.js)
function initializeVendorLibs() {
    initializeAOS();
    initializeTypedJs();
    // lightGallery is initialized in portfolio.js as it depends on portfolio items
} 