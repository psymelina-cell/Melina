// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// FAQ accordion functionality
document.querySelectorAll('.faq-btn').forEach(button => {
    button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('i');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-content').forEach(item => {
            if (item !== content) {
                item.classList.add('hidden');
                item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
        
        // Toggle current FAQ item
        content.classList.toggle('hidden');
        
        // Rotate icon
        if (content.classList.contains('hidden')) {
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.style.transform = 'rotate(180deg)';
        }
    });
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Create mailto link
    const subject = encodeURIComponent('Demande de rendez-vous - ' + name);
    const body = encodeURIComponent(
        `Nom: ${name}\n` +
        `Email: ${email}\n` +
        `Téléphone: ${phone || 'Non renseigné'}\n\n` +
        `Message:\n${message}`
    );
    
    const mailtoLink = `mailto:contact@psy-romans.fr?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Votre demande va être envoyée par email. Merci !');
    
    // Reset form
    this.reset();
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/98');
        navbar.classList.remove('bg-white/95');
    } else {
        navbar.classList.add('bg-white/95');
        navbar.classList.remove('bg-white/98');
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('accueil');
    const rate = scrolled * -0.5;
    
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects for service cards
document.querySelectorAll('.hover-lift').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load (optional)
// window.addEventListener('load', function() {
//     const heroTitle = document.querySelector('#accueil h1');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 50);
//     }
// });

// Add click tracking for analytics (placeholder)
document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track contact interactions
        console.log('Contact interaction:', this.href);
        // Here you could add Google Analytics or other tracking
    });
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Reviews carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const reviewsSlider = document.getElementById('reviews-slider');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const indicators = document.querySelectorAll('#review-indicators > div');
    
    if (!reviewsSlider) return;
    
    let currentIndex = 0;
    const totalReviews = 9;
    let itemsPerView = getItemsPerView();
    const maxIndex = Math.ceil(totalReviews / itemsPerView) - 1;
    
    function getItemsPerView() {
        if (window.innerWidth >= 1024) return 3; // lg: 3 items
        if (window.innerWidth >= 768) return 2;  // md: 2 items
        return 1; // mobile: 1 item
    }
    
    function updateSlider() {
        const translateX = -(currentIndex * (100 / itemsPerView));
        reviewsSlider.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('bg-primary');
                indicator.classList.remove('bg-gray-300');
            } else {
                indicator.classList.add('bg-gray-300');
                indicator.classList.remove('bg-primary');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play (optional)
    setInterval(nextSlide, 5000);
    
    // Handle resize
    window.addEventListener('resize', function() {
        itemsPerView = getItemsPerView();
        currentIndex = 0; // Reset to first slide on resize
        updateSlider();
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    reviewsSlider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    reviewsSlider.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
});

// Appointment Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const appointmentModal = document.getElementById('appointment-modal');
    const appointmentSelection = document.getElementById('appointment-selection');
    const calendarContainer = document.getElementById('calendar-container');
    const calEmbed = document.getElementById('cal-embed');
    const closeModal = document.getElementById('close-modal');
    const backToSelection = document.getElementById('back-to-selection');
    
    // Ouvrir le modal au clic sur "Prendre RDV" (navigation)
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        // Vérifier si le lien contient "Prendre" dans le texte
        if (link.textContent.includes('Prendre')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openAppointmentModal();
            });
        }
    });
    
    // Gestion des boutons de rendez-vous dans les tarifs (calendriers Cal.com directs)
    document.querySelectorAll('a[href*="cal.com"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const calUrl = this.getAttribute('href');
            const calUser = calUrl.replace('https://cal.com/', '');
            openCalendarModal(calUser);
        });
    });
    
    // Configuration des calendriers Cal.com
    const calConfigs = {
        'adulte': 'melina-psy-cohahc/rdv-adulte-individuel-18-ans',
        'ado': 'melina-psy-cohahc/rdv-adolescent-individuel',
        'couple': 'melina-psy-cohahc/rdv-therapie-couple', 
        'visio': 'melina-psy-cohahc/rdv-visio'
    };
    
    function openAppointmentModal() {
        appointmentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        showAppointmentSelection();
    }
    
    function openCalendarModal(calUser) {
        appointmentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        appointmentSelection.classList.add('hidden');
        calendarContainer.classList.remove('hidden');
        loadCalcomEmbed(calUser);
    }
    
    function closeAppointmentModal() {
        appointmentModal.classList.add('hidden');
        document.body.style.overflow = '';
        // Nettoyer le calendrier
        calEmbed.innerHTML = '';
    }
    
    function showAppointmentSelection() {
        appointmentSelection.classList.remove('hidden');
        calendarContainer.classList.add('hidden');
    }
    
    function showCalendar(appointmentType) {
        appointmentSelection.classList.add('hidden');
        calendarContainer.classList.remove('hidden');
        
        // Charger le calendrier Cal.com
        loadCalcomEmbed(calConfigs[appointmentType]);
    }
    
    function loadCalcomEmbed(calUser) {
        // Nettoyer le container précédent
        calEmbed.innerHTML = '';
        
        // Créer l'embed Cal.com avec iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://cal.com/${calUser}?embed=true`;
        iframe.width = '100%';
        iframe.height = '600px';
        iframe.frameBorder = '0';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        
        calEmbed.appendChild(iframe);
    }
    
    // Event listeners
    closeModal.addEventListener('click', closeAppointmentModal);
    backToSelection.addEventListener('click', showAppointmentSelection);
    
    // Fermer le modal en cliquant à l'extérieur
    appointmentModal.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !appointmentModal.classList.contains('hidden')) {
            closeAppointmentModal();
        }
    });
    
    // Gestion des boutons de type de rendez-vous
    document.querySelectorAll('.appointment-type').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentType = this.dataset.type;
            showCalendar(appointmentType);
        });
    });
});

