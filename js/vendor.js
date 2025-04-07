// --- Initialize AOS (Animate on Scroll) ---
function initializeAOS() {
    console.log("Checking for AOS library..."); // Log start
    if (typeof AOS !== 'undefined') {
        console.log("AOS library found. Initializing..."); // Log found
        AOS.init({
            duration: 200, /* Further reduced duration for very fast animations */
            easing: 'ease-in-out', 
            once: true, 
            mirror: false, 
            anchorPlacement: 'top-bottom', 
        });
        console.log("AOS initialized successfully."); // Log success
    } else {
        console.warn('AOS library not loaded.');
    }
}

// --- Initialize Typed.js ---
function initializeTypedJs() {
    console.log("Checking for Typed.js library and target..."); // Log start
    const typedElement = document.getElementById('typed-output');
    if (typedElement && typeof Typed !== 'undefined') {
        console.log("Typed.js library and target found. Initializing..."); // Log found
        try { // Add try-catch
            const typed = new Typed('#typed-output', {
                strings: [
                    'Graphic Designer',
                    'AI Musketeer',
                    'Creative Technologist'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                loop: true,
                smartBackspace: true
            });
            console.log("Typed.js initialized successfully."); // Log success
        } catch (error) {
            console.error("Error initializing Typed.js:", error); // Log error
        }
    } else {
        if (!typedElement) console.warn('Typed.js target element #typed-output not found.');
        if (typeof Typed === 'undefined') console.warn('Typed.js library not loaded.');
    }
}

// --- Initialize Vendor Libraries --- (Called from main.js)
function initializeVendorLibs() {
    initializeAOS();
    initializeTypedJs();
} 