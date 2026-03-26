// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDropzone();
    initAnimations();
    initScrollEffects();
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link?.classList.add('active');
            }
        });
    });

    // Smooth scroll on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const spans = mobileMenuBtn.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
}

// Scroll to section helper
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80;
        const targetPosition = section.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// File Upload / Dropzone
let uploadedFiles = [];

function initDropzone() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadFilesSection = document.getElementById('uploadFiles');

    // Click to upload
    dropzone?.addEventListener('click', () => {
        fileInput?.click();
    });

    // File input change
    fileInput?.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone?.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    
    Array.from(files).forEach(file => {
        // Validate file size
        if (file.size > maxSize) {
            showNotification(`${file.name} is too large. Maximum size is 50MB.`, 'error');
            return;
        }

        // Validate file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(ext)) {
            showNotification(`${file.name} is not a supported file type.`, 'error');
            return;
        }

        // Check for duplicates
        if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            showNotification(`${file.name} is already uploaded.`, 'error');
            return;
        }

        uploadedFiles.push(file);
    });

    if (uploadedFiles.length > 0) {
        displayUploadedFiles();
        document.getElementById('uploadFiles').style.display = 'block';
    }
}

function displayUploadedFiles() {
    const filesList = document.getElementById('filesList');
    const fileCount = document.getElementById('fileCount');
    
    fileCount.textContent = uploadedFiles.length;
    
    filesList.innerHTML = uploadedFiles.map((file, index) => {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const ext = file.name.split('.').pop().toLowerCase();
        
        return `
            <div class="file-item" data-index="${index}">
                <div class="file-info">
                    <div class="file-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                    </div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${sizeInMB} MB • ${ext.toUpperCase()}</div>
                    </div>
                </div>
                <button class="file-remove" onclick="removeFile(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    
    if (uploadedFiles.length === 0) {
        document.getElementById('uploadFiles').style.display = 'none';
        document.getElementById('fileInput').value = '';
    } else {
        displayUploadedFiles();
    }
}

function clearAllFiles() {
    uploadedFiles = [];
    document.getElementById('uploadFiles').style.display = 'none';
    document.getElementById('fileInput').value = '';
}

function analyzeFiles() {
    if (uploadedFiles.length === 0) {
        showNotification('Please upload at least one file to analyze.', 'error');
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    // Simulate AI analysis (in a real app, this would be an API call)
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        
        // Show success message
        showNotification(
            `Successfully analyzed ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}! Check your dashboard for insights.`,
            'success'
        );

        // Animate analysis cards
        animateAnalysisResults();

        // Scroll to analysis section
        setTimeout(() => {
            const analysisSection = document.querySelector('.analysis-section');
            if (analysisSection) {
                analysisSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);

    }, 3000); // 3 second delay to simulate processing
}

function animateAnalysisResults() {
    const progressBars = document.querySelectorAll('.analysis-card .progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
                     type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'};
        border: 1px solid ${type === 'success' ? '#10b981' : 
                           type === 'error' ? '#ef4444' : '#6366f1'};
        border-radius: 0.5rem;
        color: #fafafa;
        font-size: 0.875rem;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg style="width: 20px; height: 20px; flex-shrink: 0; color: ${
                type === 'success' ? '#10b981' : 
                type === 'error' ? '#ef4444' : '#6366f1'
            };" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' :
                  type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' :
                  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .analysis-card, .testimonial-card, .pricing-card, .about-grid, .section-header'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Scroll effects for hero stats
function initScrollEffects() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    window.addEventListener('scroll', () => {
        if (!animated && window.scrollY > 100) {
            animateStats(stats);
            animated = true;
        }
    });
}

function animateStats(stats) {
    stats.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const numStr = text.replace(/[^0-9.]/g, '');
        const target = parseFloat(numStr);
        
        if (isNaN(target)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current).toLocaleString();
            if (target < 100 && !Number.isInteger(target)) {
                displayValue = current.toFixed(1);
            }
            
            stat.textContent = displayValue + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
        }, duration / steps);
    });
}

// Pricing toggle (if you want to add monthly/yearly toggle later)
function togglePricing(period) {
    // This function can be implemented if you want to add pricing toggle
    console.log('Pricing period:', period);
}

// Form validation (if you add a contact form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Testimonials carousel (optional enhancement)
function initTestimonialsCarousel() {
    // This can be implemented if you want an auto-rotating carousel
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    setInterval(() => {
        testimonials[currentIndex].style.transform = 'scale(1)';
        currentIndex = (currentIndex + 1) % testimonials.length;
        testimonials[currentIndex].style.transform = 'scale(1.05)';
    }, 5000);
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Prevent body scroll when loading
function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Analytics tracking (placeholder for Google Analytics or similar)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log('Event tracked:', category, action, label);
}

// Export functions for inline onclick handlers
window.scrollToSection = scrollToSection;
window.removeFile = removeFile;
window.clearAllFiles = clearAllFiles;
window.analyzeFiles = analyzeFiles;
window.togglePricing = togglePricing;

// Page visibility API to pause animations when tab is inactive
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Page visible - resuming animations');
    }
});

// Print page title on console for branding
console.log('%cExam Pattern AI', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cMaster Your Exams with AI Predictions', 'color: #8b5cf6; font-size: 14px;');
console.log('%c💡 Powered by Advanced Machine Learning', 'color: #10b981; font-size: 12px;');

// Service Worker registration (for PWA support - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment this when you have a service worker file
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// Add touch device detection
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// Optimize scroll performance with requestAnimationFrame
let ticking = false;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Perform scroll-related updates here
            ticking = false;
        });
        ticking = true;
    }
});

// Add resize listener for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle resize events
        console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
    }, 250);
});

// Initialize tooltips (if you add them later)
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            // Create and show tooltip
        });
        
        trigger.addEventListener('mouseleave', () => {
            // Hide tooltip
        });
    });
}

// Copy to clipboard helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Format file size helper
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Debounce helper for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle helper for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

console.log('✨ Exam Pattern AI - Fully Loaded!');
