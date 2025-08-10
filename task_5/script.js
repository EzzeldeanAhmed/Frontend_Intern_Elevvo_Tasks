// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary, .plan-button, .cta-button-nav');
const navbar = document.querySelector('.navbar');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeIcon = document.querySelector('.theme-icon');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
        localStorage.setItem('theme', this.currentTheme);
        
        // Add visual feedback
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }

    updateThemeIcon() {
        this.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        navToggle.addEventListener('click', () => this.toggleNav());
        
        // Close nav when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeNav());
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeNav();
            }
        });
    }

    toggleNav() {
        this.isOpen = !this.isOpen;
        this.updateNavState();
    }

    closeNav() {
        this.isOpen = false;
        this.updateNavState();
    }

    updateNavState() {
        navToggle.classList.toggle('active', this.isOpen);
        navMenu.classList.toggle('active', this.isOpen);
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (this.isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.observeElements();
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Navbar background on scroll
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'var(--background-primary)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > this.lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScroll = currentScroll;
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and sections
        document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// CTA Button Interactions
class CTAManager {
    constructor() {
        this.init();
    }

    init() {
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCTAClick(e));
            button.addEventListener('mouseenter', (e) => this.handleHover(e));
        });
    }

    handleCTAClick(e) {
        const button = e.target;
        const originalText = button.textContent;
        
        // Ripple effect
        this.createRipple(e);
        
        // Feedback based on button type
        if (button.textContent.includes('Free Trial') || button.textContent.includes('Start')) {
            button.textContent = 'Redirecting...';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                this.showModal('Free Trial', 'Thanks for your interest! In a real application, this would redirect to a signup form.');
                button.textContent = originalText;
                button.style.background = '';
            }, 1500);
        
        } else if (button.textContent.includes('Contact') || button.textContent.includes('Sales')) {
            this.showModal('Contact Sales', 'Our sales team would love to hear from you! In a real app, this would open a contact form.');
        }
    }

    handleHover(e) {
        const button = e.target;
        if (button.classList.contains('cta-primary')) {
            button.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
        }
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        }, { once: true });
    }

    createRipple(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showModal(title, message) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--background-primary);
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        modal.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.25rem;">${title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${message}</p>
            <button id="closeModal" style="
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">Got it!</button>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
        
        // Close modal
        const closeModal = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };
        
        modal.querySelector('#closeModal').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Performance Metrics:');
                console.log(`📊 Page Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                console.log(`🎨 DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`);
                console.log(`⚡ Time to Interactive: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }, 0);
        });
    }
}

// Add CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Mobile navigation styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background: var(--background-primary);
        border-top: 1px solid var(--border-color);
        padding: 2rem 1rem;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
    }
    
    .nav-menu.active {
        transform: translateX(0);
    }
    
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .nav-link {
        font-size: 1.1rem;
        padding: 0.5rem 0;
        width: 100%;
        border-bottom: 1px solid var(--border-light);
    }
    
    .theme-toggle,
    .cta-button-nav {
        margin-top: 1rem;
    }
}
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Easter Egg - Konami Code
class EasterEgg {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.length === this.konamiCode.length &&
                this.userInput.every((key, index) => key === this.konamiCode[index])) {
                this.activateEasterEgg();
            }
        });
    }

    activateEasterEgg() {
        // Add fun animation to the logo
        const logo = document.querySelector('.logo-icon');
        logo.style.animation = 'spin 2s linear infinite';
        
        // Add CSS for spin animation
        const spinCSS = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = spinCSS;
        document.head.appendChild(style);
        
        // Show easter egg message
        const ctaManager = new CTAManager();
        ctaManager.showModal('🎉 Easter Egg Found!', 'Congratulations! You found the secret Konami code. You are a true developer! 🚀');
        
        // Stop animation after 5 seconds
        setTimeout(() => {
            logo.style.animation = '';
        }, 5000);
    }
}

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 CloudSync Pro Landing Page Loaded!');
    console.log('💡 Try the Konami code for a surprise: ↑↑↓↓←→←→BA');
    
    // Initialize all functionality
    new ThemeManager();
    new MobileNavigation();
    new ScrollEffects();
    new CTAManager();
    new SmoothScroll();
    new PerformanceMonitor();
    new EasterEgg();
    
    // Add loading completion visual feedback
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👀 Page is now visible - Welcome back!');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        MobileNavigation,
        ScrollEffects,
        CTAManager,
        SmoothScroll
    };
}
