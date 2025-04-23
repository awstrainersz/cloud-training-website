/**
 * CloudMasters Website JavaScript
 * Handles mobile menu, testimonial slider, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Testimonial slider
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Solutions Architect, TechCorp",
            image: "images/avatar-1.jpg",
            text: "The AWS training from CloudMasters was exceptional. The hands-on labs and real-world examples helped me pass my certification exam on the first try. The instructors were knowledgeable and always available to answer questions. Highly recommended!",
            course: "AWS Certified Solutions Architect",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "CTO, InnovateTech",
            image: "images/avatar-2.jpg",
            text: "CloudMasters helped our team migrate our entire infrastructure to Azure with minimal downtime. Their expertise and guidance were invaluable throughout the process. The training they provided to our team was comprehensive and practical.",
            course: "Azure Cloud Migration Workshop",
            rating: 5
        },
        {
            name: "Jennifer Williams",
            role: "Cloud Operations Manager, DataFlow Inc.",
            image: "images/avatar-3.jpg",
            text: "The FinOps consulting services provided by CloudMasters helped us reduce our cloud costs by 35% without sacrificing performance. Their team identified optimization opportunities we hadn't considered and provided a clear implementation roadmap.",
            course: "FinOps Professional Certification",
            rating: 4
        },
        {
            name: "David Rodriguez",
            role: "Senior Developer, CloudNative Solutions",
            image: "images/avatar-4.jpg",
            text: "I took the Google Cloud Professional Architect course and was impressed by the depth of knowledge the instructors provided. The course materials were comprehensive and up-to-date. The hands-on labs were particularly valuable for reinforcing concepts.",
            course: "Google Cloud Professional Architect",
            rating: 5
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const prevButton = document.querySelector('.testimonial-nav.prev');
    const nextButton = document.querySelector('.testimonial-nav.next');
    
    // Initialize testimonial slider if it exists
    if (testimonialSlider) {
        // Create testimonial card HTML
        function createTestimonialCard(testimonial) {
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < testimonial.rating) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }
            
            return `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="testimonial-avatar">
                            <img src="${testimonial.image}" alt="${testimonial.name}">
                        </div>
                        <div class="testimonial-meta">
                            <div class="testimonial-author">${testimonial.name}</div>
                            <div class="testimonial-role">${testimonial.role}</div>
                            <div class="testimonial-rating">
                                ${starsHTML}
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-text">
                        "${testimonial.text}"
                    </div>
                    <div class="testimonial-course">
                        <span>Course: ${testimonial.course}</span>
                    </div>
                </div>
            `;
        }
        
        // Display initial testimonial
        testimonialSlider.innerHTML = createTestimonialCard(testimonials[currentTestimonial]);
        
        // Update active dot
        function updateDots() {
            testimonialDots.forEach((dot, index) => {
                if (index === currentTestimonial) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Navigate to specific testimonial
        function goToTestimonial(index) {
            currentTestimonial = index;
            
            // Create new testimonial card with fade effect
            const newCard = document.createElement('div');
            newCard.innerHTML = createTestimonialCard(testimonials[currentTestimonial]);
            newCard.classList.add('testimonial-card', 'fade-in');
            
            // Replace current card
            testimonialSlider.innerHTML = '';
            testimonialSlider.appendChild(newCard);
            
            // Update dots
            updateDots();
        }
        
        // Event listeners for navigation
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                goToTestimonial(currentTestimonial);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                goToTestimonial(currentTestimonial);
            });
        }
        
        // Add click events to dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            goToTestimonial(currentTestimonial);
        }, 8000); // Change testimonial every 8 seconds
    }
    
    // Countdown timer
    const countdownElements = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };
    
    if (countdownElements.days && countdownElements.hours && countdownElements.minutes && countdownElements.seconds) {
        // Set the target date (next batch start date)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 21); // 21 days from now
        
        function updateCountdown() {
            const currentDate = new Date();
            const difference = targetDate - currentDate;
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                countdownElements.days.textContent = days.toString().padStart(2, '0');
                countdownElements.hours.textContent = hours.toString().padStart(2, '0');
                countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
                countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
            } else {
                // If the target date has passed
                countdownElements.days.textContent = '00';
                countdownElements.hours.textContent = '00';
                countdownElements.minutes.textContent = '00';
                countdownElements.seconds.textContent = '00';
            }
        }
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .feature, .course-card, .about-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Add animation class to CSS
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .feature, .course-card, .about-image {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.animate, .feature.animate, .course-card.animate, .about-image.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .testimonial-card {
            transition: opacity 0.5s ease;
        }
        
        .fade-out {
            opacity: 0;
        }
        
        .fade-in {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Form validation for contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
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
                    valid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (valid) {
                // Show success message (in a real app, you would submit the form)
                const formMessage = document.createElement('div');
                formMessage.classList.add('form-message', 'success');
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                
                contactForm.appendChild(formMessage);
                contactForm.reset();
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    formMessage.remove();
                }, 5000);
            } else {
                // Show error message
                const formMessage = document.createElement('div');
                formMessage.classList.add('form-message', 'error');
                formMessage.textContent = 'Please fill in all required fields correctly.';
                
                contactForm.appendChild(formMessage);
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    formMessage.remove();
                }, 5000);
            }
        });
    }
});
