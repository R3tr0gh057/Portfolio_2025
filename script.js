document.addEventListener('DOMContentLoaded', () => {

    /**
     * Fades and slides an element into view using a requestAnimationFrame loop.
     * @param {HTMLElement} element The element to animate.
     */
    const animateFadeInUp = (element) => {
        let start = null;
        const duration = 1000; // Animation duration in milliseconds

        // Set initial styles for the animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3); // easeOutCubic

            // Update style based on eased progress
            element.style.opacity = ease;
            element.style.transform = `translateY(${20 * (1 - ease)}px)`;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final state is clean
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Intersection Observer for Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateFadeInUp(entry.target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements designated for animation
    document.querySelectorAll('.animated-section, .animated-element').forEach(el => {
        observer.observe(el);
    });

    /**
     * Smoothly scrolls the page to a target vertical position.
     * @param {number} targetY The target window.pageYOffset.
     * @param {number} duration The duration of the scroll animation.
     */
    const smoothScrollTo = (targetY, duration) => {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            // Ease-in-out quint function for a pleasant scroll effect
            let t = progress / duration;
            let easedTime = t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;

            window.scrollTo(0, startY + distance * easedTime);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Event Listeners for Navigation Links ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                smoothScrollTo(targetPosition, 800); // 800ms scroll duration
            }
        });
    });
});