export const body = document.body;

export function applyDarkModePreference() {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    toggleButtonIcon();
}

export function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const mode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('mode', mode);
    toggleButtonIcon();
}


function toggleButtonIcon() {
    const moonIcon = document.querySelector('.moon.outline.icon');
    const sunIcon = document.querySelector('.sun.icon');
    const toggleButton = document.getElementById('toggle-mode');

    if (moonIcon && sunIcon && toggleButton) {
        const savedMode = localStorage.getItem('mode');

        if (savedMode === 'dark') {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
            toggleButton.classList.remove('light-button');
            toggleButton.classList.add('dark-button');
        } else {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
            toggleButton.classList.remove('dark-button');
            toggleButton.classList.add('light-button');
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const toggleModeButton = document.getElementById('toggle-mode');

    // Function to mark active menu item
    function markActiveMenuItem() {
        const currentUrl = window.location.href;
        const menuItems = document.querySelectorAll('.left-menu a');

        menuItems.forEach(item => {
            if (item && currentUrl.includes(item.getAttribute('href'))) {
                item.classList.add('active');
            } else if (item) {
                item.classList.remove('active');
            }
        });
    }

    // Mutation observer for dynamic content changes in the navigation menu
    const navElement = document.querySelector('.left-menu');
    if (navElement) {
        const observer = new MutationObserver(markActiveMenuItem);
        observer.observe(navElement, { childList: true, subtree: true });
    }

    // Mark the active menu item on page load
    markActiveMenuItem();

    // Event listener for the dark mode toggle button
    if (toggleModeButton) {
        toggleModeButton.addEventListener('click', toggleDarkMode);
    }

    // Apply dark mode based on the stored preference
    applyDarkModePreference();

    // Function to limit node text length
    function limitNodeTextLength() {
        const nodeTexts = document.querySelectorAll(".node text");
        nodeTexts.forEach((textElement) => {
            const textContent = textElement.textContent;
            if (textContent.length > 8) {
                textElement.textContent = textContent.substring(0, 8) + "...";
            }
        });
    }

    // Call the function to limit node text length
    limitNodeTextLength();

    // Initialize Semantic UI components
    $(document).ready(function () {
        $('table').tablesort();
    });

    $(document).ready(function () {
        $('.ui.accordion').accordion();
    });

    $(document).ready(function () {
        $('.ui.dropdown').dropdown({
            on: 'hover',
            direction: 'auto',
            context: 'main'
        });
    });


});

