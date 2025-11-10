document.addEventListener('DOMContentLoaded', function() {
    
    
    
    // Scroll suave para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto de aparición en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.valor-item, .portafolio-item').forEach(el => {
        observer.observe(el);
    });

    // Animación CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Lightbox para mostrar imagen en grande al hacer clic
    document.querySelectorAll('.solucion-img').forEach(function(img) {
        img.addEventListener('click', function() {
            var src = this.getAttribute('data-img');
            var lightbox = document.getElementById('lightbox');
            var lightboxImg = document.getElementById('lightbox-img');
            if (lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.style.display = "flex";
            }
        });
    });

    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            console.log("CIERRA LIGHTBOX");
            document.getElementById('lightbox').style.display = "none";
        });
    }

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if(e.target === this) {
                this.style.display = "none";
            }
        });
    }

    // Lightbox para Portafolio
    document.querySelectorAll('.portafolio-img').forEach(function(img) {
        img.addEventListener('click', function() {
            var src = this.getAttribute('data-img');
            var lightbox = document.getElementById('lightbox');
            var lightboxImg = document.getElementById('lightbox-img');
            if (lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.style.display = "flex";
            }
        });
    });

    // Lightbox para Soluciones Personalizadas
    document.querySelectorAll('.personalizadas-img').forEach(function(img) {
        img.addEventListener('click', function() {
            var src = this.getAttribute('data-img');
            var lightbox = document.getElementById('lightbox');
            var lightboxImg = document.getElementById('lightbox-img');
            if (lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.style.display = "flex";
            }
        });
    });

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');

    // Validar que los elementos existan
    if (hamburger && menu) {
        // Toggle menú
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    } else {
        console.error('Error: No se encontraron los elementos hamburger o menu');
    }

});

