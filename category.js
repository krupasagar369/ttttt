// ============================================
// CATEGORY PAGE - COURSES & CERTIFICATIONS WITH PAGINATION
// ============================================
const API_BASE_URL = 'https://www.aicerts.ai/wp-json/aicerts-api/v1';
const API_ENDPOINTS = {
    courses: `${API_BASE_URL}/courses`,
    courseById: (id) => `${API_BASE_URL}/course/${id}`
};

// Global storage
let allCategoryCourses = [];
let allCategoryCertifications = [];
let filteredCategoryCourses = [];
let filteredCategoryCertifications = [];

// Pagination settings
const ITEMS_PER_PAGE = 10;
let currentCoursePage = 1;
let currentCertPage = 1;

// Category configuration
const CATEGORY_CONFIG = {
    'ai-data-robotics': {
        keywords: ['data', 'robotics', 'machine learning', 'analytics'],
        title: 'AI Data & Robotics'
    },
    'ai-essentials': {
        keywords: ['essentials', 'foundation', 'basics'],
        title: 'AI Essentials'
    },
    'ai-specialization': {
        keywords: ['specialization', 'advanced', 'expert'],
        title: 'AI Specialization'
    },
    'blockchain-bitcoin': {
        keywords: ['blockchain', 'bitcoin', 'cryptocurrency'],
        title: 'Blockchain & Bitcoin'
    },
    'ai-business': {
        keywords: ['business', 'enterprise', 'management'],
        title: 'AI Business'
    },
    'ai-design-creative': {
        keywords: ['design', 'creative', 'graphics'],
        title: 'AI Design & Creative'
    },
    'ai-learning-education': {
        keywords: ['learning', 'education', 'teaching'],
        title: 'AI Learning & Education'
    },
    'ai-development': {
        keywords: ['development', 'developer', 'programming'],
        title: 'AI Development'
    },
    'ai-security': {
        keywords: ['security', 'cybersecurity', 'protection'],
        title: 'AI Security'
    },
    'ai-cloud': {
        keywords: ['cloud', 'aws', 'azure', 'gcp'],
        title: 'AI Cloud'
    }
};

function getCurrentCategory() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename;
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadCategoryData();
    setupCategoryEventListeners();
    setupTabSwitching();
});

async function loadCategoryData() {
    await loadCategoryCoursesFromAPI();
    await loadCategoryCertificationsFromAPI();
}

// ============================================
// LOAD COURSES
// ============================================

async function loadCategoryCoursesFromAPI() {
    const coursesList = document.getElementById('categoryCoursesList');
    const coursesCount = document.getElementById('categoryCoursesCount');
    
    showLoading(coursesList, 'courses');
    
    try {
        const currentCategory = getCurrentCategory();
        const categoryConfig = CATEGORY_CONFIG[currentCategory];
        
        if (!categoryConfig) {
            throw new Error('Category configuration not found');
        }
        
        let page = 1;
        let allFetchedCourses = [];
        let hasMorePages = true;
        
        while (hasMorePages) {
            const response = await fetch(`${API_ENDPOINTS.courses}?page=${page}&per_page=50`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
                allFetchedCourses = allFetchedCourses.concat(data.data);
                
                if (page >= data.total_pages) {
                    hasMorePages = false;
                } else {
                    page++;
                }
            } else {
                hasMorePages = false;
            }
        }
        
        // Filter courses by category keywords
        allCategoryCourses = allFetchedCourses.filter(course => {
            const titleLower = course.title.toLowerCase();
            const descLower = (course.description || '').toLowerCase();
            const categories = course.categories ? course.categories.join(' ').toLowerCase() : '';
            const searchText = `${titleLower} ${descLower} ${categories}`;
            
            return categoryConfig.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
        });
        
        filteredCategoryCourses = allCategoryCourses;
        currentCoursePage = 1;
        
        renderCategoryCoursesWithPagination();
        coursesCount.textContent = filteredCategoryCourses.length;
        
    } catch (error) {
        console.error('Error loading category courses:', error);
        showError(coursesList, 'courses');
    }
}

// ============================================
// LOAD CERTIFICATIONS
// ============================================

