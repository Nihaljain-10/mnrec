document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            mobileToggle.innerHTML = isActive ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    }

    // 2. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navMenu) {
                navMenu.classList.remove('active'); // Close mobile menu if open
            }
            if (mobileToggle) {
                mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // 5. Animated Counter
    const counter = document.querySelector('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
            hasCounted = true;
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000; // ms
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;

            const countTo = () => {
                frame++;
                const progress = frame / totalFrames;
                // Easing out function
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                const currentCount = (target * easeOutProgress).toFixed(2);
                
                counter.innerText = currentCount;

                if (frame < totalFrames) {
                    requestAnimationFrame(countTo);
                } else {
                    counter.innerText = target.toFixed(2);
                }
            };
            countTo();
        }
    }, { threshold: 0.5 });

    if (counter) {
        counterObserver.observe(counter);
    }

    // 6. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentImages = [];
    let currentImageIndex = 0;
    let autoSlideInterval = null;

    const updateLightboxImage = () => {
        if (currentImages.length > 0) {
            lightboxImg.style.opacity = '0.7';
            setTimeout(() => {
                lightboxImg.src = currentImages[currentImageIndex];
                lightboxImg.style.opacity = '1';
            }, 200);
        }
    };

    const startAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        if (currentImages.length > 1) {
            autoSlideInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                updateLightboxImage();
            }, 2500); // Change every 2.5 seconds
        }
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    if (lightbox) {
        lightboxImg.style.transition = 'opacity 0.2s ease-in-out';

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('h4');
                const dataImages = item.getAttribute('data-images');
                
                if (dataImages) {
                    currentImages = dataImages.split(',');
                } else if (img) {
                    currentImages = [img.src];
                } else {
                    currentImages = [];
                }
                
                currentImageIndex = 0;
                
                if (currentImages.length > 0) {
                    updateLightboxImage();
                    startAutoSlide();
                    
                    lightboxCaption.innerText = caption ? caption.innerText : '';
                    lightbox.style.display = 'flex';
                    setTimeout(() => lightbox.classList.add('show'), 10);
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        const closeLightbox = () => {
            stopAutoSlide();
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg && !e.target.closest('.lightbox-close')) {
                closeLightbox();
            }
        });
    }

    // 7. Hero Background Slideshow
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        const slides = heroBg.querySelectorAll('.slide');
        let currentSlide = 0;
        let slideInterval;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            resetTimer();
        };

        const resetTimer = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds
        };

        // Click anywhere in home section to go to next image
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.addEventListener('click', (e) => {
                // Ignore clicks on buttons or links
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    nextSlide();
                }
            });
        }

        // Start timer
        resetTimer();
    }

    // 8. Project Slideshow Logic
    const projectSlides = document.querySelectorAll('.project-slide');
    const projectSlideshow = document.getElementById('project-slideshow');
    
    if (projectSlideshow && projectSlides.length > 0) {
        let currentProjectSlide = 0;
        let projectSlideInterval;

        const showProjectSlide = (index) => {
            projectSlides[currentProjectSlide].classList.remove('active');
            
            currentProjectSlide = index;
            
            projectSlides[currentProjectSlide].classList.add('active');
            resetProjectTimer();
        };

        const nextProjectSlide = () => {
            let next = (currentProjectSlide + 1) % projectSlides.length;
            showProjectSlide(next);
        };

        const resetProjectTimer = () => {
            clearInterval(projectSlideInterval);
            projectSlideInterval = setInterval(nextProjectSlide, 5000); // 5 seconds
        };

        // Click to next
        projectSlideshow.addEventListener('click', nextProjectSlide);

        // Start timer
        resetProjectTimer();
    }
});
