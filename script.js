/* ============================================
   APARA - Complete & Optimized JavaScript - FIXED
   ============================================ */

'use strict';

// Global variables and configuration
const APARA_CONFIG = {
    whatsapp: {
        phone: '919104956647',
        messages: {
            general: 'Hi APARA team! I want to know more about your eco-friendly biodegradable bottles.',
            product300: 'Hi APARA team! I want to get a quote for APARA 300ml bottles (Pack of 36).',
            product500: 'Hi APARA team! I want to get a quote for APARA 500ml bottles (Pack of 24).',
            product750: 'Hi APARA team! I want to get a quote for APARA 750ml bottles (Pack of 18).',
            customLabels: 'Hi APARA team! I want to know more about custom label solutions for my business.',
            getStarted: 'Hi APARA team! I want to get started with APARA eco-friendly bottles for my business.'
        }
    },
    animations: {
        counterDuration: 2000,
        testimonialInterval: 5000,
        scrollThrottle: 100
    }
};

// Global state
let currentTestimonial = 0;
let testimonialInterval;
let isScrolling = false;
let lastScrollY = 0;
let ticking = false;

// DOM elements cache
const DOM = {
    // Navigation
    mobileMenuToggle: null,
    navLinks: null,
    navLinksItems: null,
    navbar: null,
    
    // Testimonials
    testimonials: null,
    prevBtn: null,
    nextBtn: null,
    
    // FAQ
    faqCards: null,
    
    // Counters
    counters: null,
    
    // Contact buttons - EXPANDED
    contactButtons: null,
    allContactButtons: null,
    
    // Sections for scroll detection
    sections: null
};

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 APARA Website Initializing...');
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initTestimonialSlider();
    initCounterAnimation();
    initNavOnScroll();
    initFaqAccordion();
    initContactButtons();
    initScrollAnimations();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    
    console.log('✅ APARA Website Initialized Successfully!');
});

// Cache DOM Elements for Performance - UPDATED
function cacheDOMElements() {
    DOM.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    DOM.navLinks = document.querySelector('.apara-nav-links');
    DOM.navLinksItems = document.querySelectorAll('.nav-link');
    DOM.navbar = document.querySelector('.apara-navbar');
    
    DOM.testimonials = document.querySelectorAll('.testimonial-card');
    DOM.prevBtn = document.getElementById('prevBtn');
    DOM.nextBtn = document.getElementById('nextBtn');
    
    DOM.faqCards = document.querySelectorAll('.faq-card');
    DOM.counters = document.querySelectorAll('[data-count]');
    
    // EXPANDED CONTACT BUTTONS CACHING
    DOM.contactButtons = document.querySelectorAll('[data-contact="whatsapp"]');
    DOM.allContactButtons = document.querySelectorAll('.apara-contact-btn, .request-btn, .cta-button, .apara-bottle-btn, [data-contact="whatsapp"]');
    
    DOM.sections = document.querySelectorAll('section[id], main[id]');
    
    console.log('DOM Elements Cached:', {
        contactButtons: DOM.contactButtons.length,
        allContactButtons: DOM.allContactButtons.length,
        faqCards: DOM.faqCards.length,
        testimonials: DOM.testimonials.length
    });
}

// ============================================
// MOBILE NAVIGATION - Enhanced
// ============================================

function initMobileMenu() {
    if (!DOM.mobileMenuToggle || !DOM.navLinks) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu
    DOM.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    DOM.navLinksItems.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', handleEscapeKey);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    console.log('✅ Mobile Menu Initialized');
}

function toggleMobileMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isExpanded = DOM.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    // Update ARIA state
    DOM.mobileMenuToggle.setAttribute('aria-expanded', newState);
    
    // Toggle menu visibility
    DOM.navLinks.classList.toggle('mobile-menu-open', newState);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = newState ? 'hidden' : '';
    
    // Focus management
    if (newState) {
        // Focus first menu item when opened
        const firstLink = DOM.navLinks.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    } else {
        // Return focus to toggle button when closed
        DOM.mobileMenuToggle.focus();
    }
    
    // Add/remove backdrop
    toggleBackdrop(newState);
}

