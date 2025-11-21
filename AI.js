

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'https://www.aicerts.ai/wp-json/aicerts-api/v1';
const API_ENDPOINTS = {
    courses: `${API_BASE_URL}/courses`,
    courseById: (id) => `${API_BASE_URL}/course/${id}`
};

// Global storage for courses and certifications
let allCourses = [];
let allCertifications = [];
let filteredCourses = [];
let filteredCertifications = [];
let isLoading = false;

// Pagination settings
const ITEMS_PER_PAGE = 10;
let currentCoursePage = 1;
let currentCertPage = 1;

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadCoursesFromAPI();
    loadCertificationsFromAPI();
    
    // Setup event listeners
    setupEventListeners();
});

// ============================================
// API DATA FETCHING
// ============================================

/**
 * Fetch all courses from AICERTs API
 */
async function loadCoursesFromAPI() {
    const coursesList = document.getElementById('coursesList');
    const coursesCount = document.getElementById('coursesCount');
    
    // Show loading state
    showLoading(coursesList, 'courses');
    
    try {
        let page = 1;
        let allFetchedCourses = [];
        let hasMorePages = true;
        
        // Fetch all pages
        while (hasMorePages) {
            const response = await fetch(`${API_ENDPOINTS.courses}?page=${page}&per_page=50`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
                allFetchedCourses = allFetchedCourses.concat(data.data);
                
                // Check if there are more pages
                if (page >= data.total_pages) {
                    hasMorePages = false;
                } else {
                    page++;
                }
            } else {
                hasMorePages = false;
            }
        }
        
        // Store courses globally
        allCourses = allFetchedCourses;
        filteredCourses = allFetchedCourses;
        
        // Reset to page 1
        currentCoursePage = 1;
        
        // Render courses with pagination
        renderCoursesWithPagination();
        coursesCount.textContent = allCourses.length;
        
    } catch (error) {
        console.error('Error loading courses:', error);
        showError(coursesList, 'courses');
    }
}

/**
 * Fetch all certifications from AICERTs API
 */
async function loadCertificationsFromAPI() {
    const certificationsList = document.getElementById('certificationsList');
    const certificationsCount = document.getElementById('certificationsCount');
    
    // Show loading state
    showLoading(certificationsList, 'certifications');
    
    try {
        let page = 1;
        let allFetchedCerts = [];
        let hasMorePages = true;
        
        // Fetch all pages
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
        
        // Store certifications globally
        allCertifications = allFetchedCerts;
        filteredCertifications = allFetchedCerts;
        
        // Reset to page 1
        currentCertPage = 1;
        
        // Render certifications with pagination
        renderCertificationsWithPagination();
        certificationsCount.textContent = allCertifications.length;
        
    } catch (error) {
        console.error('Error loading certifications:', error);
        showError(certificationsList, 'certifications');
    }
}

// ============================================
// RENDERING FUNCTIONS WITH PAGINATION
// ============================================

/**
 * Render courses with pagination
 */
