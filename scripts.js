// GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);



const setupLenis = () => {
    const wrapper = document.querySelector('.wrapper');
    const content = document.querySelector('.content');

    const lenis = new Lenis({
        infinite: true,
        wrapper: wrapper,
        content: content,
        syncTouch: true,
    });

    const snap = new Snap(lenis, {
        type: 'mandatory',
        debounce: 500,
        duration: 0.9,
        easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value) {
            // setter: ScrollTrigger wants to set scrollTop (for snapping, etc.)
            if (arguments.length) {
                lenis.scrollTo(value, { immediate: true });
            } else {
                // getter: ScrollTrigger wants current scrollTop
                // Lenis versions vary, this is the most compatible pattern:
                return lenis.scroll;
            }
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: wrapper.clientWidth,
                height: wrapper.clientHeight,
            };
        },
    
        // Lenis generally plays nicest with transform pinning
        pinType: 'transform',
    });

    const sections = document.querySelectorAll('section');

    snap.addElements(sections, {
        align: 'start',
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
};

const sectionAnimation = () => {
    const wrapper = document.querySelector('.wrapper');
    
    // Grab all heros
    const heros = document.querySelectorAll('.hero');

    // For every hero, lets do some animation
    heros.forEach((hero) => {
        // Grab the picture element inside each hero
        const image = hero.querySelector('picture');

        // Grab the marquee element inside each hero
        const marquees = hero.querySelectorAll('svg');

        // DRY Animation values
        const ANIMATION = {
            IMAGE: {
                before: -50,
                after: 50,
            },
            MARQUEE: {
                before: 1.5,
                after: 0.5,
            },
        };

        const SHARED_SETTINGS = {
            ease: 'none',
            scrollTrigger: {
                scroller: wrapper,
                trigger: hero,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                fastScrollEnd: true,
            },
        }


        // Image Animation
        // Set initial position
        gsap.set(image, {
            yPercent: ANIMATION.IMAGE.before,
        });
        // Parallax animate on scroll
        gsap.fromTo(
            image,
            {
                yPercent: ANIMATION.IMAGE.before,
            },
            {
                yPercent: ANIMATION.IMAGE.after,
                ...SHARED_SETTINGS,
            }
        );


        marquees.forEach((marquee) => {
            // Marquee Scaling Animation
            // Set initial scale
            gsap.set(marquee, {
                scale: ANIMATION.MARQUEE.before,
            });
            // Scale animate on scroll
            gsap.fromTo(
                marquee,
                {
                    scale: ANIMATION.MARQUEE.before,
                },
                {
                    scale: ANIMATION.MARQUEE.after,
                    ...SHARED_SETTINGS,
                }
            );
        });
    });
};

// When everything is ready in the DOM, run this code.
document.addEventListener('DOMContentLoaded', () => {
    setupLenis();
    sectionAnimation();
});