function closeMobileMenu() {
    if (window.innerWidth <= 768 && DOM.navLinks && DOM.navLinks.classList.contains('mobile-menu-open')) {
        DOM.navLinks.classList.remove('mobile-menu-open');
        if (DOM.mobileMenuToggle) {
            DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
        toggleBackdrop(false);
    }
}

function handleWindowResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' && DOM.navLinks && DOM.navLinks.classList.contains('mobile-menu-open')) {
        e.preventDefault();
        closeMobileMenu();
        if (DOM.mobileMenuToggle) {
            DOM.mobileMenuToggle.focus();
        }
    }
}

function handleOutsideClick(e) {
    if (DOM.navLinks && DOM.navLinks.classList.contains('mobile-menu-open') && 
        !DOM.navLinks.contains(e.target) && 
        (!DOM.mobileMenuToggle || !DOM.mobileMenuToggle.contains(e.target))) {
        closeMobileMenu();
    }
}

function toggleBackdrop(show) {
    let backdrop = document.getElementById('mobile-menu-backdrop');
    
    if (show && !backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'mobile-menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(backdrop);
        
        // Trigger animation
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
        });
        
        backdrop.addEventListener('click', closeMobileMenu);
    } else if (!show && backdrop) {
        backdrop.style.opacity = '0';
        setTimeout(() => {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }, 300);
    }
}

// ============================================
// SIMPLE CLEAN WHATSAPP - SINGLE TAB GUARANTEED
// ============================================

// WhatsApp function - this will completely replace all existing WhatsApp code
function initContactButtons() {
    console.log('Initializing simple clean WhatsApp...');
    
    // Find all contact buttons - using a broad selector to catch everything
    const contactButtons = document.querySelectorAll('.apara-contact-btn, .request-btn, .cta-button, .apara-bottle-btn, [data-contact="whatsapp"]');
    
    console.log(`Found ${contactButtons.length} contact buttons`);
    
    contactButtons.forEach((button, index) => {
        console.log(`Setting up button ${index}: ${button.className}`);
        
        // Clear any existing handlers by cloning
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Add our single clean handler
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent multiple clicks
            if (this.getAttribute('data-clicked') === 'true') {
                console.log('Button already clicked, ignoring');
                return;
            }
            
            // Mark as clicked
            this.setAttribute('data-clicked', 'true');
            
            // Change text
            const originalText = this.textContent;
            this.textContent = 'Opening WhatsApp...';
            
            // Disable button
            this.disabled = true;
            
            // Get message type
            let message = 'Hi APARA team! I want to know more about your eco-friendly biodegradable bottles.';
            
            const productSku = this.getAttribute('data-product-sku');
            if (productSku && productSku.includes('300')) {
                message = 'Hi APARA team! I want to get a quote for APARA 300ml bottles (Pack of 36).';
            } else if (productSku && productSku.includes('500')) {
                message = 'Hi APARA team! I want to get a quote for APARA 500ml bottles (Pack of 24).';
            } else if (productSku && productSku.includes('750')) {
                message = 'Hi APARA team! I want to get a quote for APARA 750ml bottles (Pack of 18).';
            }
            
            const service = this.getAttribute('data-service');
            if (service === 'custom-labels') {
                message = 'Hi APARA team! I want to know more about custom label solutions for my business.';
            }
            
            const action = this.getAttribute('data-action');
            if (action === 'get-started') {
                message = 'Hi APARA team! I want to get started with APARA eco-friendly bottles for my business.';
            }
            
            console.log('Opening WhatsApp with message:', message);
            
            // Create WhatsApp URL
            const phone = '919104956647';
            const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp after a small delay for visual feedback
            setTimeout(() => {
                // Check if mobile (direct redirect) or desktop (new window)
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                    console.log('Mobile device detected, using direct redirect');
                    window.location.href = whatsappURL;
                } else {
                    console.log('Desktop detected, using window.open');
                    window.open(whatsappURL, '_blank');
                }
                
                // Reset button after delay only on desktop
                if (!isMobile) {
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                        this.removeAttribute('data-clicked');
                    }, 2000);
                }
            }, 500);
        });
    });
    
    console.log('✅ Clean WhatsApp initialized');
}

