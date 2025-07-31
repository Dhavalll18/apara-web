'use strict';

// Configuration
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
    mobileMenuToggle: null,
    navLinks: null,
    navLinksItems: null,
    navbar: null,
    testimonials: null,
    prevBtn: null,
    nextBtn: null,
    faqCards: null,
    counters: null,
    contactButtons: null,
    sections: null
};

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 APARA Website Initializing...');
    
    cacheDOMElements();
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

// Cache DOM Elements
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
    DOM.contactButtons = document.querySelectorAll('.apara-contact-btn, .request-btn, .cta-button, .apara-bottle-btn, [data-contact="whatsapp"]');
    DOM.sections = document.querySelectorAll('section[id], main[id]');
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileMenu() {
    if (!DOM.mobileMenuToggle || !DOM.navLinks) return;
    
    DOM.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    DOM.navLinksItems.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleOutsideClick);
    
    console.log('✅ Mobile Menu Initialized');
}

function toggleMobileMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isExpanded = DOM.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    DOM.mobileMenuToggle.setAttribute('aria-expanded', newState);
    DOM.navLinks.classList.toggle('mobile-menu-open', newState);
    
    if (newState) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        const firstLink = DOM.navLinks.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        DOM.mobileMenuToggle.focus();
    }
    
    toggleBackdrop(newState);
}

