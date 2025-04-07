// --- Portfolio/Showcase Globals ---
let isotope = null;
const grid = document.querySelector('.portfolio-grid');
const filters = document.querySelectorAll('.portfolio-filter');

// --- Portfolio Filtering using Isotope --- 
function initializePortfolioFiltering() {
    if (!grid) {
        console.warn("Isotope grid element ('.portfolio-grid') not found. Filtering disabled.");
        return; // Silently exit if no grid found
    }

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
                percentPosition: true,
                masonry: {
                    columnWidth: '.portfolio-item',
                    gutter: 4 // Adjusted gutter to match previous CSS gap
                }
            });
            console.log("Isotope initialized for showcase.");

            // Trigger layout after a short delay (optional, but can help with web fonts/dynamic content)
            setTimeout(() => {
                if (isotope) isotope.layout();
                grid.classList.add('isotope-initialized'); // Class for potential CSS transitions
            }, 150);

        } catch (error) {
            console.error("Error initializing Isotope:", error);
        }
    });

    // Filter handling
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
}

// --- Helper to recalculate layout (e.g., on window resize) ---
function refreshPortfolioLayout() {
    if (isotope) {
        isotope.layout();
    }
}

// --- Debounced Resize Handler ---
let resizeTimeout;
// Add resize listener only if the grid exists to avoid errors if showcase section is removed
if (grid) {
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(refreshPortfolioLayout, 250);
    });
}

// --- Helper: Announce Status (Accessibility) ---
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

// --- Initialize when DOM is ready ---
document.addEventListener('DOMContentLoaded', initializePortfolioFiltering);