async function loadCategoryCertificationsFromAPI() {
    const certsList = document.getElementById('categoryCertificationsList');
    const certsCount = document.getElementById('categoryCertificationsCount');
    
    showLoading(certsList, 'certifications');
    
    try {
        const currentCategory = getCurrentCategory();
        const categoryConfig = CATEGORY_CONFIG[currentCategory];
        
        if (!categoryConfig) {
            throw new Error('Category configuration not found');
        }
        
        let page = 1;
        let allFetchedCerts = [];
        let hasMorePages = true;
        
        while (hasMorePages) {
            const response = await fetch(`${API_ENDPOINTS.courses}?page=${page}&per_page=50`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
                allFetchedCerts = allFetchedCerts.concat(data.data);
                
                if (page >= data.total_pages) {
                    hasMorePages = false;
                } else {
                    page++;
                }
            } else {
                hasMorePages = false;
            }
        }
        
        // Filter certifications by category keywords (same API, treating as certifications)
        allCategoryCertifications = allFetchedCerts.filter(cert => {
            const titleLower = cert.title.toLowerCase();
            const descLower = (cert.description || '').toLowerCase();
            const categories = cert.categories ? cert.categories.join(' ').toLowerCase() : '';
            const searchText = `${titleLower} ${descLower} ${categories}`;
            
            return categoryConfig.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
        });
        
        filteredCategoryCertifications = allCategoryCertifications;
        currentCertPage = 1;
        
        renderCategoryCertificationsWithPagination();
        certsCount.textContent = filteredCategoryCertifications.length;
        
    } catch (error) {
        console.error('Error loading category certifications:', error);
        showError(certsList, 'certifications');
    }
}

// ============================================
// RENDER COURSES WITH PAGINATION
// ============================================

function renderCategoryCoursesWithPagination() {
    const totalPages = Math.ceil(filteredCategoryCourses.length / ITEMS_PER_PAGE);
    
    const startIndex = (currentCoursePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const coursesToShow = filteredCategoryCourses.slice(startIndex, endIndex);
    
    renderCategoryCourses(coursesToShow);
    renderCategoryPagination('courses', currentCoursePage, totalPages);
}

function renderCategoryCourses(courses) {
    const coursesList = document.getElementById('categoryCoursesList');
    coursesList.innerHTML = '';
    
    if (!courses || courses.length === 0) {
        coursesList.innerHTML = '<div class="no-results"><p>No courses found in this category.</p></div>';
        return;
    }
    
    courses.forEach(course => {
        const courseCard = createCategoryCourseCard(course);
        coursesList.appendChild(courseCard);
    });
}

function createCategoryCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'category-course-card';
    
    const rating = generateRating();
    const level = extractLevel(course.title, course.description);
    
    card.innerHTML = `
        <div class="course-header">
            <h3 class="course-title">${course.title || 'Untitled Course'}</h3>
            <div class="rating">
                ${rating.stars}
                <span>${rating.value}</span>
                <span class="rating-count">(${rating.count})</span>
            </div>
        </div>
        <div class="course-meta">
            <span><i class="far fa-clock"></i> 5 Days (40 Hours)</span>
            <span><i class="fas fa-layer-group"></i> ${capitalizeFirstLetter(level)} Level</span>
            <span><i class="fas fa-desktop"></i> Virtual Instructor-Led Training</span>
        </div>
        ${course.description ? `<div class="course-description">${truncateText(course.description, 150)}</div>` : ''}
    `;
    
    card.addEventListener('click', () => {
        showCourseDetailsModal(course.id);
    });
    
    return card;
}

// ============================================
// RENDER CERTIFICATIONS WITH PAGINATION
// ============================================

