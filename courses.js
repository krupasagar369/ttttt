// ============================================
// COURSES PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Course filtering functionality
    const searchInput = document.getElementById('courseSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const deliveryFilter = document.getElementById('deliveryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const coursesContainer = document.getElementById('coursesContainer');
    const courseItems = document.querySelectorAll('.course-item');
    const courseCountElement = document.getElementById('courseCount');
    const noResultsElement = document.getElementById('noResults');
    const categoryPills = document.querySelectorAll('.category-pills .nav-link');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCourses();
        });
    }

    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterCourses();
        });
    }

    // Delivery mode filter
    if (deliveryFilter) {
        deliveryFilter.addEventListener('change', function() {
            filterCourses();
        });
    }

    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            sortCourses(this.value);
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
            
            // Filter based on category
            if (category === 'all') {
                categoryFilter.value = 'all';
            }
            
            filterCourses();
        });
    });

    // Category overview cards click
    const categoryOverviewCards = document.querySelectorAll('.category-overview-card');
    categoryOverviewCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            categoryFilter.value = category;
            filterCourses();
            
            // Scroll to courses section
            document.getElementById('coursesContainer').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Filter courses function
    function filterCourses() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedDelivery = deliveryFilter ? deliveryFilter.value : 'all';
        
        let visibleCount = 0;

        courseItems.forEach(item => {
            const courseTitle = item.querySelector('.course-title a').textContent.toLowerCase();
            const courseDescription = item.querySelector('.course-description').textContent.toLowerCase();
            const courseCategory = item.getAttribute('data-category');
            const courseDelivery = item.getAttribute('data-delivery');
            
            // Check search term
            const matchesSearch = searchTerm === '' || 
                                 courseTitle.includes(searchTerm) || 
                                 courseDescription.includes(searchTerm);
            
            // Check category
            const matchesCategory = selectedCategory === 'all' || 
                                   courseCategory === selectedCategory;
            
            // Check delivery mode
            const matchesDelivery = selectedDelivery === 'all' || 
                                   courseDelivery === selectedDelivery;
            
            // Show/hide course item
            if (matchesSearch && matchesCategory && matchesDelivery) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update course count
        if (courseCountElement) {
            courseCountElement.textContent = visibleCount;
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

    // Sort courses function
    function sortCourses(sortType) {
        const coursesArray = Array.from(courseItems);
        
        coursesArray.sort((a, b) => {
            const titleA = a.querySelector('.course-title a').textContent;
            const titleB = b.querySelector('.course-title a').textContent;
            
            switch(sortType) {
                case 'az':
                    return titleA.localeCompare(titleB);
                case 'za':
                    return titleB.localeCompare(titleA);
                case 'popular':
                    // Sort by rating (assuming rating is in the HTML)
                    const ratingA = parseFloat(a.querySelector('.course-rating span')?.textContent.replace(/[()]/g, '') || 0);
                    const ratingB = parseFloat(b.querySelector('.course-rating span')?.textContent.replace(/[()]/g, '') || 0);
                    return ratingB - ratingA;
                case 'duration':
                    // Sort by duration
                    const durationA = parseInt(a.querySelector('.meta-item .fa-clock').parentElement.textContent);
                    const durationB = parseInt(b.querySelector('.meta-item .fa-clock').parentElement.textContent);
                    return durationA - durationB;
                case 'newest':
                    // Keep current order for newest (you can add data-date attribute)
                    return 0;
                default:
                    return 0;
            }
        });

        // Re-append sorted items
        coursesArray.forEach(item => {
            coursesContainer.appendChild(item);
        });
    }

    // Pagination functionality
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.pagination .page-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to current
            this.parentElement.classList.add('active');
            
            // Scroll to top of courses
            window.scrollTo({
                top: document.getElementById('coursesContainer').offsetTop - 100,
                behavior: 'smooth'
            });
            
            // In a real application, you would load different courses here
            // For now, just refresh the display
            filterCourses();
        });
    });

    // Course card hover effect enhancement
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize course count
    if (courseCountElement) {
        courseCountElement.textContent = courseItems.length;
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

    // Add loading state during filtering
    function showLoading() {
        courseItems.forEach(item => {
            item.classList.add('loading');
        });
    }

    function hideLoading() {
        setTimeout(() => {
            courseItems.forEach(item => {
                item.classList.remove('loading');
            });
        }, 300);
    }

    // Enhanced filter with loading state
    const originalFilter = filterCourses;
    filterCourses = function() {
        showLoading();
        originalFilter();
        hideLoading();
    };

    // Clear filters button (optional)
    const clearFiltersBtn = document.createElement('button');
    clearFiltersBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
    clearFiltersBtn.innerHTML = '<i class="fas fa-times"></i> Clear Filters';
    clearFiltersBtn.style.display = 'none';
    
    if (searchInput) {
        searchInput.parentElement.appendChild(clearFiltersBtn);
        
        clearFiltersBtn.addEventListener('click', function() {
            searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (deliveryFilter) deliveryFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'popular';
            
            categoryPills.forEach(p => p.classList.remove('active'));
            categoryPills[0].classList.add('active');
            
            filterCourses();
            this.style.display = 'none';
        });
    }

    // Show clear button when filters are active
    function checkFiltersActive() {
        const searchActive = searchInput && searchInput.value !== '';
        const categoryActive = categoryFilter && categoryFilter.value !== 'all';
        const deliveryActive = deliveryFilter && deliveryFilter.value !== 'all';
        
        if (searchActive || categoryActive || deliveryActive) {
            clearFiltersBtn.style.display = 'inline-block';
        } else {
            clearFiltersBtn.style.display = 'none';
        }
    }

    // Add event listeners to check filter state
    if (searchInput) searchInput.addEventListener('input', checkFiltersActive);
    if (categoryFilter) categoryFilter.addEventListener('change', checkFiltersActive);
    if (deliveryFilter) deliveryFilter.addEventListener('change', checkFiltersActive);

    // Course card animation on scroll
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

    courseItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

});

// Back to top button functionality
const backToTopBtn = document.getElementById('backToTopBtn');

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