// Make the global function simpler
window.openWhatsApp = function(messageKey = 'general') {
    console.log('Global openWhatsApp called with:', messageKey);
    
    // Basic messaging without complexity
    const messages = {
        general: 'Hi APARA team! I want to know more about your eco-friendly biodegradable bottles.',
        product300: 'Hi APARA team! I want to get a quote for APARA 300ml bottles (Pack of 36).',
        product500: 'Hi APARA team! I want to get a quote for APARA 500ml bottles (Pack of 24).',
        product750: 'Hi APARA team! I want to get a quote for APARA 750ml bottles (Pack of 18).',
        customLabels: 'Hi APARA team! I want to know more about custom label solutions for my business.',
        getStarted: 'Hi APARA team! I want to get started with APARA eco-friendly bottles for my business.'
    };
    
    const message = messages[messageKey] || messages.general;
    const phone = '919104956647';
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Simple open - no complex logic
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        window.location.href = whatsappURL;
    } else {
        window.open(whatsappURL, '_blank');
    }
};

// Remove any backup initializations - this should be the only WhatsApp code
// Adding this specifically to prevent conflicts
window.addEventListener('load', function() {
    // Check if we have contact buttons without handlers
    setTimeout(() => {
        document.querySelectorAll('.apara-contact-btn').forEach(btn => {
            if (!btn.getAttribute('data-clicked') && !btn.onclick) {
                console.log('Found unintialized button, re-initializing contact buttons');
                initContactButtons();
            }
        });
    }, 2000);
});

// ============================================
// SMOOTH SCROLLING - Enhanced
// ============================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    console.log(`✅ Smooth Scroll Initialized (${navLinks.length} links)`);
}

function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#top') {
        e.preventDefault();
        scrollToTop();
        return;
    }
    
    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        e.preventDefault();
        
        // Close mobile menu if open
        closeMobileMenu();
        
        const navHeight = DOM.navbar ? DOM.navbar.offsetHeight : 78;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        
        // Ultra fast smooth scroll
        smoothScrollTo(targetPosition, 400);
        
        // Update URL without triggering scroll
        if (history.pushState) {
            history.pushState(null, null, href);
        }
        
        // Focus management for accessibility
        setTimeout(() => {
            targetSection.setAttribute('tabindex', '-1');
            targetSection.focus();
            targetSection.removeAttribute('tabindex');
        }, 350);
    }
}

function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easedProgress = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        
        window.scrollTo(0, currentPosition);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            window.scrollTo(0, targetPosition);
        }
    }
    
    requestAnimationFrame(animation);
}

function scrollToTop() {
    isScrolling = true;
    smoothScrollTo(0, 1000);
    
    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

// ============================================
// NAVIGATION SCROLL BEHAVIOR - Enhanced
// ============================================

function initNavOnScroll() {
    if (!DOM.navbar || !DOM.sections.length) {
        console.warn('Navigation scroll elements not found');
        return;
    }
    
    const impactSection = document.getElementById('environmental-impact');
    
    // Throttled scroll handler
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll(impactSection);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    handleScroll(impactSection);
    
    console.log('✅ Navigation Scroll Behavior Initialized');
}

function handleScroll(impactSection) {
    if (isScrolling) return;
    
    const currentScrollY = window.pageYOffset;
    
    // Update navbar style
    updateNavbarStyle(impactSection, currentScrollY);
    
    // Update active nav link
    updateActiveNavLink(currentScrollY);
    
    // Add scroll direction class
    updateScrollDirection(currentScrollY);
    
    lastScrollY = currentScrollY;
}

function updateNavbarStyle(impactSection, scrollY) {
    if (!impactSection) return;
    
    const impactTop = impactSection.offsetTop - 100;
    
    if (scrollY >= impactTop) {
        DOM.navbar.classList.add('nav-light');
    } else {
        DOM.navbar.classList.remove('nav-light');
    }
}

function updateActiveNavLink(scrollY) {
    let current = '';
    
    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
            current = section.getAttribute('id');
        }
    });
    
    DOM.navLinksItems.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function updateScrollDirection(currentScrollY) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        DOM.navbar.classList.add('scrolling-down');
        DOM.navbar.classList.remove('scrolling-up');
    } else {
        DOM.navbar.classList.add('scrolling-up');
        DOM.navbar.classList.remove('scrolling-down');
    }
}

