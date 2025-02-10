// Function to get formatted timestamp in Nepal Time (UTC+05:45)
function getNepalTimestamp() {
    const now = new Date();
    
    // Get current time in UTC
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDay = now.getUTCDate();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    
    // Create new date object with UTC time
    const nepalTime = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds));
    
    // Add Nepal offset (5:45)
    nepalTime.setTime(nepalTime.getTime() + ((5 * 60 + 45) * 60 * 1000));
    
    // Format the date
    const year = nepalTime.getUTCFullYear();
    const month = String(nepalTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(nepalTime.getUTCDate()).padStart(2, '0');
    const hours = String(nepalTime.getUTCHours()).padStart(2, '0');
    const minutes = String(nepalTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(nepalTime.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Handle form submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitButton && loadingSpinner && buttonText) {
            submitButton.disabled = true;
            buttonText.textContent = 'Sending...';
            loadingSpinner.classList.remove('hidden');
        }
        
        // Get form values
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
            console.log('Sending data:', formData); // Debug log
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response:', response); // Debug log
            
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
