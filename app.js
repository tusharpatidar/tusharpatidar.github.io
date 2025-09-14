// Landing Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initProjectFiltering();
    initContactForm();
    initResumeDownload();
    initScrollSpy();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll spy for active navigation links
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.nav__link[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    animateElements.forEach((element, index) => {
        // Add a small delay for staggered animations
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Add animation classes to elements
    document.querySelectorAll('.about__highlight').forEach(el => el.classList.add('fade-in'));
    document.querySelectorAll('.skills__category').forEach(el => el.classList.add('fade-in'));
    document.querySelectorAll('.project__card').forEach(el => el.classList.add('fade-in'));
    document.querySelectorAll('.experience__item').forEach(el => el.classList.add('slide-in-left'));
    document.querySelectorAll('.contact__detail').forEach(el => el.classList.add('fade-in'));
}

// Project filtering functionality
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter__btn');
    const projectCards = document.querySelectorAll('.project__card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('filter__btn--active'));
            button.classList.add('filter__btn--active');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });

    // Initialize all projects as visible
    projectCards.forEach(card => {
        card.classList.add('visible');
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (validateForm(formValues)) {
            // Simulate form submission
            submitForm(formValues);
        }
    });
}

function validateForm(values) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    
    // Remove previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Validate name
    if (!values.name.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!values.email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(values.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!values.subject.trim()) {
        showError('subject', 'Subject is required');
        isValid = false;
    }
    
    // Validate message
    if (!values.message.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (values.message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function submitForm(values) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Log form data (in a real application, this would be sent to a server)
        console.log('Form submitted:', values);
    }, 2000);
}

function showSuccessMessage() {
    // Remove any existing messages
    document.querySelectorAll('.success-message').forEach(msg => msg.remove());
    
    const successDiv = document.createElement('div');
    successDiv.classList.add('success-message');
    successDiv.innerHTML = `
        <strong>Message sent successfully!</strong><br>
        Thank you for your message. I'll get back to you soon.
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Resume download functionality
function initResumeDownload() {
    const resumeButtons = document.querySelectorAll('#download-resume, #download-resume-about');
    
    resumeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a sample resume content (in a real scenario, this would be a PDF file)
            const resumeContent = generateResumeContent();
            downloadFile(resumeContent, 'Tushar_Patidar_Resume.txt', 'text/plain');
            
            // Show download feedback
            showDownloadFeedback(button);
        });
    });
}

function generateResumeContent() {
    return `
TUSHAR PATIDAR
Senior Software Engineer
Email: contact@tusharpatidar.dev
Phone: +91 9876543210
Location: Pune, India
LinkedIn: https://linkedin.com/in/tushar-patidar
GitHub: https://github.com/tusharpatidar

SUMMARY
Passionate Senior Software Engineer with 5+ years of experience in full-stack development. 
Specialized in building scalable web applications using Java, Spring Boot, React.js, and modern cloud technologies. 
Strong expertise in microservices architecture, API design, and agile development practices.

TECHNICAL SKILLS
Programming Languages: Java, JavaScript, Python, TypeScript, C++
Frontend: React.js, HTML5, CSS3, Bootstrap, Material-UI
Backend: Spring Boot, Node.js, Express.js, RESTful APIs
Database: MySQL, PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, Jenkins
Development Tools: Git, Maven, IntelliJ IDEA, VS Code, Postman

WORK EXPERIENCE

Senior Software Engineer | Tech Solutions Pvt Ltd | 2021 - Present
• Led development of microservices architecture reducing system latency by 40%
• Mentored team of 4 junior developers and improved code quality standards
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Developer | Innovation Systems | 2019 - 2021
• Developed and maintained 5+ web applications serving 10,000+ users
• Optimized database queries improving application performance by 30%
• Collaborated with cross-functional teams in agile development environment

FEATURED PROJECTS

E-commerce Platform
• Full-stack web application with microservices architecture
• Technologies: Java, Spring Boot, React.js, MySQL, AWS

Task Management API
• RESTful API with JWT authentication and real-time notifications
• Technologies: Node.js, Express.js, MongoDB, Socket.io

Data Analytics Dashboard
• React-based dashboard with interactive charts and data visualization
• Technologies: React.js, Chart.js, Python, PostgreSQL
`.trim();
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showDownloadFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Downloaded!';
    button.style.background = 'var(--color-success)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 255), 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
    }
});

// Utility function to throttle scroll events
function throttle(func, wait) {
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

// Smooth reveal animation for skill items
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill__item');
    
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize skill animations when skills section is visible
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initSkillAnimations();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

// Add typing effect to hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let index = 0;
    const typeText = () => {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 50);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeText, 1000);
}

// Initialize typing effect when hero section is visible
const heroSection = document.querySelector('#home');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initTypingEffect();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    heroObserver.observe(heroSection);
}

// Add click tracking for analytics (placeholder)
function trackClick(element, action) {
    // In a real application, you would send this data to your analytics service
    console.log(`Tracked click: ${element} - ${action}`);
}

// Add click tracking to important elements
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn--primary')) {
        trackClick('primary-button', e.target.textContent);
    }
    
    if (e.target.classList.contains('project__link')) {
        trackClick('project-link', e.target.textContent);
    }
    
    if (e.target.classList.contains('hero__social-link')) {
        trackClick('social-link', 'hero-social');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Enable keyboard navigation for mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    }
});

// Performance optimization: Lazy load images when they're added
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Add error handling for failed operations
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // In a real application, you might want to report this to an error tracking service
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here in a production app
        console.log('Service worker support detected');
    });
}