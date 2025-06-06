// --- Main Initialization Function ---
function initializeWebsite() {
    console.log("Initializing website...");

    // --- Initialize Core Functionality ---
    setInitialTheme();        // From theme.js
    initializeThemeToggle();  // From theme.js
    initializeNavigation();   // From navigation.js (Handles menu, scroll, header, active nav, padding)
    
    // --- Initialize Components ---
    initializeLazyLoading();    // From components.js
    initializeModals();         // From components.js
    initializeScrollTopButton();// From components.js
    initializeCookieConsent();  // From components.js
    initializeFullscreenViewer(); // From components.js
    initializeContactForm();    // From components.js

    // --- Initialize Feature-Specific Modules ---
    // initializePortfolioFiltering(); // From showcase.js (Formerly portfolio.js) - Initialization moved to showcase.js

    // --- Initialize Vendor Libraries ---
    initializeVendorLibs();     // From vendor.js (AOS, Typed.js)

    console.log("Website initialization complete.");
}

// --- Run Initializer after DOM is loaded ---
document.addEventListener('DOMContentLoaded', initializeWebsite); 