function renderCategoryCertificationsWithPagination() {
    const totalPages = Math.ceil(filteredCategoryCertifications.length / ITEMS_PER_PAGE);
    
    const startIndex = (currentCertPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const certsToShow = filteredCategoryCertifications.slice(startIndex, endIndex);
    
    renderCategoryCertifications(certsToShow);
    renderCategoryPagination('certifications', currentCertPage, totalPages);
}

function renderCategoryCertifications(certifications) {
    const certsList = document.getElementById('categoryCertificationsList');
    certsList.innerHTML = '';
    
    if (!certifications || certifications.length === 0) {
        certsList.innerHTML = '<div class="no-results"><p>No certifications found in this category.</p></div>';
        return;
    }
    
    certifications.forEach(cert => {
        const certCard = createCategoryCertificationCard(cert);
        certsList.appendChild(certCard);
    });
}

function createCategoryCertificationCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card';
    
    const rating = generateRating();
    const level = extractLevel(cert.title, cert.description);
    
    card.innerHTML = `
        <div class="cert-header">
            <h3 class="cert-title">${cert.title || 'Untitled Certification'}</h3>
            <div class="rating">
                ${rating.stars}
                <span>${rating.value}</span>
                <span class="rating-count">(${rating.count})</span>
            </div>
        </div>
        <div class="cert-meta">
            <span class="level-badge"><i class="fas fa-layer-group"></i> ${capitalizeFirstLetter(level)}</span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showCourseDetailsModal(cert.id);
    });
    
    return card;
}

// ============================================
// PAGINATION CONTROLS
// ============================================

function renderCategoryPagination(type, currentPageNum, totalPages) {
    const containerId = type === 'courses' ? 'categoryCoursePagination' : 'categoryCertPagination';
    let container = document.getElementById(containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'pagination-container';
        
        const parentList = type === 'courses' ? 
            document.getElementById('categoryCoursesList').parentElement : 
            document.getElementById('categoryCertificationsList').parentElement;
        parentList.appendChild(container);
    }
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPageNum === 1 ? 'disabled' : ''}" 
                onclick="changeCategoryPage('${type}', ${currentPageNum - 1})" 
                ${currentPageNum === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPageNum - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changeCategoryPage('${type}', 1)">1</button>
            ${startPage > 2 ? '<span class="pagination-dots">...</span>' : ''}
        `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPageNum ? 'active' : ''}" 
                    onclick="changeCategoryPage('${type}', ${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-dots">...</span>' : ''}
            <button class="pagination-btn" onclick="changeCategoryPage('${type}', ${totalPages})">${totalPages}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPageNum === totalPages ? 'disabled' : ''}" 
                onclick="changeCategoryPage('${type}', ${currentPageNum + 1})" 
                ${currentPageNum === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationHTML += '</div>';
    
    // Page info
    const itemsArray = type === 'courses' ? filteredCategoryCourses : filteredCategoryCertifications;
    const startItem = (currentPageNum - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPageNum * ITEMS_PER_PAGE, itemsArray.length);
    const totalItems = itemsArray.length;
    
    paginationHTML += `
        <div class="pagination-info">
            Showing ${startItem}-${endItem} of ${totalItems} ${type}
        </div>
    `;
    
    container.innerHTML = paginationHTML;
}

function changeCategoryPage(type, page) {
    if (type === 'courses') {
        const totalPages = Math.ceil(filteredCategoryCourses.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentCoursePage = page;
        renderCategoryCoursesWithPagination();
        document.getElementById('categoryCoursesList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        const totalPages = Math.ceil(filteredCategoryCertifications.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentCertPage = page;
        renderCategoryCertificationsWithPagination();
        document.getElementById('categoryCertificationsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// FILTERING
// ============================================

function filterCategoryCourses() {
    const levelFilter = document.getElementById('categoryLevelFilter').value.toLowerCase();
    const deliveryFilter = document.getElementById('categoryDeliveryFilter').value.toLowerCase();
    
    filteredCategoryCourses = allCategoryCourses.filter(course => {
        const title = course.title.toLowerCase();
        const description = (course.description || '').toLowerCase();
        
        const matchesLevel = !levelFilter || title.includes(levelFilter) || description.includes(levelFilter);
        const matchesDelivery = !deliveryFilter;
        
        return matchesLevel && matchesDelivery;
    });
    
    currentCoursePage = 1;
    renderCategoryCoursesWithPagination();
    document.getElementById('categoryCoursesCount').textContent = filteredCategoryCourses.length;
}

function filterCategoryCertifications() {
    const levelFilter = document.getElementById('categoryCertLevelFilter').value.toLowerCase();
    
    filteredCategoryCertifications = allCategoryCertifications.filter(cert => {
        const title = cert.title.toLowerCase();
        const description = (cert.description || '').toLowerCase();
        
        const matchesLevel = !levelFilter || title.includes(levelFilter) || description.includes(levelFilter);
        
        return matchesLevel;
    });
    
    currentCertPage = 1;
    renderCategoryCertificationsWithPagination();
    document.getElementById('categoryCertificationsCount').textContent = filteredCategoryCertifications.length;
}

function resetCategoryFilters() {
    document.getElementById('categoryLevelFilter').value = '';
    document.getElementById('categoryDeliveryFilter').value = '';
    filterCategoryCourses();
}

function resetCategoryCertFilters() {
    document.getElementById('categoryCertLevelFilter').value = '';
    filterCategoryCertifications();
}

// ============================================
// TAB SWITCHING
// ============================================

function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content-item').forEach(content => {
                content.classList.remove('active');
            });
            
            if (tab === 'courses') {
                document.getElementById('categoryCoursesTab').classList.add('active');
            } else if (tab === 'certifications') {
                document.getElementById('categoryCertificationsTab').classList.add('active');
            }
        });
    });
}

