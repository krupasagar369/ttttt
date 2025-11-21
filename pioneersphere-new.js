/* ============================================
   PIONEERSPHERE NEW - INTERACTIVE FEATURES
   No Errors - Clean Version
============================================ */

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ============================================
// YOUTUBE VIDEOS DATA
// ============================================
const youtubeVideos = [
    {
        id: 1,
        embedId: 'y3qHNsvarNQ',
        title: 'GitHub Copilot — Your AI Pair Programmer',
        description: 'Unlock the future of software development with GitHub Copilot, the AI tool transforming how we write, refactor, and collaborate on code. Whether you\'re a beginner or an experienced developer, Copilot enhances your coding experience by providing intelligent code suggestions and automating repetitive tasks.',
        category: 'ld-strategy',
        duration: '15:30',
        views: '5,234',
        date: '28 Oct 2025'
    },
    {
        id: 2,
        embedId: '0FiOzsET_Mc',
        title: 'Copilot by Mayur Prabhune',
        description: 'Join Mayur in this insightful webinar to explore how Microsoft Copilot is transforming work—streamlining tasks, boosting creativity, and helping professionals work smarter, faster, and more effectively.',
        category: 'hr-tech',
        duration: '18:45',
        views: '4,156',
        date: '25 Oct 2025'
    },
    {
        id: 3,
        embedId: 'zZORjazJukM',
        title: 'Team Motivation & Business Communication CA Mohit Gupta',
        description: 'Unlock the secrets to confident leadership, purposeful communication, and team synergy in this power-packed webinar hosted by Mohit Gupta.',
        category: 'manufacturing',
        duration: '20:15',
        views: '6,789',
        date: '22 Oct 2025'
    },
    {
        id: 4,
        embedId: '3hlxam4-dos',
        title: 'Generative AI by Mayur from Pioneer Business Solutions.',
        description: 'Generative AI is changing the way we work, create, and think. In this insightful webinar, we break down complex concepts into practical takeaways—perfect for professionals, learners, and tech enthusiasts eager to understand the future of AI.',
        category: 'lms',
        duration: '22:30',
        views: '3,421',
        date: '20 Oct 2025'
    },
    {
        id: 5,
        embedId: 'ScMzIvxBSi4',
        title: 'Leadership in the Digital Age',
        description: 'Essential leadership skills and strategies for navigating digital transformation and remote teams.',
        category: 'leadership',
        duration: '17:20',
        views: '7,234',
        date: '18 Oct 2025'
    },
    {
        id: 6,
        embedId: '14guleT5Yes',
        title: 'CAD/CAM Technologies in Modern Engineering',
        description: 'Learn about the latest CAD/CAM tools and their applications in product design and manufacturing.',
        category: 'engineering',
        duration: '25:10',
        views: '2,987',
        date: '15 Oct 2025'
    },

];

// Video management variables
const VIDEOS_PER_PAGE = 5;
let currentVideoPage = 1;
let filteredVideos = [...youtubeVideos];

const categoryNames = {
    'ld-strategy': 'L&D Strategy',
    'hr-tech': 'HR Tech',
    'lms': 'LMS',
    'engineering': 'Engineering',
    'manufacturing': 'Manufacturing',
    'leadership': 'Leadership'
};

// ============================================
// DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    handleURLHash();
    renderVideos();
    setupAllEventListeners();
});

// ============================================
// URL HASH NAVIGATION
// ============================================
window.addEventListener('hashchange', handleURLHash);

document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.includes('#')) {
            e.preventDefault();
            const hash = href.split('#')[1];
            activateTab(hash);
            
            const connectType = this.getAttribute('data-connect');
            if (connectType) {
                setTimeout(() => activateConnectTab(connectType), 300);
            }
            
            window.location.hash = hash;
            
            setTimeout(() => {
                document.querySelector('.ps-tab-navigation').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });
});

function handleURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) activateTab(hash);
}

function activateTab(tabId) {
    const cleanTabId = tabId.replace('-tab', '');
    const tabButton = document.getElementById(`${cleanTabId}-tab`);
    const tabContent = document.getElementById(cleanTabId);
    
    if (tabButton && tabContent) {
        const tab = new bootstrap.Tab(tabButton);
        tab.show();
    }
}

function activateConnectTab(connectType) {
    const connectTabButton = document.getElementById(`${connectType}-tab`);
    if (connectTabButton) {
        const tab = new bootstrap.Tab(connectTabButton);
        tab.show();
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateCounter(entry.target);
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter, .stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ============================================
// WEBINAR FILTERING (INDEPENDENT)
// ============================================
function filterWebinars() {
    const webinarSearch = document.getElementById('webinarSearch');
    const webinarCategory = document.getElementById('webinarCategory');
    const webinarStatus = document.getElementById('webinarStatus');
    
    const searchTerm = webinarSearch ? webinarSearch.value.toLowerCase() : '';
    const category = webinarCategory ? webinarCategory.value : 'all';
    const status = webinarStatus ? webinarStatus.value : 'all';
    
    // Filter upcoming webinars
    document.querySelectorAll('#upcomingWebinars [data-category][data-status]').forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardStatus = card.getAttribute('data-status');
        const cardText = card.textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesStatus = status === 'all' || cardStatus === status;
        
        card.style.display = (matchesSearch && matchesCategory && matchesStatus) ? 'block' : 'none';
    });
    
    // Filter past webinars
    document.querySelectorAll('#pastWebinars [data-category][data-status]').forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardStatus = card.getAttribute('data-status');
        const cardText = card.textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesStatus = status === 'all' || cardStatus === status;
        
        card.style.display = (matchesSearch && matchesCategory && matchesStatus) ? 'block' : 'none';
    });
}

