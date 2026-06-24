/**
 * THE HOOVER HANDYMAN - INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. STICKY HEADER & SCROLL EFFECTS
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at load time in case page was refreshed

    /* ==========================================================================
       2. MOBILE HAMBURGER NAVIGATION
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        
        // Disable scroll when mobile menu is open
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when a navigation link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    /* ==========================================================================
       3. SMOOTH SCROLLING FOR NAVIGATION LINKS
       ========================================================================== */
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Subtract header height for correct offset positioning
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       4. ACTIVE SECTION LINK HIGHLIGHT & SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    // Intersection Observer for highlighting active nav menu links
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger highlight when section occupies middle screen
        threshold: 0
    };
    
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
    sections.forEach(section => navObserver.observe(section));

    // Intersection Observer for Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px', // Reveal slightly before the element enters the viewport
        threshold: 0.1
    };
    
    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       6. TESTIMONIALS SLIDER
       ========================================================================== */
    const slider = document.getElementById('reviews-slider');
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // Auto-rotate reviews every 6 seconds
    
    const goToSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slider.style.transform = `translateX(-${index * 100}%)`;
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };
    
    const nextSlide = () => {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        goToSlide(next);
    };
    
    const startSlideShow = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    };
    
    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };
    
    // Dot click triggers
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
            startSlideShow(); // Reset interval timer on manual click
        });
    });
    
    // Pause slider on hover
    const sliderContainer = document.querySelector('.reviews-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideShow);
        sliderContainer.addEventListener('mouseleave', startSlideShow);
    }
    
    // Initialize testimonial slide-show
    if (slides.length > 0) {
        startSlideShow();
    }

    /* ==========================================================================
       7. CONTACT FORM VALIDATION & SUBMISSION MOCKUP
       ========================================================================== */
    const form = document.getElementById('estimate-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');
    
    // Form Inputs
    const inputName = document.getElementById('form-name');
    const inputPhone = document.getElementById('form-phone');
    const inputEmail = document.getElementById('form-email');
    const inputService = document.getElementById('form-service');
    const inputMessage = document.getElementById('form-message');
    
    // Validation helper functions
    const setError = (element, messageElementId) => {
        element.parentElement.classList.add('error');
    };
    
    const clearError = (element) => {
        element.parentElement.classList.remove('error');
    };
    
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    
    const isValidPhone = (phone) => {
        // Basic phone digits count check (accepts spaces, dashes, parentheses)
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 7;
    };
    
    const validateForm = () => {
        let isValid = true;
        
        // Name validation
        if (inputName.value.trim() === '') {
            setError(inputName);
            isValid = false;
        } else {
            clearError(inputName);
        }
        
        // Phone validation
        if (inputPhone.value.trim() === '' || !isValidPhone(inputPhone.value)) {
            setError(inputPhone);
            isValid = false;
        } else {
            clearError(inputPhone);
        }
        
        // Email validation
        if (inputEmail.value.trim() === '' || !isValidEmail(inputEmail.value)) {
            setError(inputEmail);
            isValid = false;
        } else {
            clearError(inputEmail);
        }
        
        // Service validation
        if (inputService.value === '') {
            setError(inputService);
            isValid = false;
        } else {
            clearError(inputService);
        }
        
        // Message validation
        if (inputMessage.value.trim() === '') {
            setError(inputMessage);
            isValid = false;
        } else {
            clearError(inputMessage);
        }
        
        return isValid;
    };
    
    // Listeners for live error clearing on input
    [inputName, inputMessage].forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                clearError(input);
            }
        });
    });
    
    inputPhone.addEventListener('input', () => {
        if (isValidPhone(inputPhone.value)) {
            clearError(inputPhone);
        }
    });
    
    inputEmail.addEventListener('input', () => {
        if (isValidEmail(inputEmail.value)) {
            clearError(inputEmail);
        }
    });
    
    inputService.addEventListener('change', () => {
        if (inputService.value !== '') {
            clearError(inputService);
        }
    });
    
    // Form Submission Handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading spinner on button
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            const name = inputName.value.trim();
            const phone = inputPhone.value.trim();
            const email = inputEmail.value.trim();
            const serviceText = inputService.options[inputService.selectedIndex].text;
            const message = inputMessage.value.trim();
            
            const whatsappBaseNumber = "12056901224";
            const textMessage = `Hello The Hoover Handyman, I would like to request a free estimate:\n\n` +
                                `• Name: ${name}\n` +
                                `• Phone: ${phone}\n` +
                                `• Email: ${email}\n` +
                                `• Service Needed: ${serviceText}\n` +
                                `• Description: ${message}`;
            
            const whatsappUrl = `https://wa.me/${whatsappBaseNumber}?text=${encodeURIComponent(textMessage)}`;
            
            // Delay slightly for premium feel and then redirect
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Redirect to WhatsApp chat
                window.location.href = whatsappUrl;
            }, 1000);
        }
    });
    
    // Reset Form trigger
    resetFormBtn.addEventListener('click', () => {
        form.reset();
        formSuccess.style.display = 'none';
        form.style.display = 'block';
    });
});
