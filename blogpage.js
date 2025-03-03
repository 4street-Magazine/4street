// Loader Functionality
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Function to check if the button should be visible
function checkScrollPosition() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercentage = (scrollPosition / totalHeight) * 100;
    const button = document.querySelector('.next-page-button');
    if (scrolledPercentage >= 60) {
        button.classList.add('visible');
    } else {
        button.classList.remove('visible');
    }
}

// Event listener for scroll
window.addEventListener('scroll', checkScrollPosition);

// Initial check in case the user lands on the page already past 60%
window.addEventListener('load', checkScrollPosition);

// Next Page Logic (Updated)
let blogPages = [];
let viewedPages = [];

// Get links from all <a> tags, excluding index.html.
function populateBlogPages() {
    const linkElements = document.querySelectorAll('a');

    if (linkElements.length > 0) {
        linkElements.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== 'index.html' && href.endsWith('.html')) {
                blogPages.push(href);
            }
        });
        // Remove duplicates
        blogPages = [...new Set(blogPages)];
    }
    // Now that blogPages is populated, add the current page to viewedPages
    const currentPath = window.location.pathname;
    if (blogPages.includes(currentPath) && !viewedPages.includes(currentPath)) {
        viewedPages.push(currentPath);
    }
    console.log('Blog Pages:', blogPages);
    console.log('Viewed Pages on load:', viewedPages);
}

// Populate blogPages and add current page to viewedPages on load
window.addEventListener('load', function() {
    populateBlogPages();
    setActiveLink();

    // Ensure current page is correctly added to viewedPages
    const currentPath = window.location.pathname;
    if (!viewedPages.includes(currentPath)) {
        viewedPages.push(currentPath);
    }
    console.log('Viewed Pages after load:', viewedPages);
});

// Function to set the active link
function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.pathname === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function getNextPage() {
    let availablePages = blogPages.filter(page => !viewedPages.includes(page));
    console.log('Available Pages:', availablePages);

    if (availablePages.length === 0) {
        // Reset viewedPages excluding the current page
        viewedPages = viewedPages.filter(page => page === window.location.pathname);
        availablePages = blogPages.filter(page => !viewedPages.includes(page));
        console.log('Resetting viewedPages. Available Pages after reset:', availablePages);
    }

    const randomIndex = Math.floor(Math.random() * availablePages.length);
    const nextPage = availablePages[randomIndex];

    // Check if nextPage already viewed to prevent accidental duplicates
    if (!viewedPages.includes(nextPage)) {
        viewedPages.push(nextPage);
    }
    console.log('Viewed Pages after getting next page:', viewedPages);
    return nextPage;
}

function goToNextPage() {
    document.body.classList.add('slide-out');
    setTimeout(function () {
        const nextPage = getNextPage();
        window.location.href = nextPage;
    }, 500);
}

// Add event listener to your "next" button
const nextPageButton = document.querySelector('.next-page-button');
if (nextPageButton) {
    nextPageButton.addEventListener('click', goToNextPage);
}

// Function to reveal elements as they come into view
function revealElements() {
    const elements = document.querySelectorAll('.content-card p, .content-card h2, .content-card h3');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight && elementBottom >= 0) {
            element.classList.add('reveal');
        }
    });
}

// Event listeners for scroll and load
window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);