// ============================================
// FAQ ACCORDION - FIXED IMPLEMENTATION
// ============================================

function initFaqAccordion() {
    console.log('Initializing FAQ Accordion...');
    
    // Use a more reliable method
    setTimeout(() => {
        const faqButtons = document.querySelectorAll('.faq-q');
        console.log('Found FAQ buttons:', faqButtons.length);
        
        faqButtons.forEach((button, index) => {
            // Remove any existing handlers
            button.removeEventListener('click', button._faqHandler);
            
            // Create new handler
            button._faqHandler = function(e) {
                e.preventDefault();
                console.log('FAQ clicked:', index);
                
                const card = this.closest('.faq-card');
                const arrow = this.querySelector('.faq-arrow');
                const isOpen = card.classList.contains('open');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-card').forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('open')) {
                        otherCard.classList.remove('open');
                        const otherArrow = otherCard.querySelector('.faq-arrow');
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                            otherArrow.style.color = '#283B31';
                        }
                    }
                });
                
                // Toggle current FAQ
                if (isOpen) {
                    card.classList.remove('open');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                        arrow.style.color = '#283B31';
                    }
                } else {
                    card.classList.add('open');
                    if (arrow) {
                        arrow.style.transform = 'rotate(180deg)';
                        arrow.style.color = '#00AF39';
                    }
                }
            };
            
            // Add event listener
            button.addEventListener('click', button._faqHandler);
            
            // Add hover effects
            button.addEventListener('mouseenter', function() {
                if (!this.closest('.faq-card').classList.contains('open')) {
                    this.style.backgroundColor = 'rgba(0, 175, 57, 0.05)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.closest('.faq-card').classList.contains('open')) {
                    this.style.backgroundColor = '';
                }
            });
        });
        
        console.log('✅ FAQ Accordion Initialized');
    }, 1500);
}

// ============================================
// TESTIMONIAL SLIDER - Enhanced
// ============================================

function initTestimonialSlider() {
    if (!DOM.testimonials.length || !DOM.prevBtn || !DOM.nextBtn) {
        console.warn('Testimonial elements not found');
        return;
    }
    
    // Show first testimonial
    updateTestimonialDisplay();
    
    // Bind navigation buttons
    DOM.prevBtn.addEventListener('click', showPreviousTestimonial);
    DOM.nextBtn.addEventListener('click', showNextTestimonial);
    
    // Keyboard navigation
    DOM.prevBtn.addEventListener('keydown', handleTestimonialKeydown);
    DOM.nextBtn.addEventListener('keydown', handleTestimonialKeydown);
    
    // Touch/swipe support for mobile
    initTestimonialTouch();
    
    // Start autoplay
    startTestimonialAutoplay();
    
    // Pause autoplay on hover/focus
    const testimonialContainer = document.querySelector('.testimonial-cards-arrows');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', stopTestimonialAutoplay);
        testimonialContainer.addEventListener('mouseleave', startTestimonialAutoplay);
        testimonialContainer.addEventListener('focusin', stopTestimonialAutoplay);
        testimonialContainer.addEventListener('focusout', startTestimonialAutoplay);
    }
    
    console.log(`✅ Testimonial Slider Initialized (${DOM.testimonials.length} testimonials)`);
}

function showNextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % DOM.testimonials.length;
    updateTestimonialDisplay();
    announceTestimonialChange();
}

function showPreviousTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + DOM.testimonials.length) % DOM.testimonials.length;
    updateTestimonialDisplay();
    announceTestimonialChange();
}

function updateTestimonialDisplay() {
    // Hide all testimonials
    DOM.testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        testimonial.setAttribute('aria-hidden', 'true');
        testimonial.removeAttribute('tabindex');
    });
    
    // Show current testimonial
    const activeTestimonial = DOM.testimonials[currentTestimonial];
    activeTestimonial.classList.add('active');
    activeTestimonial.setAttribute('aria-hidden', 'false');
    activeTestimonial.setAttribute('tabindex', '0');
    
    // Update button states
    updateTestimonialButtons();
}

