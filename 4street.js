
    // Call the function to set the active link
    window.addEventListener('load', setActiveLink);

// Loader Functionality
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Function to check if the button should be visible
function checkScrollPosition() {
    const blogCards = document.querySelectorAll('.blog-card');
    const button = document.querySelector('.next-page-button');
    let cardsScrolled = 0;

    blogCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        if (cardPosition < window.innerHeight) {
            cardsScrolled++;
        }
    });

    if (cardsScrolled >= 5) {
        button.classList.add('visible');
    } else {
        button.classList.remove('visible');
    }
}

// Event listener for scroll
window.addEventListener('scroll', checkScrollPosition);

// Initial check in case the cards are already scrolled into view on load
window.addEventListener('load', checkScrollPosition);

// Array of your blog page URLs
const blogPages = [
    'blogpage.html',
    'Businesspage.html',
    'cryptopage.html',
    'Investingpage.html',
    'Fintechpage.html',
    'Moneytips.html',
    // Add all your other blog page URLs here
];

function goToNextPage() {
    document.body.classList.add('slide-out');
    setTimeout(function () {
        const randomIndex = Math.floor(Math.random() * blogPages.length);
        window.location.href = blogPages[randomIndex];
    }, 500);
}

// Add event listener to your "next" button
document.querySelector('.next-page-button').addEventListener('click', goToNextPage);

