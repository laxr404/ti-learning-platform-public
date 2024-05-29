function loadHTML(url, elementId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (elementId === 'menu') {
                updateLinks();
                updateImages();
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Define the base URL based on the environment
const isGithubPages = window.location.hostname === 'laxr404.github.io';
const baseUrl = isGithubPages ? '/ti-learning-platform-public/' : '/';

// Function to update links
function updateLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        let href = link.getAttribute('href');
        // Adjust only internal links
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Ensure no double slash in the URL
            if (href.startsWith('../attacklabs/')) {
                href = href.replace('../attacklabs/', baseUrl + 'attacklabs/');
            } else {
                href = baseUrl + href.replace(/^\/+/, '');
            }
            link.setAttribute('href', href);
        }
    });

    // Adjust onclick for dropdown items
    const dropdowns = document.querySelectorAll('.ui.dropdown.item');
    dropdowns.forEach(dropdown => {
        const href = dropdown.getAttribute('onclick');
        if (href && href.includes("location.href='/")) {
            const newHref = href.replace("location.href='/", `location.href='${baseUrl}`);
            dropdown.setAttribute('onclick', newHref);
        }
    });
}

// Function to update image sources
function updateImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        let src = img.getAttribute('src');
        // Adjust only internal sources
        if (src && !src.startsWith('http') && !src.startsWith('#')) {
            // Ensure no double slash in the URL
            if (src.startsWith('../images/')) {
                src = src.replace('../images/', baseUrl + 'images/');
            } else {
                src = baseUrl + src.replace(/^\/+/, '');
            }
            img.setAttribute('src', src);
        }
    });
}

// Example usage:
document.addEventListener('DOMContentLoaded', function () {
    loadHTML(baseUrl + 'menu.html', 'menu');
});