function updateTestimonialButtons() {
    DOM.prevBtn.disabled = false;
    DOM.nextBtn.disabled = false;
    
    // Update ARIA labels
    DOM.prevBtn.setAttribute('aria-label', `Previous testimonial (${currentTestimonial + 1} of ${DOM.testimonials.length})`);
    DOM.nextBtn.setAttribute('aria-label', `Next testimonial (${currentTestimonial + 1} of ${DOM.testimonials.length})`);
}

function handleTestimonialKeydown(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPreviousTestimonial();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNextTestimonial();
    }
}

function announceTestimonialChange() {
    const activeTestimonial = DOM.testimonials[currentTestimonial];
    const name = activeTestimonial.querySelector('.testimonial-name')?.textContent || '';
    const role = activeTestimonial.querySelector('.testimonial-role')?.textContent || '';
    
    announceToScreenReader(`Now showing testimonial from ${name}, ${role}`);
}

function initTestimonialTouch() {
    const testimonialContainer = document.querySelector('.testimonial-cards');
    if (!testimonialContainer) return;
    
    let startX = 0;
    let startY = 0;
    let threshold = 50;
    
    testimonialContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    testimonialContainer.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                showNextTestimonial();
            } else {
                showPreviousTestimonial();
            }
        }
        
        startX = 0;
        startY = 0;
    }, { passive: true });
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    testimonialInterval = setInterval(showNextTestimonial, APARA_CONFIG.animations.testimonialInterval);
}

function stopTestimonialAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

// ============================================
// COUNTER ANIMATION - Enhanced
// ============================================

function initCounterAnimation() {
    if (!DOM.counters.length) {
        console.warn('Counter elements not found');
        return;
    }
    
    // Create Intersection Observer for performance
    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                animateCounter(entry.target);
                entry.target.setAttribute('data-animated', 'true');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe all counters
    DOM.counters.forEach(counter => {
        observer.observe(counter);
    });
    
    console.log(`✅ Counter Animation Initialized (${DOM.counters.length} counters)`);
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = APARA_CONFIG.animations.counterDuration;
    const originalText = counter.textContent;
    const hasPlus = originalText.includes('+');
    const hasPercent = originalText.includes('%');
    
    let start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime >= duration) {
            // Final value
            let finalText = target.toLocaleString();
            if (hasPlus) finalText += '+';
            if (hasPercent) finalText += '%';
            counter.textContent = finalText;
            return;
        }
        
        // Eased progress
        const progress = easeOutQuart(elapsedTime / duration);
        const currentCount = Math.floor(progress * target);
        
        let displayText = currentCount.toLocaleString();
        if (hasPlus) displayText += '+';
        if (hasPercent) displayText += '%';
        
        counter.textContent = displayText;
        
        requestAnimationFrame(updateCounter);
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// ============================================
// SCROLL ANIMATIONS - Enhanced
// ============================================

function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.apara-card, .apara-bottle-card, .env-stat, .apara-customer-card, .feature-item'
    );
    
    if (!animateElements.length) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-scroll-animated')) {
                // Stagger animation for multiple elements
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                    
                    entry.target.setAttribute('data-scroll-animated', 'true');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    console.log(`✅ Scroll Animations Initialized (${animateElements.length} elements)`);
}

// ============================================
// KEYBOARD NAVIGATION - Enhanced
// ============================================

function initKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);
    
    // Focus management for interactive elements
    const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', handleElementFocus);
        element.addEventListener('blur', handleElementBlur);
    });
    
    console.log('✅ Keyboard Navigation Initialized');
}

function handleGlobalKeydown(e) {
    // Home key - scroll to top
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        scrollToTop();
    }
    
    // End key - scroll to bottom
    if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // ESC key - close any open modals/menus
    if (e.key === 'Escape') {
        closeMobileMenu();
        stopTestimonialAutoplay();
    }
}

function handleElementFocus(e) {
    e.target.classList.add('keyboard-focused');
}

