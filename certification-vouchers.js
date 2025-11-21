// ============================================
// CERTIFICATION VOUCHERS PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Get DOM elements
    const searchInput = document.getElementById('certSearchInput');
    const providerFilter = document.getElementById('providerFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const certContainer = document.getElementById('certContainer');
    const certItems = document.querySelectorAll('.cert-item');
    const certCountElement = document.getElementById('certCount');
    const noResultsElement = document.getElementById('noResults');
    const categoryPills = document.querySelectorAll('.cert-category-pills .nav-link');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCertifications();
        });
    }

    // Provider filter
    if (providerFilter) {
        providerFilter.addEventListener('change', function() {
            filterCertifications();
        });
    }

    // Category filter dropdown
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterCertifications();
            
            // Update active pill
            const selectedCategory = this.value;
            categoryPills.forEach(pill => {
                if (pill.getAttribute('data-category') === selectedCategory) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        });
    }

    // Category pills functionality
    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            this.classList.add('active');
            
            // Get category
            const category = this.getAttribute('data-category');
            
            // Update dropdown
            if (categoryFilter) {
                categoryFilter.value = category;
            }
            
            // Filter certifications
            filterCertifications();
        });
    });

    // Main filter function
    function filterCertifications() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedProvider = providerFilter ? providerFilter.value : 'all';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        let visibleCount = 0;

        certItems.forEach(item => {
            const certName = item.querySelector('.cert-name').textContent.toLowerCase();
            const certDesc = item.querySelector('.cert-description').textContent.toLowerCase();
            const certProvider = item.getAttribute('data-provider');
            const certCategory = item.getAttribute('data-category');
            
            // Check search term
            const matchesSearch = searchTerm === '' || 
                                 certName.includes(searchTerm) || 
                                 certDesc.includes(searchTerm);
            
            // Check provider
            const matchesProvider = selectedProvider === 'all' || 
                                   certProvider === selectedProvider;
            
            // Check category
            const matchesCategory = selectedCategory === 'all' || 
                                   certCategory === selectedCategory;
            
            // Show/hide certification item
            if (matchesSearch && matchesProvider && matchesCategory) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update certification count
        if (certCountElement) {
            certCountElement.textContent = visibleCount;
        }

        // Show/hide no results message
        if (noResultsElement) {
            if (visibleCount === 0) {
                noResultsElement.style.display = 'block';
            } else {
                noResultsElement.style.display = 'none';
            }
        }
    }

    // Card hover effect enhancement
    const certCards = document.querySelectorAll('.cert-voucher-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize certification count
    if (certCountElement) {
        certCountElement.textContent = certItems.length;
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#0') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Clear filters functionality
    const clearFiltersBtn = document.createElement('button');
    clearFiltersBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
    clearFiltersBtn.innerHTML = '<i class="fas fa-times"></i> Clear';
    clearFiltersBtn.style.display = 'none';
    
    if (searchInput) {
        searchInput.parentElement.parentElement.appendChild(clearFiltersBtn);
        
        clearFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (providerFilter) providerFilter.value = 'all';
            if (categoryFilter) categoryFilter.value = 'all';
            
            categoryPills.forEach(p => p.classList.remove('active'));
            categoryPills[0].classList.add('active');
            
            filterCertifications();
            this.style.display = 'none';
        });
    }

    // Show clear button when filters are active
    function checkFiltersActive() {
        const searchActive = searchInput && searchInput.value !== '';
        const providerActive = providerFilter && providerFilter.value !== 'all';
        const categoryActive = categoryFilter && categoryFilter.value !== 'all';
        
        if (searchActive || providerActive || categoryActive) {
            clearFiltersBtn.style.display = 'inline-block';
        } else {
            clearFiltersBtn.style.display = 'none';
        }
    }

    // Add event listeners to check filter state
    if (searchInput) searchInput.addEventListener('input', checkFiltersActive);
    if (providerFilter) providerFilter.addEventListener('change', checkFiltersActive);
    if (categoryFilter) categoryFilter.addEventListener('change', checkFiltersActive);

    // Certification card animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    certItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    // Get Voucher button click tracking (optional)
    const voucherButtons = document.querySelectorAll('.btn-cert-buy');
    voucherButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const certCard = this.closest('.cert-voucher-card');
            const certName = certCard.querySelector('.cert-name').textContent;
            
            // You can add analytics tracking here
            console.log('User clicked voucher for:', certName);
            
            // Add a loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
            this.style.pointerEvents = 'none';
            
            // In a real application, you would handle the purchase here
            setTimeout(() => {
                this.innerHTML = 'Get Voucher';
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });

    // Add loading state during filtering
    function showLoading() {
        certItems.forEach(item => {
            item.classList.add('loading');
        });
    }

    function hideLoading() {
        setTimeout(() => {
            certItems.forEach(item => {
                item.classList.remove('loading');
            });
        }, 300);
    }

    // Enhanced filter with loading state
    const originalFilter = filterCertifications;
    filterCertifications = function() {
        showLoading();
        originalFilter();
        hideLoading();
    };

});

// Back to top button functionality
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
