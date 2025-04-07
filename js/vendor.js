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

// --- Typed.js Initialization (Example - adapt as needed) ---
/*
const typedElement = document.getElementById('typed-output');

if (typedElement && typeof Typed !== 'undefined') {
    // Options for Typed.js (customize these)
    const options = {
        strings: ["Creative Technologist", "Graphic Designer", "AI Enthusiast", "UI/UX Tinkerer"], // Text to type
        typeSpeed: 50, // Typing speed in milliseconds
        backSpeed: 30, // Backspacing speed
        backDelay: 1500, // Pause before backspacing
        loop: true, // Loop the animation
        startDelay: 500, // Delay before typing starts
        smartBackspace: true, // Only backspace what doesn't match the next string
        // showCursor: true,
        // cursorChar: '|',
        // autoInsertCss: true // Let Typed.js inject basic cursor CSS (optional)
    };

    // Initialize Typed.js
    const typed = new Typed('#typed-output', options);
} else {
    if (!typedElement) console.warn('Typed.js target element #typed-output not found.');
    if (typeof Typed === 'undefined') console.warn('Typed.js library not loaded.');
}
*/
console.log("Typed.js animation disabled."); // Add a log message

// --- Initialize Vendor Libraries --- (Called from main.js)
function initializeVendorLibs() {
    initializeAOS();
    // initializeTypedJs(); // Comment out the call to disable typing animation
} 