document.addEventListener("DOMContentLoaded", () => {
    const icon = document.getElementById('darkModeToggle');

    if (icon) {
        // Set the initial icon based on the saved dark mode state
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            icon.textContent = '🌙'; // Moon icon for dark mode
        } else {
            icon.textContent = '🌞'; // Sun icon for light mode
        }

        // Add click event listener to toggle dark mode
        icon.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            icon.textContent = isDarkMode ? '🌙' : '🌞'; // Update the icon
        });
    }
});