// ============================================
// COURSE DETAILS MODAL
// ============================================

async function showCourseDetailsModal(courseId) {
    try {
        const response = await fetch(API_ENDPOINTS.courseById(courseId));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            displayCourseModal(data.data);
        }
    } catch (error) {
        console.error('Error loading course details:', error);
        alert('Unable to load course details. Please try again later.');
    }
}

function displayCourseModal(courseData) {
    const modalHTML = `
        <div class="course-modal-overlay" id="courseModal">
            <div class="course-modal">
                <div class="course-modal-header">
                    <h2>${courseData.title}</h2>
                    <button class="close-modal" onclick="closeCourseModal()">&times;</button>
                </div>
                <div class="course-modal-body">
                    ${courseData.feature_image_url ? `<img src="${courseData.feature_image_url}" alt="${courseData.title}" class="course-modal-image">` : ''}
                    
                    <div class="course-modal-section">
                        <h3>Course Overview</h3>
                        <p>${courseData.description || 'No description available.'}</p>
                    </div>
                    
                    ${courseData.course_tagline ? `
                        <div class="course-modal-section">
                            <p class="course-tagline"><em>${courseData.course_tagline}</em></p>
                        </div>
                    ` : ''}
                    
                    ${courseData.certificate_overview ? `
                        <div class="course-modal-section">
                            <h3>Certificate Overview</h3>
                            <ul>
                                ${courseData.certificate_overview.included_items ? `<li><strong>Included:</strong> ${courseData.certificate_overview.included_items}</li>` : ''}
                                ${courseData.certificate_overview.certificate_duration ? `<li><strong>Duration:</strong> ${courseData.certificate_overview.certificate_duration}</li>` : ''}
                                ${courseData.certificate_overview.prerequisites ? `<li><strong>Prerequisites:</strong> ${courseData.certificate_overview.prerequisites}</li>` : ''}
                                ${courseData.certificate_overview.exam_format ? `<li><strong>Exam Format:</strong> ${courseData.certificate_overview.exam_format}</li>` : ''}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="course-modal-actions">
                        <button class="btn-enroll">Enroll Now</button>
                        <button class="btn-contact" onclick="window.location.href='contact.html'">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function extractLevel(title, description) {
    const text = `${title} ${description || ''}`.toLowerCase();
    if (text.includes('advanced') || text.includes('expert')) return 'advanced';
    if (text.includes('intermediate') || text.includes('practitioner')) return 'intermediate';
    if (text.includes('beginner') || text.includes('foundation') || text.includes('fundamental')) return 'beginner';
    return 'intermediate';
}

function generateRating() {
    const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
    const counts = [7, 8, 15, 95, 142, 181, 267];
    
    const value = ratings[Math.floor(Math.random() * ratings.length)];
    const count = counts[Math.floor(Math.random() * counts.length)];
    
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return { stars: starsHTML, value: value, count: count };
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function showLoading(container, type) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading ${type}...</p>
        </div>
    `;
}

function showError(container, type) {
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load ${type}. Please try again later.</p>
            <button class="btn-retry" onclick="location.reload()">Retry</button>
        </div>
    `;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupCategoryEventListeners() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Secondary navbar active state
    const secondaryLinks = document.querySelectorAll('.secondary-navbar .nav-link');
    secondaryLinks.forEach(link => {
        link.addEventListener('click', function() {
            secondaryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Highlight active section
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.secondary-navbar .nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}
