      // Loader Functionality
      window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });
    
    // Function to set the active link (You MUST provide this function)
    // Example (replace with your actual implementation):
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a'); // Or your selector
    
        navLinks.forEach(link => {
            if (link.pathname === currentPath) {
                link.classList.add('active'); // Or your active class
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    
    // Call the function to set the active link
    window.addEventListener('load', setActiveLink);
    
    
    // Function to check if the button should be visible (Updated)
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
    const nextPageButton = document.querySelector('.next-page-button');
    if (nextPageButton) { // Check if the button exists on the page
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
            window.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('load', checkScrollPosition);
            window.addEventListener('scroll', revealElements);
            window.addEventListener('load', revealElements);