function closeMobileMenu() {
    if (window.innerWidth <= 768 && DOM.navLinks && DOM.navLinks.classList.contains('mobile-menu-open')) {
        DOM.navLinks.classList.remove('mobile-menu-open');
        if (DOM.mobileMenuToggle) {
            DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
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
// WHATSAPP CONTACT
// ============================================

function initContactButtons() {
    console.log('Initializing WhatsApp contact...');
    
    DOM.contactButtons.forEach((button, index) => {
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.getAttribute('data-clicked') === 'true') return;
            
            this.setAttribute('data-clicked', 'true');
            const originalText = this.textContent;
            this.disabled = true;
            
            let message = APARA_CONFIG.whatsapp.messages.general;
            
            const productSku = this.getAttribute('data-product-sku');
            if (productSku && productSku.includes('300')) {
                message = APARA_CONFIG.whatsapp.messages.product300;
            } else if (productSku && productSku.includes('500')) {
                message = APARA_CONFIG.whatsapp.messages.product500;
            } else if (productSku && productSku.includes('750')) {
                message = APARA_CONFIG.whatsapp.messages.product750;
            }
            
            const service = this.getAttribute('data-service');
            if (service === 'custom-labels') {
                message = APARA_CONFIG.whatsapp.messages.customLabels;
            }
            
            const action = this.getAttribute('data-action');
            if (action === 'get-started') {
                message = APARA_CONFIG.whatsapp.messages.getStarted;
            }
            
            const whatsappURL = `https://wa.me/${APARA_CONFIG.whatsapp.phone}?text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                    window.location.href = whatsappURL;
                } else {
                    window.open(whatsappURL, '_blank');
                }
                
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
    
    console.log('✅ WhatsApp contact initialized');
}

// Global WhatsApp function
window.openWhatsApp = function(messageKey = 'general') {
    const message = APARA_CONFIG.whatsapp.messages[messageKey] || APARA_CONFIG.whatsapp.messages.general;
    const whatsappURL = `https://wa.me/${APARA_CONFIG.whatsapp.phone}?text=${encodeURIComponent(message)}`;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        window.location.href = whatsappURL;
    } else {
        window.open(whatsappURL, '_blank');
    }
};

// ============================================
// SMOOTH SCROLLING
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
        
        closeMobileMenu();
        
        const navHeight = DOM.navbar ? DOM.navbar.offsetHeight : 78;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        
        smoothScrollTo(targetPosition, 400);
        
        if (history.pushState) {
            history.pushState(null, null, href);
        }
        
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

// Global scroll to top function
window.scrollToTop = scrollToTop;

// ============================================
// NAVIGATION SCROLL BEHAVIOR
// ============================================

function initNavOnScroll() {
    if (!DOM.navbar || !DOM.sections.length) return;
    
    const impactSection = document.getElementById('environmental-impact');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll(impactSection);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    handleScroll(impactSection);
    
    console.log('✅ Navigation Scroll Behavior Initialized');
}

function handleScroll(impactSection) {
    if (isScrolling) return;
    
    const currentScrollY = window.pageYOffset;
    
    updateNavbarStyle(impactSection, currentScrollY);
    updateActiveNavLink(currentScrollY);
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
// FAQ ACCORDION
// ============================================

function initFaqAccordion() {
    console.log('Initializing FAQ Accordion...');
    
    setTimeout(() => {
        const faqButtons = document.querySelectorAll('.faq-q');
        
        faqButtons.forEach((button, index) => {
            button.removeEventListener('click', button._faqHandler);
            
            button._faqHandler = function(e) {
                e.preventDefault();
                
                const card = this.closest('.faq-card');
                const arrow = this.querySelector('.faq-arrow');
                const isOpen = card.classList.contains('open');
                
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
            
            button.addEventListener('click', button._faqHandler);
            
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
// TESTIMONIAL SLIDER
// ============================================

function initTestimonialSlider() {
    if (!DOM.testimonials.length || !DOM.prevBtn || !DOM.nextBtn) return;
    
    updateTestimonialDisplay();
    
    DOM.prevBtn.addEventListener('click', showPreviousTestimonial);
    DOM.nextBtn.addEventListener('click', showNextTestimonial);
    
    DOM.prevBtn.addEventListener('keydown', handleTestimonialKeydown);
    DOM.nextBtn.addEventListener('keydown', handleTestimonialKeydown);
    
    initTestimonialTouch();
    startTestimonialAutoplay();
    
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
    DOM.testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        testimonial.setAttribute('aria-hidden', 'true');
        testimonial.removeAttribute('tabindex');
    });
    
    const activeTestimonial = DOM.testimonials[currentTestimonial];
    activeTestimonial.classList.add('active');
    activeTestimonial.setAttribute('aria-hidden', 'false');
    activeTestimonial.setAttribute('tabindex', '0');
    
    updateTestimonialButtons();
}

function updateTestimonialButtons() {
    DOM.prevBtn.disabled = false;
    DOM.nextBtn.disabled = false;
    
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
// COUNTER ANIMATION
// ============================================

function initCounterAnimation() {
    if (!DOM.counters.length) return;
    
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
            let finalText = target.toLocaleString();
            if (hasPlus) finalText += '+';
            if (hasPercent) finalText += '%';
            counter.textContent = finalText;
            return;
        }
        
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
// SCROLL ANIMATIONS
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
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', handleGlobalKeydown);
    
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
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        scrollToTop();
    }
    
    if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
    
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
    preloadCriticalImages();
    initLazyLoading();
    optimizeVideoLoading();
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

function trackEvent(eventName, eventData) {
    console.log('Event Tracked:', eventName, eventData);
    
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

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason?.toString() || 'Unknown'
    });
});

// Back to top enhancement
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        backToTopBtn.removeAttribute('onclick');
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            scrollToTop();
        });
        
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

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initBackToTop, 500);
});

// Backup initialization
window.addEventListener('load', function() {
    setTimeout(() => {
        if (!DOM.contactButtons || DOM.contactButtons.length === 0) {
            const allButtons = document.querySelectorAll('.apara-contact-btn, .request-btn, .cta-button, .apara-bottle-btn');
            allButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const url = `https://wa.me/${APARA_CONFIG.whatsapp.phone}?text=${encodeURIComponent(APARA_CONFIG.whatsapp.messages.general)}`;
                    window.open(url, '_blank');
                });
            });
        }
    }, 2000);
});

console.log('🎉 APARA JavaScript Fully Loaded and Ready!');