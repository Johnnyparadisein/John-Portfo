// --- Theme Management ---
let currentTheme = localStorage.getItem('theme') || 'dark';

function setInitialTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    // updateThemeToggleIcon(); // CSS handles this now
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    // updateThemeToggleIcon(); // CSS handles this now
}

// function updateThemeToggleIcon() {
//     // CSS handles this now
// }

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle'); // Find element locally
    if (!themeToggle) {
        console.warn("Theme toggle button not found.");
        return;
    }
    themeToggle.addEventListener('click', toggleTheme);
}

// Initial theme application (called from main.js)
// setInitialTheme(); 