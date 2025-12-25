document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // === 1. LÓGICA BARRA DE NAVEGACIÓN ===
    // ==========================================
    let ubicacionPrincipal = window.pageYOffset;
    const header = document.querySelector("header");
    
    // VARIABLE NUEVA: Detecta si estamos moviéndonos por clic en el menú
    let isAutoScrolling = false; 

    window.addEventListener('scroll', function() {
        // SI estamos navegando automáticamente (clic en menú), NO hacemos nada (la barra se queda quieta)
        if (isAutoScrolling) return;

        let desplazamientoActual = window.pageYOffset;

        if (!header) return;

        // Si estamos muy arriba, siempre mostrar
        if (desplazamientoActual <= 0) {
            header.style.top = "0";
            return;
        }

        if (ubicacionPrincipal > desplazamientoActual) {
            // SUBIENDO: Mostrar
            header.style.top = "0";
        } else {
            // BAJANDO: Ocultar
            header.style.top = "-200px";
        }   
        
        ubicacionPrincipal = desplazamientoActual;
    });

    // ==========================================
    // === 2. CLIC EN ENLACES (CORRECCIÓN) ===
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // 1. ACTIVAMOS LA BANDERA: "Estamos navegando, no escondas la barra"
                isAutoScrolling = true;
                
                // 2. FORZAMOS QUE LA BARRA SE MUESTRE (por si estaba oculta)
                if (header) header.style.top = "0";

                // 3. HACEMOS EL SCROLL
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 4. QUITAMOS LA BANDERA DESPUÉS DE 1 SEGUNDO (cuando termina de bajar)
                setTimeout(() => {
                    isAutoScrolling = false;
                    // Actualizamos la ubicación para que no salte al volver a mover el mouse
                    ubicacionPrincipal = window.pageYOffset; 
                }, 1000); 
            }
            
            // Cerrar menú móvil si está abierto
            const hamburger = document.querySelector('.hamburger');
            const menu = document.querySelector('.menu');
            if (hamburger && menu && menu.classList.contains('active')) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });

    // =========================================================
    // === 3. LÓGICA DE CARRUSEL LIGHTBOX ===
    // =========================================================
    
    let currentGallery = [];
    let currentImageIndex = 0;
    const lightboxImg = document.getElementById('lightbox-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    function showImage(index) {
        if (!lightboxImg) return;
        const totalImages = currentGallery.length;
        
        if (index >= totalImages) {
            currentImageIndex = 0;
        } else if (index < 0) {
            currentImageIndex = totalImages - 1;
        } else {
            currentImageIndex = index;
        }

        if (currentGallery.length > 0) {
            lightboxImg.src = currentGallery[currentImageIndex];
        }
    }

    document.querySelectorAll('.personalizadas-item, .portafolio-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.btn-comprar') || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return; 
            }
            
            const galleryString = this.getAttribute('data-gallery');
            const imgElement = this.querySelector('img');
            const firstImageSrc = imgElement ? imgElement.src : '';
            
            if (lightbox) {
                if (galleryString) {
                    currentGallery = galleryString.split(',').map(s => s.trim());
                } else if (firstImageSrc) {
                    currentGallery = [firstImageSrc];
                } else {
                    return;
                }

                currentImageIndex = 0;
                showImage(currentImageIndex);
                lightbox.style.display = "flex";

                const hasMultiple = currentGallery.length > 1;
                if (lightboxPrev) lightboxPrev.style.display = hasMultiple ? 'block' : 'none';
                if (lightboxNext) lightboxNext.style.display = hasMultiple ? 'block' : 'none';
            }
        });
    });

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentImageIndex - 1); });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentImageIndex + 1); });
    }

    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => { if (lightbox) lightbox.style.display = "none"; });
    }
    if (lightbox) {
        lightbox.addEventListener('click', function(e) { if(e.target === this) this.style.display = "none"; });
    }

    // ==========================================
    // === 4. MENU HAMBURGUESA (MÓVIL) ===
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // ==========================================
    // === 5. ANIMACIONES FADE IN ===
    // ==========================================
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

    document.querySelectorAll('.valor-item, .portafolio-item, .personalizadas-item').forEach(el => {
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});