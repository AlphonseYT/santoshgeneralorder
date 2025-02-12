// Performance monitoring initialization
const perfData = {
    start: performance.now(),
    metrics: new Map()
};

document.addEventListener('DOMContentLoaded', function() {
    // Record DOM load time
    perfData.metrics.set('domLoaded', performance.now() - perfData.start);

    // Cache DOM elements for better performance
    const elements = {
        mobileMenu: document.querySelector('.mobile-menu'),
        navLinks: document.querySelector('.nav-links'),
        contactForm: document.getElementById('contact-form'),
        submitBtn: document.getElementById('submit-btn'),
        loadingSpinner: document.querySelector('#submit-btn .loading-spinner'),
        buttonText: document.querySelector('#submit-btn .btn-text'),
        phoneInput: document.getElementById('phone'),
        sections: document.querySelectorAll('section'),
        footerCopyright: document.querySelector('.footer-bottom p'),
        inputs: document.querySelectorAll('.contact-form input, .contact-form textarea'),
        messageField: document.getElementById('message')
    };

    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwv0GTm6Qg09kjwjYotDgBT6CpEvCDCABexVuzVTsjrTuT3UL_BBi2E1TKCj6QJphD/exec';

    // Utility Functions
    const util = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        getFormattedTimestamp: () => {
            const now = new Date();
            const pad = num => String(num).padStart(2, '0');
            return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
        },

        formatPhoneNumber: (value) => {
            const numbers = value.replace(/\D/g, '');
            const match = numbers.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            return !match[2] ? match[1] : 
                   !match[3] ? `${match[1]}-${match[2]}` : 
                   `${match[1]}-${match[2]}-${match[3]}`;
        },

        logMetric: (name, value) => {
            perfData.metrics.set(name, value);
            if (window.gtag) {
                gtag('event', 'performance', {
                    event_category: 'Performance',
                    event_label: name,
                    value: Math.round(value)
                });
            }
        }
    };

    // Mobile Menu with debouncing
    if (elements.mobileMenu && elements.navLinks) {
        elements.mobileMenu.addEventListener('click', util.debounce(() => {
            const isActive = elements.navLinks.classList.toggle('active');
            elements.mobileMenu.setAttribute('aria-expanded', isActive);
        }, 150));
    }

    // Enhanced Form Handling
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitStart = performance.now();

            try {
                // Update UI for form submission
                if (elements.submitBtn && elements.loadingSpinner && elements.buttonText) {
                    elements.submitBtn.disabled = true;
                    elements.buttonText.textContent = 'Sending...';
                    elements.loadingSpinner.classList.remove('hidden');
                }

                const formData = {
                    timestamp: util.getFormattedTimestamp(),
                    name: document.getElementById('name')?.value?.trim() || '',
                    email: document.getElementById('email')?.value?.trim() || 'Not provided',
                    phone: elements.phoneInput?.value?.trim() || '',
                    message: elements.messageField?.value?.trim() || '',
                    bikeInterest: elements.messageField?.value?.includes('interested in') 
                        ? elements.messageField.value.split('interested in')[1].split('priced at')[0].trim()
                        : 'General Inquiry',
                    userAgent: navigator.userAgent,
                    submissionTime: submitStart - perfData.start
                };

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                util.logMetric('formSubmission', performance.now() - submitStart);
                alert('Thank you for your message! We will contact you soon.');
                elements.contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error submitting your form. Please try again.');
            } finally {
                if (elements.submitBtn && elements.loadingSpinner && elements.buttonText) {
                    elements.submitBtn.disabled = false;
                    elements.buttonText.textContent = 'Send Message';
                    elements.loadingSpinner.classList.add('hidden');
                }
            }
        });
    }

    // Optimized Enquiry Buttons with Event Delegation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.enquiry-btn')) {
            const bikeCard = e.target.closest('.bike-details');
            const bikeName = bikeCard?.querySelector('h3')?.textContent || '';
            const bikePrice = bikeCard?.querySelector('.price')?.textContent || '';

            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (elements.messageField) {
                elements.messageField.value = `I am interested in the ${bikeName} priced at ${bikePrice}. Please provide more information.`;
            }
        }
    });

    // Optimized Smooth Scrolling
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                elements.navLinks.classList.remove('active');
            }
        }
    });

    // Enhanced Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Automatic Copyright Year
    if (elements.footerCopyright) {
        elements.footerCopyright.innerHTML = `&copy; ${new Date().getFullYear()} Santosh General Order Suppliers. All rights reserved.`;
    }

    // Enhanced Form Validation
    elements.inputs.forEach(input => {
        const validateInput = util.debounce(() => {
            if (input.classList.contains('error') && input.checkValidity()) {
                input.classList.remove('error');
            }
        }, 300);

        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('error');
        });

        input.addEventListener('input', validateInput);
    });

    // Phone Number Formatting
    if (elements.phoneInput) {
        elements.phoneInput.addEventListener('input', (e) => {
            e.target.value = util.formatPhoneNumber(e.target.value);
        });
    }

    // Optimized Window Resize Handler
    window.addEventListener('resize', util.debounce(() => {
        if (window.innerWidth > 768) {
            elements.navLinks.classList.remove('active');
        }
    }, 250));

    // Prevent Form Submission on Enter
    elements.inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });

    // Enhanced Facebook Link Buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.facebook-link-btn')) {
            const btn = e.target.closest('.facebook-link-btn');
            const originalContent = btn.innerHTML;
            
            btn.style.opacity = '0.7';
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.innerHTML = originalContent;
            }, 2000);
        }
    });

    // Improved Scroll to Top Button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.className = 'scroll-top-btn hidden';
    scrollTopButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopButton);

    // Optimized scroll handler
    window.addEventListener('scroll', util.debounce(() => {
        scrollTopButton.classList.toggle('hidden', window.pageYOffset <= 300);
    }, 150));

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now() - perfData.start;
        util.logMetric('totalLoadTime', loadTime);
        console.info(`Page loaded in ${Math.round(loadTime)}ms`);
    });
});
