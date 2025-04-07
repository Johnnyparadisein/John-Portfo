// --- Portfolio/Showcase Globals ---
// let isotope = null; // Remove Isotope instance
const grid = document.querySelector('.portfolio-grid');
// const filters = document.querySelectorAll('.portfolio-filter'); // Remove filter selection if filters are removed

// --- Portfolio Filtering using Isotope --- 
function initializePortfolioFiltering() {
    if (!grid) {
        console.warn("Portfolio grid element ('.portfolio-grid') not found.");
        return; // Exit if no grid found
    }

    // Isotope and imagesLoaded are no longer needed for CSS Grid layout
    /*
    // Ensure Isotope and imagesLoaded are available
    if (typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') {
        console.error('Isotope or imagesLoaded library not found. Cannot initialize portfolio filtering.');
        return;
    }

    // Initialize Isotope after images are loaded
    imagesLoaded(grid, () => {
        try { // Add try-catch for safety during initialization
            isotope = new Isotope(grid, {
                itemSelector: '.portfolio-item',
                layoutMode: 'masonry',
                // percentPosition: true, // Removed for potentially more precise pixel positioning
                masonry: {
                    columnWidth: '.grid-sizer', // Use sizer element for column width
                    gutter: 8 // Re-enable gutter to match CSS margin
                }
            });
            console.log("Isotope initialized for showcase with masonry layout and gutter.");

            // Trigger layout after a short delay AND force a second layout
            setTimeout(() => {
                if (isotope) {
                    isotope.layout(); // First layout call
                    console.log("Isotope first layout complete.");
                    // Force a second layout slightly later
                    setTimeout(() => {
                        if (isotope) {
                            isotope.layout(); 
                            console.log("Isotope second layout complete.");
                            grid.classList.add('isotope-initialized');
                        }
                    }, 100); 
                }
            }, 500); // Keep the initial delay

        } catch (error) {
            console.error("Error initializing Isotope:", error);
        }
    });
    */

    // Filter handling - Removed as we are using CSS Grid
    /*
    if (filters.length > 0) {
        filters.forEach(filter => {
            filter.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default button behavior if necessary

                // Don't filter if Isotope hasn't initialized
                if (!isotope) {
                    console.warn("Isotope instance not available for filtering yet.");
                    return;
                }

                // Update active filter button state
                filters.forEach(f => {
                    f.classList.remove('active');
                    f.setAttribute('aria-pressed', 'false');
                });
                filter.classList.add('active');
                filter.setAttribute('aria-pressed', 'true');

                // Apply Isotope filter
                const filterValue = filter.getAttribute('data-filter');
                isotope.arrange({ filter: filterValue });

                // Announce filter change for accessibility
                const category = filterValue === '*' ? 'all items' : filter.textContent + ' items';
                announceStatus(`Showing ${category}`);
            });
        });
    } else {
        console.log("No portfolio filter buttons found.");
    }
    */
    console.log("Showcase initialized using CSS Grid. Isotope functionality removed.");
}

// --- Helper to recalculate layout (e.g., on window resize) --- 
// Remove Isotope-specific layout refresh
/*
function refreshPortfolioLayout() {
    if (isotope) {
        isotope.layout();
    }
}
*/

// --- Debounced Resize Handler ---
// Remove Isotope-specific resize handler
/*
let resizeTimeout;
// Add resize listener only if the grid exists to avoid errors if showcase section is removed
if (grid) {
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(refreshPortfolioLayout, 250);
    });
}
*/

// --- Helper: Announce Status (Accessibility) ---
// Keep this function if potentially used elsewhere, otherwise remove
let statusAnnouncer = null;
function announceStatus(message) {
    if (!statusAnnouncer) {
        statusAnnouncer = document.createElement('div');
        // Visually hide the element but make it readable by screen readers
        statusAnnouncer.style.position = 'absolute';
        statusAnnouncer.style.left = '-10000px';
        statusAnnouncer.style.top = 'auto';
        statusAnnouncer.style.width = '1px';
        statusAnnouncer.style.height = '1px';
        statusAnnouncer.style.overflow = 'hidden';
        // ARIA attributes for screen reader announcements
        statusAnnouncer.setAttribute('aria-live', 'polite'); // Announce changes politely
        statusAnnouncer.setAttribute('aria-atomic', 'true'); // Announce the entire region as a whole
        document.body.appendChild(statusAnnouncer);
        console.log("Status announcer created."); // Log creation
    }
    // Update the text content, which triggers the screen reader announcement
    statusAnnouncer.textContent = message;
    console.log("Announcing:", message); // Log announcement
}

// --- Initialize when the window is loaded --- 
// Still call the simplified initialization function
window.addEventListener('load', initializePortfolioFiltering);