document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Function to get formatted timestamp in Nepal Time (UTC+05:45)
    function getNepalTimestamp() {
        const now = new Date();
        // Add 5 hours and 45 minutes to UTC to get Nepal Time
        const nepalOffset = (5 * 60 + 45) * 60 * 1000; // 5 hours and 45 minutes in milliseconds
        const nepalTime = new Date(now.getTime() + nepalOffset);
        
        const year = nepalTime.getUTCFullYear();
        const month = String(nepalTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(nepalTime.getUTCDate()).padStart(2, '0');
        const hours = String(nepalTime.getUTCHours()).padStart(2, '0');
        const minutes = String(nepalTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(nepalTime.getUTCSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-btn');
    const loadingSpinner = submitButton?.querySelector('.loading-spinner');
    const buttonText = submitButton?.querySelector('.btn-text');

    // Your Google Apps Script Web App URL - Keep your existing URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwv0GTm6Qg09kjwjYotDgBT6CpEvCDCABexVuzVTsjrTuT3UL_BBi2E1TKCj6QJphD/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (submitButton && loadingSpinner && buttonText) {
                submitButton.disabled = true;
                buttonText.textContent = 'Sending...';
                loadingSpinner.classList.remove('hidden');
            }
            
            const formData = {
                timestamp: getNepalTimestamp(),
                name: document.getElementById('name')?.value?.trim() || '',
                email: document.getElementById('email')?.value?.trim() || 'Not provided',
                phone: document.getElementById('phone')?.value?.trim() || '',
                message: document.getElementById('message')?.value?.trim() || '',
                bikeInterest: document.getElementById('message')?.value?.includes('interested in') 
                    ? document.getElementById('message').value.split('interested in')[1].split('priced at')[0].trim()
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

                alert('Thank you for your message! We will contact you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error submitting your form. Please try again.');
            } finally {
                if (submitButton && loadingSpinner && buttonText) {
                    submitButton.disabled = false;
                    buttonText.textContent = 'Send Message';
                    loadingSpinner.classList.add('hidden');
                }
            }
        });
    }

    // Your existing event listeners and functionality remain the same
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
});
