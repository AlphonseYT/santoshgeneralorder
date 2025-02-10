document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Function to get formatted UTC timestamp
    function getUTCTimestamp() {
        const now = new Date();
        return now.getUTCFullYear() + '-' + 
               String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
               String(now.getUTCDate()).padStart(2, '0') + ' ' + 
               String(now.getUTCHours()).padStart(2, '0') + ':' + 
               String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
               String(now.getUTCSeconds()).padStart(2, '0');
    }

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-btn');
    const loadingSpinner = submitButton?.querySelector('.loading-spinner');
    const buttonText = submitButton?.querySelector('.btn-text');

    // Replace this with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'AKfycbzj2XTRQeexPJMTpb6gWBfByVoiaCBItx3PxSXB_g7o2zmVWDt9EziarPzLspsCC8GPGQ';

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (submitButton && loadingSpinner && buttonText) {
                // Disable submit button and show loading spinner
                submitButton.disabled = true;
                buttonText.textContent = 'Sending...';
                loadingSpinner.classList.remove('hidden');
            }
            
            // Get form values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');

            const formData = {
                timestamp: getUTCTimestamp(),
                name: nameInput ? nameInput.value : '',
                email: emailInput && emailInput.value ? emailInput.value : 'Not provided',
                phone: phoneInput ? phoneInput.value : '',
                message: messageInput ? messageInput.value : '',
                bikeInterest: messageInput && messageInput.value.includes('interested in') 
                    ? messageInput.value.split('interested in')[1].split('priced at')[0].trim()
                    : 'General Inquiry'
            };

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Show success message
                alert('Thank you for your message! We will contact you soon.');
                
                // Reset form
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error submitting your form. Please try again.');
            } finally {
                if (submitButton && loadingSpinner && buttonText) {
                    // Re-enable submit button and hide loading spinner
                    submitButton.disabled = false;
                    buttonText.textContent = 'Send Message';
                    loadingSpinner.classList.add('hidden');
                }
            }
        });
    }

    // Handle enquiry buttons
    document.querySelectorAll('.enquiry-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bikeCard = this.closest('.bike-details');
            const bikeName = bikeCard?.querySelector('h3')?.textContent || '';
            const bikePrice = bikeCard?.querySelector('.price')?.textContent || '';
            
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                // Smooth scroll to contact form
                contactSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
            
            // Pre-fill message in contact form
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `I am interested in the ${bikeName} priced at ${bikePrice}. Please provide more information.`;
            }
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

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
    const footerCopyright = document.querySelector('.footer-bottom p');
    if (footerCopyright) {
        footerCopyright.innerHTML = `&copy; ${new Date().getFullYear()} Santosh General Order Suppliers. All rights reserved.`;
    }

    // Form validation
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                if (this.checkValidity()) {
                    this.classList.remove('error');
                }
            }
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : 
                            !x[3] ? `${x[1]}-${x[2]}` : 
                            `${x[1]}-${x[2]}-${x[3]}`;
        });
    }

    // Handle window resize for mobile menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
        }
    });

    // Prevent form submission when pressing Enter in input fields
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                return false;
            }
        });
    });

    // Add loading state to Facebook link buttons
    document.querySelectorAll('.facebook-link-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalContent = this.innerHTML;
            this.style.opacity = '0.7';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Reset after 2 seconds (Facebook should load by then)
            setTimeout(() => {
                this.style.opacity = '1';
                this.innerHTML = originalContent;
            }, 2000);
        });
    });

    // Add scroll to top button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.className = 'scroll-top-btn hidden';
    document.body.appendChild(scrollTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopButton.classList.remove('hidden');
        } else {
            scrollTopButton.classList.add('hidden');
        }
    });

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
