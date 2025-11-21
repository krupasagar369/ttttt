
    // ===========================================

    /* ============================================
   CAREERS PAGE SCRIPTS WITH MODAL
============================================ */

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Handle Apply Now Buttons - OPEN MODAL
document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', function() {
        const jobTitle = this.getAttribute('data-job');
        
        // Set job title in modal
        document.getElementById('modalJobTitle').textContent = jobTitle;
        
        // Show Bootstrap Modal
        const applicationModal = new bootstrap.Modal(document.getElementById('applicationModal'));
        applicationModal.show();
    });
});

// Handle Modal Form Submission
document.getElementById('modalApplicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const file = formData.get('resume');
    
    // Validate file size
    if (file && file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    // Show success message
    alert('Thank you for your application! We will review your profile and get back to you soon.');
    
    // Close modal
    const applicationModal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
    applicationModal.hide();
    
    // Reset form
    this.reset();
});

// File upload validation
document.querySelector('#modalApplicationForm input[type="file"]').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const fileSize = file.size / 1024 / 1024; // in MB
        
        if (fileSize > 5) {
            alert('File size must be less than 5MB. Please choose a smaller file.');
            this.value = '';
        }
    }
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

console.log('Careers page with modal loaded successfully!');



