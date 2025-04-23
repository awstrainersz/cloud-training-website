// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn') && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Sticky header on scroll
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Simple testimonial slider
    const testimonials = [
        {
            text: "The AWS training from CloudMasters was exceptional. The hands-on labs and real-world examples helped me pass my certification exam on the first try. Highly recommended!",
            author: "Sarah Johnson",
            role: "Solutions Architect, TechCorp"
        },
        {
            text: "CloudMasters helped our company reduce cloud costs by 40% through their FinOps consulting services. Their expertise in AWS cost optimization is unmatched.",
            author: "Michael Chen",
            role: "CTO, InnovateTech"
        },
        {
            text: "The DevOps training program was comprehensive and practical. I was able to implement CI/CD pipelines at my company immediately after completing the course.",
            author: "David Rodriguez",
            role: "DevOps Engineer, CloudSys"
        },
        {
            text: "Our team's Azure skills improved dramatically after CloudMasters' corporate training program. The customized curriculum addressed our specific needs perfectly.",
            author: "Emily Watson",
            role: "IT Director, GlobalFinance"
        }
    ];
    
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentTestimonial = 0;
        
        // Initial load
        renderTestimonial();
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            renderTestimonial();
        }, 5000);
        
        function renderTestimonial() {
            const testimonial = testimonials[currentTestimonial];
            testimonialSlider.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-text">
                        "${testimonial.text}"
                    </div>
                    <div class="testimonial-author">${testimonial.author}</div>
                    <div class="testimonial-role">${testimonial.role}</div>
                </div>
            `;
        }
    }
    
    // Form validation for contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                // For this demo, we'll just show a success message
                const formContainer = contactForm.parentElement;
                formContainer.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you for your message!</h3>
                        <p>We'll get back to you as soon as possible.</p>
                    </div>
                `;
            }
        });
    }
    
    // Course filter functionality (for training page)
    const courseFilters = document.querySelectorAll('.course-filter button');
    if (courseFilters.length > 0) {
        courseFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                courseFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                const courseCards = document.querySelectorAll('.course-card');
                
                courseCards.forEach(card => {
                    if (category === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // FAQ accordion (for training page)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Close other open FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        });
    }
    
    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in viewport
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('animated');
            }
        });
    }
    
    // Run on page load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);
});