// Video Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const videoModal = document.getElementById('video-modal');
    const playVideoBtn = document.getElementById('play-video-btn');
    const closeVideoModal = document.getElementById('close-video-modal');
    const youtubeIframe = document.getElementById('youtube-iframe');
    const videoId = 'AU7iFHLDZjg'; // ID de la vidéo YouTube
    
    function openVideoModal() {
        videoModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Charger la vidéo avec autoplay
        youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    function closeVideoModalFunc() {
        videoModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Arrêter la vidéo en vidant le src
        youtubeIframe.src = '';
    }
    
    // Event listeners
    if (playVideoBtn) {
        playVideoBtn.addEventListener('click', openVideoModal);
    }
    
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', closeVideoModalFunc);
    }
    
    // Fermer en cliquant à l'extérieur
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModalFunc();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeVideoModalFunc();
        }
    });
});

// APP Video Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const appVideoModal = document.getElementById('app-video-modal');
    const playAppVideoBtn = document.getElementById('play-app-video-btn');
    const closeAppVideoModal = document.getElementById('close-app-video-modal');
    const appYoutubeIframe = document.getElementById('app-youtube-iframe');
    const appVideoId = 'KE5woKG04LM'; // ID de la vidéo APP YouTube
    
    function openAppVideoModal() {
        appVideoModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Charger la vidéo avec autoplay
        appYoutubeIframe.src = `https://www.youtube.com/embed/${appVideoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    function closeAppVideoModalFunc() {
        appVideoModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Arrêter la vidéo en vidant le src
        appYoutubeIframe.src = '';
    }
    
    // Event listeners
    if (playAppVideoBtn) {
        playAppVideoBtn.addEventListener('click', openAppVideoModal);
    }
    
    if (closeAppVideoModal) {
        closeAppVideoModal.addEventListener('click', closeAppVideoModalFunc);
    }
    
    // Fermer en cliquant à l'extérieur
    appVideoModal.addEventListener('click', function(e) {
        if (e.target === appVideoModal) {
            closeAppVideoModalFunc();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !appVideoModal.classList.contains('hidden')) {
            closeAppVideoModalFunc();
        }
    });
});