function renderCoursesWithPagination() {
    const coursesList = document.getElementById('coursesList');
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    
    // Calculate start and end indices
    const startIndex = (currentCoursePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const coursesToShow = filteredCourses.slice(startIndex, endIndex);
    
    // Render courses
    renderCourses(coursesToShow);
    
    // Render pagination controls
    renderPaginationControls('courses', currentCoursePage, totalPages);
}

/**
 * Render certifications with pagination
 */
function renderCertificationsWithPagination() {
    const certificationsList = document.getElementById('certificationsList');
    const totalPages = Math.ceil(filteredCertifications.length / ITEMS_PER_PAGE);
    
    // Calculate start and end indices
    const startIndex = (currentCertPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const certsToShow = filteredCertifications.slice(startIndex, endIndex);
    
    // Render certifications
    renderCertifications(certsToShow);
    
    // Render pagination controls
    renderPaginationControls('certifications', currentCertPage, totalPages);
}

/**
 * Render pagination controls
 */
function renderPaginationControls(type, currentPage, totalPages) {
    const containerId = type === 'courses' ? 'coursesPagination' : 'certificationsPagination';
    let container = document.getElementById(containerId);
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'pagination-container';
        
        const parentList = type === 'courses' ? 
            document.getElementById('coursesList').parentElement : 
            document.getElementById('certificationsList').parentElement;
        parentList.appendChild(container);
    }
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage('${type}', ${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage('${type}', 1)">1</button>
            ${startPage > 2 ? '<span class="pagination-dots">...</span>' : ''}
        `;
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage('${type}', ${i})">
                ${i}
            </button>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-dots">...</span>' : ''}
            <button class="pagination-btn" onclick="changePage('${type}', ${totalPages})">${totalPages}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage('${type}', ${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationHTML += '</div>';
    
    // Page info
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, type === 'courses' ? filteredCourses.length : filteredCertifications.length);
    const totalItems = type === 'courses' ? filteredCourses.length : filteredCertifications.length;
    
    paginationHTML += `
        <div class="pagination-info">
            Showing ${startItem}-${endItem} of ${totalItems} ${type}
        </div>
    `;
    
    container.innerHTML = paginationHTML;
}

/**
 * Change page
 */
function changePage(type, page) {
    if (type === 'courses') {
        const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentCoursePage = page;
        renderCoursesWithPagination();
        
        // Scroll to top of courses section
        document.getElementById('coursesList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        const totalPages = Math.ceil(filteredCertifications.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentCertPage = page;
        renderCertificationsWithPagination();
        
        // Scroll to top of certifications section
        document.getElementById('certificationsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Render courses into the DOM
 */
function renderCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';
    
    if (!courses || courses.length === 0) {
        coursesList.innerHTML = '<div class="no-results"><p>No courses found matching your criteria.</p></div>';
        return;
    }
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesList.appendChild(courseCard);
    });
}

/**
 * Create a course card element
 */
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    // Extract categories for filtering
    const category = course.categories && course.categories.length > 0 ? course.categories[0].toLowerCase() : '';
    
    // Set data attributes for filtering
    card.setAttribute('data-product', extractProductType(course.title));
    card.setAttribute('data-practice', category.replace(/\s+/g, '-'));
    card.setAttribute('data-delivery', 'virtual');
    card.setAttribute('data-level', extractLevel(course.title, course.description));
    card.setAttribute('data-role', 'developer');
    
    // Generate star rating
    const rating = generateRating();
    
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
            <span><i class="fas fa-layer-group"></i> ${capitalizeFirstLetter(extractLevel(course.title, course.description))} Level</span>
            <span><i class="fas fa-desktop"></i> Virtual Instructor-Led Training, e-Learning</span>
        </div>
        ${course.description ? `<div class="course-description">${truncateText(course.description, 120)}</div>` : ''}
    `;
    
   // Map full course titles to your renamed page filenames
const coursePageMap = {
  'AI+ Data™': 'ai-data.html',
  'AI Essentials™': 'ai-essentials.html',
  'AI Executive™': 'ai-executive.html',
  'AI Prompt Engineer Level 1™': 'ai-prompt-engineer-level-1.html',
  'AI Prompt Engineer Level 2™': 'ai-prompt-engineer-level-2.html',
  'AI+ Business™': 'abusiness.html',  // renamed with abbrev prefix
  'AI+ Developer™': 'ai-developer.html',
  'AI+ Cloud™': 'ai-cloud.html',
  'AI+ Security Level 1™': 'ai-security-level-1.html',
  'AI+ Security Level 2™': 'ai-security-level-2.html',
  'AI+ Healthcare™': 'ai-healthcare.html',
  'AI+ Robotics™': 'ai-robotics.html',
  'AI+ NLU™': 'ai-nlu.html',
  'AI+ GPT™': 'ai-gpt.html',
  'AI+ Ethical Hacking™': 'ai-ethical-hacking.html',
  'AI+ ML Engineer™': 'ai-ml-engineer.html',
  'AI+ DXO™': 'ai-dxo.html',
  'AI+ Data Science™': 'ai-data-science.html',
  'AI+ Vision™': 'ai-vision.html',
  'AI+ Data Engineering™': 'ai-data-engineering.html',
  'AI+ Security Foundation™': 'ai-security-foundation.html',
  'AI+ Blockchain™': 'ai-blockchain.html',
  'AI+ Executive™ New York': 'ai-executive-new-york.html',
  'Executive Introduction to RSAIF ': 'executive-introduction-to-rsaif.html',
  'Practitioner’s Playbook for RSAIF™': 'practitioners-playbook-for-rsaif.html',
  'AI+ Audio™': 'ai-audio.html',
  'AI+ Vibe Coder™': 'ai-vibe-coder.html',
  'AI+ Video™': 'ai-video.html',
  'AI+ Doctor™': 'ai-doctor.html',
  'AI+ Business Intelligence™': 'ai-business-intelligence.html',
  'AI+ Quality Assurance™': 'ai-quality-assurance.html',
  'AI+ Foundation™': 'ai-foundation.html',
  'AI+ Policy Maker™': 'ai-policy-maker.html',
  'AI+ Government™': 'ai-government.html',
  'AI+ Nurse™': 'ai-nurse.html',
  'AI+ Legal Agent™': 'ai-legal-agent.html',
  'Bitcoin Essentials™': 'bitcoin-essentials.html',
  'Bitcoin Professional™': 'bitcoin-professional.html',
  'Bitcoin and Blockchain Essentials™': 'bitcoin-and-blockchain-essentials.html',
  'Bitcoin Mining & Security™': 'bitcoin-mining-security.html',
  'Blockchain Developer™': 'blockchain-developer.html',
  'Blockchain Executive™': 'blockchain-executive.html',
  'Blockchain Architect™': 'blockchain-architect.html',
  'Blockchain Engineer™': 'blockchain-engineer.html',
  'Blockchain Security™': 'blockchain-security.html',
  'Blockchain Fundamentals™': 'blockchain-fundamentals.html',
  'Blockchain for Business™': 'blockchain-for-business.html',
  'Blockchain Technical Lead™': 'blockchain-technical-lead.html',
  'Blockchain Legal and Compliance™': 'blockchain-legal-&-compliance.html',  // renamed with &
  'Blockchain Project Management™': 'blockchain-project-management.html',
  'Blockchain Smart Contracts™': 'blockchain-smart-contracts.html',
  'Blockchain Security Expert™': 'blockchain-security-expert.html',
  'Blockchain Use Cases™': 'aiblockchain-use-cases.html',  // renamed without dash
  'Blockchain Solutions Architect™': 'blockchain-solutions-architect.html',
};

// In createCourseCard, replace click event code with:
card.addEventListener('click', () => {
  const page = coursePageMap[course.title];
  if (page) {
    window.location.href = page;
  } else {
    alert('Course page not found');
  }
});

    
    return card;
}

/**
 * Render certifications into the DOM
 */
function renderCertifications(certifications) {
    const certificationsList = document.getElementById('certificationsList');
    certificationsList.innerHTML = '';
    
    if (!certifications || certifications.length === 0) {
        certificationsList.innerHTML = '<div class="no-results"><p>No certifications found matching your criteria.</p></div>';
        return;
    }
    
    certifications.forEach(cert => {
        const certCard = createCertificationCard(cert);
        certificationsList.appendChild(certCard);
    });
}

/**
 * Create a compact certification card element (NO IMAGES)
 */
function createCertificationCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card';
    
    // Extract data for filtering
    const category = cert.categories && cert.categories.length > 0 ? cert.categories[0].toLowerCase() : '';
    
    card.setAttribute('data-product', extractProductType(cert.title));
    card.setAttribute('data-practice', category.replace(/\s+/g, '-'));
    card.setAttribute('data-level', extractLevel(cert.title, cert.description));
    
    // Generate rating
    const rating = generateRating();
    
    // Compact card without images
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
            <span class="level-badge"><i class="fas fa-layer-group"></i> ${capitalizeFirstLetter(extractLevel(cert.title, cert.description))}</span>
        </div>
    `;
    
    // Add click event to view details
    card.addEventListener('click', () => {
        showCourseDetails(cert.id);
    });
    
    return card;
}

/**
 * Show detailed course information in a modal
 */
async function showCourseDetails(courseId) {
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

/**
 * Display course details in a modal
 */
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
                    
                    ${courseData.certification_modules && courseData.certification_modules.length > 0 ? `
                        <div class="course-modal-section">
                            <h3>Course Modules</h3>
                            ${courseData.certification_modules.map(module => `
                                <div class="module-item">
                                    <h4>${module.certification_module_title}</h4>
                                    <p>${module.certification_module_description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${courseData.ai_tools && courseData.ai_tools.length > 0 ? `
                        <div class="course-modal-section">
                            <h3>AI Tools Covered</h3>
                            <div class="ai-tools-grid">
                                ${courseData.ai_tools.map(tool => `
                                    <div class="ai-tool-item">
                                        ${tool.tool_image ? `<img src="${tool.tool_image}" alt="${tool.name}">` : ''}
                                        <p>${tool.name}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="course-modal-actions">
                        <button class="btn-enroll">Enroll Now</button>
                        <button class="btn-contact">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

/**
 * Close course modal
 */
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// FILTERING FUNCTIONS
// ============================================

/**
 * Filter courses based on selected criteria
 */
function filterCourses() {
    const productFilter = document.getElementById('productFilter').value.toLowerCase();
    const practiceFilter = document.getElementById('practiceFilter').value.toLowerCase();
    const deliveryFilter = document.getElementById('deliveryFilter').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilterCourse').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value.toLowerCase();
    const searchQuery = document.getElementById('searchCourseInput').value.toLowerCase();
    
    filteredCourses = allCourses.filter(course => {
        const title = course.title.toLowerCase();
        const description = (course.description || '').toLowerCase();
        const categories = course.categories ? course.categories.join(' ').toLowerCase() : '';
        
        const matchesSearch = !searchQuery || title.includes(searchQuery) || description.includes(searchQuery);
        const matchesProduct = !productFilter || title.includes(productFilter.replace('ai-', '').replace('-', ' '));
        const matchesPractice = !practiceFilter || categories.includes(practiceFilter.replace('-', ' '));
        const matchesLevel = !levelFilter || title.includes(levelFilter) || description.includes(levelFilter);
        
        return matchesSearch && matchesProduct && matchesPractice && matchesLevel;
    });
    
    // Reset to page 1
    currentCoursePage = 1;
    
    // Render with pagination
    renderCoursesWithPagination();
    document.getElementById('coursesCount').textContent = filteredCourses.length;
    updateSelectedFilters();
}

/**
 * Filter certifications based on selected criteria
 */
function filterCertifications() {
    const productFilter = document.getElementById('productFilterCert').value.toLowerCase();
    const practiceFilter = document.getElementById('practiceFilterCert').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilterCert').value.toLowerCase();
    const searchQuery = document.getElementById('searchCertInput').value.toLowerCase();
    
    filteredCertifications = allCertifications.filter(cert => {
        const title = cert.title.toLowerCase();
        const description = (cert.description || '').toLowerCase();
        const categories = cert.categories ? cert.categories.join(' ').toLowerCase() : '';
        
        const matchesSearch = !searchQuery || title.includes(searchQuery) || description.includes(searchQuery);
        const matchesProduct = !productFilter || title.includes(productFilter.replace('ai-', '').replace('-', ' '));
        const matchesPractice = !practiceFilter || categories.includes(practiceFilter.replace('-', ' '));
        const matchesLevel = !levelFilter || title.includes(levelFilter) || description.includes(levelFilter);
        
        return matchesSearch && matchesProduct && matchesPractice && matchesLevel;
    });
    
    // Reset to page 1
    currentCertPage = 1;
    
    // Render with pagination
    renderCertificationsWithPagination();
    document.getElementById('certificationsCount').textContent = filteredCertifications.length;
    updateSelectedFiltersCert();
}

/**
 * Update selected filters display for courses
 */
function updateSelectedFilters() {
    const selectedFiltersDiv = document.getElementById('selectedFilters');
    selectedFiltersDiv.innerHTML = '';
    
    const filters = [
        { id: 'productFilter', label: 'Product' },
        { id: 'practiceFilter', label: 'Practice' },
        { id: 'deliveryFilter', label: 'Delivery' },
        { id: 'levelFilterCourse', label: 'Level' },
        { id: 'roleFilter', label: 'Role' }
    ];
    
    let hasFilters = false;
    
    filters.forEach(filter => {
        const select = document.getElementById(filter.id);
        const value = select.value;
        const text = select.options[select.selectedIndex].text;
        
        if (value) {
            hasFilters = true;
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `
                ${text}
                <i class="fas fa-times" onclick="removeFilter('${filter.id}')"></i>
            `;
            selectedFiltersDiv.appendChild(tag);
        }
    });
    
    if (hasFilters) {
        const resetBtn = document.createElement('span');
        resetBtn.className = 'reset-filters';
        resetBtn.textContent = 'Reset All';
        resetBtn.onclick = resetAllFilters;
        selectedFiltersDiv.appendChild(resetBtn);
    }
}

/**
 * Update selected filters display for certifications
 */
function updateSelectedFiltersCert() {
    const selectedFiltersDiv = document.getElementById('selectedFiltersCert');
    selectedFiltersDiv.innerHTML = '';
    
    const filters = [
        { id: 'productFilterCert', label: 'Product' },
        { id: 'practiceFilterCert', label: 'Practice' },
        { id: 'levelFilterCert', label: 'Level' }
    ];
    
    let hasFilters = false;
    
    filters.forEach(filter => {
        const select = document.getElementById(filter.id);
        const value = select.value;
        const text = select.options[select.selectedIndex].text;
        
        if (value) {
            hasFilters = true;
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `
                ${text}
                <i class="fas fa-times" onclick="removeFilterCert('${filter.id}')"></i>
            `;
            selectedFiltersDiv.appendChild(tag);
        }
    });
    
    if (hasFilters) {
        const resetBtn = document.createElement('span');
        resetBtn.className = 'reset-filters';
        resetBtn.textContent = 'Reset All';
        resetBtn.onclick = resetAllFiltersCert;
        selectedFiltersDiv.appendChild(resetBtn);
    }
}

/**
 * Remove individual filter for courses
 */
function removeFilter(filterId) {
    document.getElementById(filterId).value = '';
    filterCourses();
}

/**
 * Remove individual filter for certifications
 */
function removeFilterCert(filterId) {
    document.getElementById(filterId).value = '';
    filterCertifications();
}

/**
 * Reset all course filters
 */
function resetAllFilters() {
    document.getElementById('productFilter').value = '';
    document.getElementById('practiceFilter').value = '';
    document.getElementById('deliveryFilter').value = '';
    document.getElementById('levelFilterCourse').value = '';
    document.getElementById('roleFilter').value = '';
    document.getElementById('searchCourseInput').value = '';
    filterCourses();
}

/**
 * Reset all certification filters
 */
function resetAllFiltersCert() {
    document.getElementById('productFilterCert').value = '';
    document.getElementById('practiceFilterCert').value = '';
    document.getElementById('levelFilterCert').value = '';
    document.getElementById('searchCertInput').value = '';
    filterCertifications();
}

/**
 * Search courses
 */
function searchCourses() {
    filterCourses();
}

/**
 * Search certifications
 */
function searchCertifications() {
    filterCertifications();
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

/**
 * Show loading state
 */
function showLoading(container, type) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading ${type}...</p>
        </div>
    `;
}

/**
 * Show error state
 */
function showError(container, type) {
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load ${type}. Please try again later.</p>
            <button class="btn-retry" onclick="location.reload()">Retry</button>
        </div>
    `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract product type from course title
 */
function extractProductType(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('cloud')) return 'ai-cloud';
    if (titleLower.includes('data')) return 'ai-data';
    if (titleLower.includes('developer')) return 'ai-developer';
    if (titleLower.includes('business')) return 'ai-business';
    if (titleLower.includes('foundation')) return 'ai-foundation';
    return 'ai-general';
}

/**
 * Extract level from title or description
 */
function extractLevel(title, description) {
    const text = `${title} ${description || ''}`.toLowerCase();
    if (text.includes('advanced') || text.includes('expert')) return 'advanced';
    if (text.includes('intermediate') || text.includes('practitioner')) return 'intermediate';
    if (text.includes('beginner') || text.includes('foundation') || text.includes('fundamental')) return 'beginner';
    return 'intermediate';
}

/**
 * Generate random rating
 */
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

/**
 * Capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Toggle filters sidebar (mobile)
 */
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    sidebar.classList.toggle('collapsed');
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    // Tab switching
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
                document.getElementById('coursesTab').classList.add('active');
            } else if (tab === 'certifications') {
                document.getElementById('certificationsTab').classList.add('active');
            }
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .course-card, .cert-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}
// Smooth scroll helper with debounce
let isScrolling = false;

function smoothScrollTo(element) {
  if (isScrolling) return; // prevent overlapping scrolls
  isScrolling = true;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Estimate duration and clear flag after that
  setTimeout(() => {
    isScrolling = false;
  }, 600); // 600ms matches typical smooth scroll duration
}

// Usage example for anchor links:
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      smoothScrollTo(target);
    }
  });
});

// For your pagination scroll after rendering:
function changePage(type, page) {
  if (type === 'courses') {
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentCoursePage = page;
    renderCoursesWithPagination();
    smoothScrollTo(document.getElementById('coursesList'));
  } else {
    const totalPages = Math.ceil(filteredCertifications.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentCertPage = page;
    renderCertificationsWithPagination();
    smoothScrollTo(document.getElementById('certificationsList'));
  }
}
