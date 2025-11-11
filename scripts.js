document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================
    // === LÓGICA DE CARRUSEL LIGHTBOX (NUEVA IMPLEMENTACIÓN) ===
    // =========================================================
    let currentGallery = [];
    let currentImageIndex = 0;

    function showImage(index) {
        const lightboxImg = document.getElementById('lightbox-img');
        const totalImages = currentGallery.length;
        
        // Ciclar las imágenes
        if (index >= totalImages) {
            currentImageIndex = 0;
        } else if (index < 0) {
            currentImageIndex = totalImages - 1;
        } else {
            currentImageIndex = index;
        }

        if (lightboxImg && currentGallery.length > 0) {
            // Carga la nueva imagen
            lightboxImg.src = currentGallery[currentImageIndex];
        }
    }

    // === LÓGICA PARA ABRIR LA GALERÍA AL HACER CLIC ===
    // Aplicamos el listener a todos los elementos que queramos que abran el lightbox
    document.querySelectorAll('.personalizadas-item, .portafolio-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Evitamos que se abra si hay un botón de compra/enlace dentro
            if (e.target.closest('.btn-comprar') || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return; 
            }
            
            const galleryString = this.getAttribute('data-gallery');
            const firstImageSrc = this.querySelector('img').src;
            const lightbox = document.getElementById('lightbox');

            if (lightbox) {
                // 1. Cargar la galería
                if (galleryString) {
                    // Si existe data-gallery, lo usamos
                    currentGallery = galleryString.split(',').map(s => s.trim());
                } else {
                    // Si no existe, es una sola imagen (comportamiento antiguo)
                    currentGallery = [firstImageSrc];
                }

                // 2. Establecer el índice inicial y mostrar el lightbox
                currentImageIndex = 0;
                showImage(currentImageIndex);
                
                lightbox.style.display = "flex";

                // 3. Mostrar/Ocultar botones de navegación
                const hasMultipleImages = currentGallery.length > 1;
                document.getElementById('lightbox-prev').style.display = hasMultipleImages ? 'block' : 'none';
                document.getElementById('lightbox-next').style.display = hasMultipleImages ? 'block' : 'none';
            }
        });
    });

    // === MANEJO DE BOTONES SIGUIENTE/ANTERIOR ===
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation(); 
            showImage(currentImageIndex - 1);
        });

        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation(); 
            showImage(currentImageIndex + 1);
        });
    }

    // =========================================================
    // === RESTO DE LA LÓGICA (Scroll, Menú, Lightbox Close) ===
    // =========================================================

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