// ============================================
// VIDEO MANAGEMENT (KNOWLEDGE BANK)
// ============================================
function renderVideos() {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;

    videoGrid.innerHTML = '';

    const startIndex = (currentVideoPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    const videosToShow = filteredVideos.slice(startIndex, endIndex);

    videosToShow.forEach((video, index) => {
        const videoCard = createVideoCard(video, startIndex + index);
        videoGrid.appendChild(videoCard);
    });

    renderVideoPagination();
    AOS.refresh();
}

function createVideoCard(video, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-12';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', (index % VIDEOS_PER_PAGE) * 100);
    col.setAttribute('data-category', video.category);

    col.innerHTML = `
        <div class="ps-video-card" data-video-id="${video.id}">
            <div class="row g-0">
                <div class="col-lg-5">
                    <div class="ps-video-thumbnail" data-embed-id="${video.embedId}">
                        <iframe 
                            src="https://www.youtube.com/embed/${video.embedId}" 
                            title="${video.title}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" 
                            allowfullscreen>
                        </iframe>
                        <div class="ps-video-overlay">
                            <div class="ps-video-play-icon">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <span class="ps-video-duration">${video.duration}</span>
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="ps-video-content">
                        <span class="ps-video-category">${categoryNames[video.category]}</span>
                        <h5>${video.title}</h5>
                        <p>${video.description}</p>
                        <div class="ps-video-stats">
                            <span><i class="fas fa-eye"></i> ${video.views} views</span>
                            <span><i class="fas fa-calendar"></i> ${video.date}</span>
                            <span><i class="fas fa-clock"></i> ${video.duration}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const thumbnail = col.querySelector('.ps-video-thumbnail');
    thumbnail.addEventListener('click', () => openVideoModal(video.embedId, video.title));

    return col;
}

function renderVideoPagination() {
    const paginationList = document.getElementById('videoPaginationList');
    if (!paginationList) return;

    paginationList.innerHTML = '';
    const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentVideoPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#"><i class="fas fa-chevron-left"></i></a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentVideoPage > 1) {
            currentVideoPage--;
            renderVideos();
            scrollToKnowledgeBank();
        }
    });
    paginationList.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentVideoPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentVideoPage = i;
            renderVideos();
            scrollToKnowledgeBank();
        });
        paginationList.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentVideoPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentVideoPage < totalPages) {
            currentVideoPage++;
            renderVideos();
            scrollToKnowledgeBank();
        }
    });
    paginationList.appendChild(nextLi);
}

function scrollToKnowledgeBank() {
    const knowledgeSection = document.getElementById('knowledge');
    if (knowledgeSection) {
        knowledgeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openVideoModal(embedId, title) {
    let modal = document.getElementById('videoModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'ps-video-modal';
        modal.innerHTML = `
            <div class="ps-video-modal-content">
                <button class="ps-video-modal-close" onclick="closeVideoModal()">
                    <i class="fas fa-times"></i>
                </button>
                <iframe 
                    id="modalVideoIframe"
                    src="" 
                    title="${title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeVideoModal();
        });
    }
    
    const iframe = document.getElementById('modalVideoIframe');
    iframe.src = `https://www.youtube.com/embed/${embedId}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        const iframe = document.getElementById('modalVideoIframe');
        iframe.src = '';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

window.closeVideoModal = closeVideoModal;

// ============================================
// SETUP ALL EVENT LISTENERS
// ============================================
function setupAllEventListeners() {
    // Webinar filters
    const webinarSearch = document.getElementById('webinarSearch');
    const webinarCategory = document.getElementById('webinarCategory');
    const webinarStatus = document.getElementById('webinarStatus');
    
    if (webinarSearch) webinarSearch.addEventListener('input', filterWebinars);
    if (webinarCategory) webinarCategory.addEventListener('change', filterWebinars);
    if (webinarStatus) webinarStatus.addEventListener('change', filterWebinars);
    
    // Video search
    const videoSearch = document.getElementById('videoSearch');
    if (videoSearch) {
        videoSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filteredVideos = youtubeVideos.filter(video => {
                const searchableText = `${video.title} ${video.description} ${video.category}`.toLowerCase();
                return searchableText.includes(searchTerm);
            });
            currentVideoPage = 1;
            renderVideos();
        });
    }
    
    // Video category buttons
    const videoCategoryButtons = document.querySelectorAll('#knowledge .ps-category-btn');
    videoCategoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            videoCategoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            if (videoSearch) videoSearch.value = '';
            
            if (category === 'all') {
                filteredVideos = [...youtubeVideos];
            } else {
                filteredVideos = youtubeVideos.filter(video => video.category === category);
            }
            
            currentVideoPage = 1;
            renderVideos();
        });
    });
    
    // Tab changes
    document.querySelectorAll('.ps-main-tabs .nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target');
            
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            AOS.refresh();
            
            setTimeout(() => {
                document.querySelector('.ps-tab-navigation').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        });
    });
    
    // Smooth scroll for pill toggles
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function() {
            setTimeout(() => {
                document.querySelector('.ps-tab-navigation').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', function() {
    if (backToTopBtn) {
        backToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// ESC KEY TO CLOSE MODAL
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideoModal();
});

// ============================================
// FORM VALIDATIONS
// ============================================
const forms = document.querySelectorAll('.needs-validation');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});

// ============================================
// CONSOLE LOG
// ============================================
console.log('%cPioneerSphere', 'font-size: 24px; font-weight: bold; color: #14377C;');
console.log('%cA Pioneer Business Solutions Initiative', 'font-size: 14px; color: #188B73;');
console.log('✓ Page loaded successfully');
console.log('✓ Interactive features initialized');
console.log('✓ No JavaScript errors');
