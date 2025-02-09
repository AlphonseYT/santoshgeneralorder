// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Handle form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Show success message
    alert(`Thank you ${name} for your message! We will contact you soon.`);
    
    // Reset form
    contactForm.reset();
});

// Handle enquiry buttons
document.querySelectorAll('.enquiry-btn').forEach(button => {
    button.addEventListener('click', function() {
        const bikeCard = this.closest('.bike-details');
        const bikeName = bikeCard.querySelector('h3').textContent;
        const bikePrice = bikeCard.querySelector('.price').textContent;
        
        // Smooth scroll to contact form
        document.querySelector('#contact').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Pre-fill message in contact form
        const messageField = document.getElementById('message');
        messageField.value = `I am interested in the ${bikeName} priced at ${bikePrice}. Please provide more information.`;
    });
});

// Smooth scrolling for all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Add fade-in animation for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Update copyright year automatically
document.querySelector('.footer-bottom p').innerHTML = 
    `&copy; ${new Date().getFullYear()} Santosh General Order Suppliers. All rights reserved.`;
