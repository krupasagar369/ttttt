// ============================================
// TRAINING CALENDAR PAGE - ENHANCED FILTERING
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
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const monthFilter = document.getElementById('monthFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const modeFilter = document.getElementById('modeFilter');
    const searchInput = document.getElementById('calendarSearchInput');
    const trainingItems = document.querySelectorAll('.training-item');
    const noResultsElement = document.getElementById('noCalendarResults');
    const totalCoursesElement = document.getElementById('totalCourses');

    // Current date tracking
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // ENHANCED TRAINING DATA WITH MORE DETAILS
    const trainingData = [
        {
            date: '2025-11-15',
            title: 'AWS Solutions Architect Associate',
            category: 'cloud',
            mode: 'live-online',
            status: 'available',
            duration: '3 Days',
            seats: 15
        },
           {
            date: '2025-10-28',
            title: 'Python for Data Analysis',
            category: 'pyothon',
            mode: 'live-online',
            status: 'available',
            duration: '3 Days',
            seats: 15
        },
        {
            date: '2025-11-20',
            title: 'Machine Learning with Python',
            category: 'ai-ml',
            mode: 'classroom',
            status: 'filling',
            duration: '4 Days',
            seats: 8
        },
        {
            date: '2025-11-25',
            title: 'Docker & Kubernetes',
            category: 'devops',
            mode: 'live-online',
            status: 'available',
            duration: '3 Days',
            seats: 20
        },
        {
            date: '2025-12-05',
            title: 'Kubernetes Essentials',
            category: 'devops',
            mode: 'live-online',
            status: 'available',
            duration: '3 Days',
            seats: 20
        },
        {
            date: '2025-12-10',
            title: 'Azure Administrator AZ-104',
            category: 'cloud',
            mode: 'classroom',
            status: 'available',
            duration: '4 Days',
            seats: 12
        },
        {
            date: '2025-12-12',
            title: 'PMP Certification Prep',
            category: 'project-mgmt',
            mode: 'hybrid',
            status: 'filling',
            duration: '5 Days',
            seats: 2
        },
        {
            date: '2025-12-18',
            title: 'Data Science with Python',
            category: 'data',
            mode: 'live-online',
            status: 'available',
            duration: '5 Days',
            seats: 18
        }
        
    ];

    // Get filtered training data based on current filters
    function getFilteredTrainingData() {
        const selectedCategory = categoryFilter.value;
        const selectedMode = modeFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        return trainingData.filter(training => {
            const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory;
            const matchesMode = selectedMode === 'all' || training.mode === selectedMode;
            const matchesSearch = searchTerm === '' || 
                                 training.title.toLowerCase().includes(searchTerm);
            
            return matchesCategory && matchesMode && matchesSearch;
        });
    }

    // View Toggle Functionality
    calendarViewBtn.addEventListener('click', function() {
        switchView('calendar');
    });

    listViewBtn.addEventListener('click', function() {
        switchView('list');
    });

    function switchView(view) {
        if (view === 'calendar') {
            calendarView.style.display = 'block';
            listView.style.display = 'none';
            calendarViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else {
            calendarView.style.display = 'none';
            listView.style.display = 'block';
            calendarViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        }
    }

    // Calendar Navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // ENHANCED CALENDAR RENDER WITH FILTERING
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Update current month display
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Get filtered data
        const filteredData = getFilteredTrainingData();

        // Filter data for current month
        const currentMonthTraining = filteredData.filter(training => {
            const trainingDate = new Date(training.date);
            return trainingDate.getMonth() === currentMonth && 
                   trainingDate.getFullYear() === currentYear;
        });

        // Clear calendar grid
        calendarGrid.innerHTML = '';

        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = createDayElement(day, 'other-month', null);
            calendarGrid.appendChild(dayElement);
        }

        // Add current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Find trainings for this day
            const dayTrainings = currentMonthTraining.filter(t => t.date === dateStr);
            
            const dayElement = createDayElement(day, dayTrainings.length > 0 ? 'has-training' : '', dayTrainings);
            calendarGrid.appendChild(dayElement);
        }

        // Add next month days
        const totalCells = calendarGrid.children.length - 7;
        const remainingCells = 42 - totalCells - 7;
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, 'other-month', null);
            calendarGrid.appendChild(dayElement);
        }

        // Show message if no courses in this month
        checkCalendarStatus(currentMonthTraining.length);
    }

    // Create day element with training data
    function createDayElement(day, className = '', trainings = null) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${className}`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        if (trainings && trainings.length > 0) {
            const dayEvents = document.createElement('div');
            dayEvents.className = 'day-events';
            
            trainings.forEach(training => {
                const indicator = document.createElement('span');
                indicator.className = `event-indicator ${training.status}`;
                indicator.title = training.title;
                dayEvents.appendChild(indicator);
            });
            
            dayElement.appendChild(dayEvents);

            // Add click event to show training details
            dayElement.addEventListener('click', function() {
                showTrainingDetails(trainings);
            });
        }

        return dayElement;
    }

    // Show training details in a tooltip or modal
    function showTrainingDetails(trainings) {
        let detailsHTML = '<div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; max-width: 500px;">';
        detailsHTML += '<h4 style="color: #14377C; margin-bottom: 15px;">Training Sessions</h4>';
        
        trainings.forEach(training => {
            detailsHTML += `
                <div style="border-left: 4px solid #188B73; padding-left: 15px; margin-bottom: 15px;">
                    <h5 style="color: #14377C; margin-bottom: 5px;">${training.title}</h5>
                    <p style="margin: 5px 0; color: #6C757D; font-size: 14px;">
                        <strong>Mode:</strong> ${training.mode.replace('-', ' ').toUpperCase()}<br>
                        <strong>Duration:</strong> ${training.duration}<br>
                        <strong>Seats:</strong> ${training.seats} available<br>
                        <strong>Status:</strong> <span style="color: ${training.status === 'available' ? '#188B73' : '#C39635'}">${training.status.toUpperCase()}</span>
                    </p>
                </div>
            `;
        });
        
        detailsHTML += '<button onclick="this.parentElement.remove()" style="background: #14377C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">Close</button>';
        detailsHTML += '</div>';
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.innerHTML = detailsHTML;
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;';
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        document.body.appendChild(overlay);
    }

    // Check calendar status and show appropriate message
    function checkCalendarStatus(courseCount) {
        const existingMessage = document.getElementById('calendar-status-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (courseCount === 0) {
            const selectedCategory = categoryFilter.value;
            const selectedMode = modeFilter.value;
            const monthName = monthNames[currentMonth];
            
            let message = `No courses found in ${monthName} ${currentYear}`;
            
            if (selectedCategory !== 'all' || selectedMode !== 'all') {
                message += ' with the selected filters:';
                if (selectedCategory !== 'all') {
                    message += ` Category: ${selectedCategory.replace('-', ' ').toUpperCase()}`;
                }
                if (selectedMode !== 'all') {
                    message += ` | Mode: ${selectedMode.replace('-', ' ').toUpperCase()}`;
                }
            }

            const messageDiv = document.createElement('div');
            messageDiv.id = 'calendar-status-message';
            messageDiv.style.cssText = 'background: #FFF3CD; color: #856404; padding: 15px 20px; border-radius: 10px; margin-top: 20px; text-align: center; border: 2px solid #FFEEBA;';
            messageDiv.innerHTML = `
                <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                <strong>${message}</strong>
                <br><small style="margin-top: 5px; display: block;">Try adjusting your filters or selecting a different month.</small>
            `;
            
            calendarGrid.parentElement.appendChild(messageDiv);
        }
    }

    // Initial calendar render
    renderCalendar();

    // ENHANCED FILTER FUNCTIONALITY FOR LIST VIEW
    function filterTraining() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMonth = monthFilter.value;
        const selectedCategory = categoryFilter.value;
        const selectedMode = modeFilter.value;

        let visibleCount = 0;
        let filteredByMonth = [];

        trainingItems.forEach(item => {
            const title = item.querySelector('.training-title').textContent.toLowerCase();
            const desc = item.querySelector('.training-desc').textContent.toLowerCase();
            const itemMonth = item.getAttribute('data-month');
            const itemCategory = item.getAttribute('data-category');
            const itemMode = item.getAttribute('data-mode');

            const matchesSearch = searchTerm === '' || title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesMonth = selectedMonth === 'all' || itemMonth === selectedMonth;
            const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
            const matchesMode = selectedMode === 'all' || itemMode === selectedMode;

            if (matchesSearch && matchesMonth && matchesCategory && matchesMode) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }

            if (matchesMonth && !matchesCategory && !matchesMode && !matchesSearch) {
                filteredByMonth.push(item);
            }
        });

        // Update custom no results message
        updateNoResultsMessage(visibleCount, selectedMonth, selectedCategory, selectedMode, searchTerm);

        // Update total courses count
        if (totalCoursesElement) {
            totalCoursesElement.textContent = visibleCount;
        }

        // Update calendar view when filters change
        renderCalendar();
    }

    // Enhanced no results message
    function updateNoResultsMessage(count, month, category, mode, search) {
        if (noResultsElement) {
            if (count === 0) {
                let customMessage = 'No training sessions found';
                let suggestions = [];

                if (search !== '') {
                    customMessage = `No courses match "${search}"`;
                    suggestions.push('Try different keywords');
                }
                
                if (month !== 'all') {
                    customMessage += ` in ${month.charAt(0).toUpperCase() + month.slice(1)} 2025`;
                }

                if (category !== 'all') {
                    customMessage += ` for ${category.replace('-', ' ').toUpperCase()} category`;
                    suggestions.push('Try a different category');
                }

                if (mode !== 'all') {
                    customMessage += ` with ${mode.replace('-', ' ').toUpperCase()} mode`;
                    suggestions.push('Try a different delivery mode');
                }

                if (suggestions.length === 0) {
                    suggestions.push('Try adjusting your filters');
                    suggestions.push('Check other months');
                }

                noResultsElement.innerHTML = `
                    <i class="fas fa-calendar-times"></i>
                    <h3>${customMessage}</h3>
                    <p style="margin-bottom: 15px;">Suggestions:</p>
                    <ul style="list-style: none; padding: 0; color: #6C757D;">
                        ${suggestions.map(s => `<li style="margin: 8px 0;"><i class="fas fa-arrow-right" style="color: #188B73; margin-right: 8px;"></i>${s}</li>`).join('')}
                    </ul>
                `;
                noResultsElement.style.display = 'block';
            } else {
                noResultsElement.style.display = 'none';
            }
        }
    }

    // Add event listeners for filters
    if (searchInput) searchInput.addEventListener('input', filterTraining);
    if (monthFilter) monthFilter.addEventListener('change', filterTraining);
    if (categoryFilter) categoryFilter.addEventListener('change', filterTraining);
    if (modeFilter) modeFilter.addEventListener('change', filterTraining);

    // Register button animation
    const registerButtons = document.querySelectorAll('.btn-register');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const trainingItem = this.closest('.training-item');
            const trainingTitle = trainingItem.querySelector('.training-title').textContent;
            
            // Show confirmation
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check me-2"></i>Registered!';
                this.style.background = '#188B73';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.pointerEvents = 'auto';
                    this.style.background = '';
                }, 2000);
            }, 1500);
        });
    });

    // Initialize with list view if on mobile
    if (window.innerWidth < 768) {
        switchView('list');
    }

    // Initial filter
    filterTraining();

});

// Back to top button
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