function handleElementBlur(e) {
    e.target.classList.remove('keyboard-focused');
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

function initPerformanceOptimizations() {
    // Preload critical images
    preloadCriticalImages();
    
    // Lazy load non-critical images
    initLazyLoading();
    
    // Optimize video loading
    optimizeVideoLoading();
    
    // Add performance monitoring
    monitorPerformance();
    
    console.log('✅ Performance Optimizations Initialized');
}

function preloadCriticalImages() {
    const criticalImages = [
        'assets/images/logo.png',
        'assets/images/Darklogo.png',
        'assets/images/herobottle.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function optimizeVideoLoading() {
    const video = document.querySelector('.hero-bg-video');
    if (video) {
        // Pause video when not in viewport
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        console.log('Video autoplay prevented by browser');
                    });
                } else {
                    video.pause();
                }
            });
        });
        
        videoObserver.observe(video);
    }
}

function monitorPerformance() {
    // Simple performance logging
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }
        }, 1000);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Event tracking (placeholder for analytics)
function trackEvent(eventName, eventData) {
    console.log('Event Tracked:', eventName, eventData);
    
    // Integration with Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason?.toString() || 'Unknown'
    });
});

// ============================================
// ENHANCED BACK TO TOP FUNCTIONALITY
// ============================================

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Remove existing onclick
        backToTopBtn.removeAttribute('onclick');
        
        // Add enhanced click handler
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Ultra fast scroll to top
            scrollToTop();
        });
        
        // Show/hide on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
                backToTopBtn.style.transform = 'translateY(10px)';
            }
        });
    }
}

// Initialize back to top
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initBackToTop, 500);
});

// ============================================
// BACKWARDS COMPATIBILITY & LEGACY SUPPORT
// ============================================

// Global functions for backwards compatibility
window.openWhatsApp = function(messageKey) {
    openWhatsApp(messageKey);
};

window.scrollToTop = scrollToTop;

// Legacy FAQ function
window.toggleFaq = function(element) {
    console.log('Legacy toggleFaq called');
    const card = element.closest ? element.closest('.faq-card') : element.parentElement.closest('.faq-card');
    if (card) {
        card.classList.toggle('open');
        const arrow = card.querySelector('.faq-arrow');
        if (arrow) {
            const isOpen = card.classList.contains('open');
            arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            arrow.style.color = isOpen ? '#00AF39' : '#283B31';
        }
    }
};

// ============================================
// FINAL INITIALIZATION
// ============================================

// Run on page load (backup)
window.addEventListener('load', function() {
    console.log('Window loaded, running backup initialization...');
    
    // Backup WhatsApp initialization
    setTimeout(() => {
        if (!DOM.allContactButtons || DOM.allContactButtons.length === 0) {
            console.log('Running backup contact button initialization...');
            const allButtons = document.querySelectorAll('.apara-contact-btn, .request-btn, .cta-button, .apara-bottle-btn');
            allButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Backup WhatsApp handler triggered');
                    const url = 'https://wa.me/919104956647?text=' + encodeURIComponent('Hi APARA team! I want to know more about your eco-friendly bottles.');
                    window.open(url, '_blank');
                });
            });
            console.log('Backup contact buttons initialized:', allButtons.length);
        }
    }, 2000);
});

// ============================================
// FAVICON DARK/LIGHT MODE SWITCHER
// ============================================

function initFaviconSwitcher() {
    console.log('Initializing favicon dark/light mode switcher');
    
    // Get favicon elements
    const faviconLight = document.getElementById('favicon-light');
    const faviconDark = document.getElementById('favicon-dark');
    
    if (!faviconLight || !faviconDark) {
        console.warn('Favicon elements not found');
        return;
    }
    
    // Function to set appropriate favicon based on color scheme
    function setFavicon() {
        // Check if user prefers dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        console.log('User prefers dark mode:', prefersDarkMode);
        
        // Set visibility based on preference
        faviconLight.rel = prefersDarkMode ? '' : 'icon';
        faviconDark.rel = prefersDarkMode ? 'icon' : '';
    }
    
    // Set favicon on page load
    setFavicon();
    
    // Listen for changes to color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);
    
    console.log('✅ Favicon switcher initialized');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initFaviconSwitcher);

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('🎉 APARA JavaScript Fully Loaded and Ready!');