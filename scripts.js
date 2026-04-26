// GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);



const setupLenis = () => {
    const wrapper = document.querySelector('.wrapper');
    const content = document.querySelector('.content');

    const lenis = new Lenis({
        infinite: true,
        wrapper: wrapper,
        content: content,
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
        const marquee = hero.querySelector('svg');

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
};



function initRadialTextMarquee() {
    const wraps = document.querySelectorAll('[data-radial-text-marquee-init]');
    if (!wraps.length) return;

    const ns = 'http://www.w3.org/2000/svg';
    const xns = 'http://www.w3.org/1999/xlink';
    const prm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime = performance.now();
    const isSafari = (() => {
        const ua = navigator.userAgent;
        return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
    })();

    const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || 0));

    const speedMul = () => {
        const w = window.innerWidth || 2000;
        const t = clamp((w - 250) / (2000 - 250), 0, 1);
        return 0.5 + t * (1 - 0.5);
    };

    const lsToPx = (ls, fs) => {
        if (!ls || ls === 'normal') return 0;
        if (ls.endsWith('px')) return parseFloat(ls) || 0;
        if (ls.endsWith('em')) return (parseFloat(ls) || 0) * fs;
        if (ls.endsWith('rem')) {
            const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            return (parseFloat(ls) || 0) * root;
        }
        const n = parseFloat(ls);
        return Number.isFinite(n) ? n : 0;
    };

    const syncType = (fromEl, svgText, svgTextPath) => {
        const s = getComputedStyle(fromEl);
        const fsPx = parseFloat(s.fontSize) || 16;
        const lsPx = lsToPx(s.letterSpacing, fsPx);

        svgText.setAttribute('font-family', s.fontFamily);
        svgText.setAttribute('font-size', s.fontSize);
        svgText.setAttribute('font-weight', s.fontWeight);
        svgText.setAttribute('dominant-baseline', 'alphabetic');
        svgText.setAttribute('text-rendering', 'geometricPrecision');
        svgText.setAttribute('fill', s.color);

        svgText.setAttribute('letter-spacing', `${lsPx}px`);
        svgText.setAttribute('font-kerning', 'none');
        svgText.setAttribute('font-feature-settings', '"kern" 0, "liga" 0, "clig" 0');

        if (svgTextPath) svgTextPath.setAttribute('letter-spacing', `${lsPx}px`);

        return { fsPx, lsPx, ff: s.fontFamily, fw: s.fontWeight, fz: s.fontSize, tt: s.textTransform };
    };

    const matchSourceCasing = (value, textTransform) => {
        if (typeof value !== 'string') return value;
        if (textTransform === 'uppercase') return value.toUpperCase();

        return value;
    };

    const tspan = (tp, v, fill, lsPx) => {
        const t = document.createElementNS(ns, 'tspan');
        t.textContent = v;
        if (fill) t.setAttribute('fill', fill);
        if (lsPx != null) t.setAttribute('letter-spacing', `${lsPx}px`);
        tp.appendChild(t);
    };

    const buildRun = (tp, text, spacer, spacerColor, pad, reps, lsPx, textTransform) => {
        tp.textContent = '';
        const displayText = matchSourceCasing(text, textTransform);
        const displaySpacer = matchSourceCasing(spacer, textTransform);

        for (let i = 0; i < reps; i++) {
            tspan(tp, displayText, null, lsPx);
            tspan(tp, pad, null, lsPx);
            tspan(tp, displaySpacer, spacerColor, lsPx);
            tspan(tp, pad, null, lsPx);
        }
    };

    // >>> Reverse shape: draw path as lower half arc, i.e., negative sweep, and adjust geometry.
    // The arc should now sweep downward, so sweep flag becomes 0 and y-offsets reflect bottom origin

    // Now the "circleR" function doesn't change; it's symmetric for both arcs.
    const circleR = (half, level01) => {
        if (level01 <= 0) return half * 200;
        const inv = 1 - level01;
        return half * (1.01 + inv * inv * 16.99);
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const measureLS = (str, fontCss, lsPx, textTransform) => {
        if (!ctx) return 0;
        const txt = matchSourceCasing(str || '', textTransform).replace(/\u00A0/g, ' ');
        ctx.font = fontCss;
        const w = ctx.measureText(txt).width || 0;
        const glyphs = Array.from(txt).length;
        return w + Math.max(glyphs - 1, 0) * (lsPx || 0);
    };

    const makeSvg = (wrap) => {
        const svg = document.createElementNS(ns, 'svg');
        const defs = document.createElementNS(ns, 'defs');
        const g = document.createElementNS(ns, 'g');
        const path = document.createElementNS(ns, 'path');
        const text = document.createElementNS(ns, 'text');
        const tp = document.createElementNS(ns, 'textPath');
        const id = `rtm-${Math.random().toString(16).slice(2)}`;

        svg.setAttribute('xmlns', ns);
        svg.setAttribute('xmlns:xlink', xns);
        Object.assign(svg.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            pointerEvents: 'none',
            display: 'block'
        });
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        path.setAttribute('id', id);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');

        tp.setAttributeNS(xns, 'xlink:href', `#${id}`);
        tp.setAttribute('text-anchor', 'start');
        tp.setAttribute('startOffset', '0px');

        text.appendChild(tp);
        defs.appendChild(path);
        svg.appendChild(defs);
        g.appendChild(path);
        g.appendChild(text);
        svg.appendChild(g);
        wrap.appendChild(svg);

        const textEl = wrap.querySelector('[data-radial-text-marquee-text]');
        if (textEl) textEl.style.opacity = '0';

        return { svg, g, path, text, tp };
    };

    wraps.forEach((wrap) => {
        const textEl = wrap.querySelector('[data-radial-text-marquee-text]');
        if (!textEl) return;

        const st = { ...makeSvg(wrap), tw: null, px: { x: 0 }, raf: 0, qs: null };

        const rebuild = () => {
            let baseText = (textEl.textContent || '').trim();
            if (!baseText) return;

            const speed = clamp(wrap.getAttribute('data-radial-text-marquee-speed') || 4, 0.1, 200);
            const speedPx = Math.max(speed * 100 * speedMul(), 1);

            const radiusLevel = clamp(wrap.getAttribute('data-radial-text-marquee-radius') || 10, 0, 10);
            const level01 = radiusLevel / 10;

            const spacer = wrap.getAttribute('data-radial-text-marquee-spacer') || '•';
            const spacerColor = wrap.getAttribute('data-radial-text-marquee-spacer-color') || null;

            const padCount = clamp(wrap.getAttribute('data-radial-text-marquee-spacer-padding') || 1, 0, 20);
            const pad = '\u00A0'.repeat(padCount); // For spaces, uppercase doesn't matter

            const typo = syncType(textEl, st.text, st.tp);

            const wrapW = Math.max(wrap.clientWidth || 1, 1);
            const parentH = wrap.parentElement ? wrap.parentElement.clientHeight : 0;
            const wrapH = Math.max(wrap.clientHeight || parentH || textEl.offsetHeight || 1, 1);
            const bleed = typo.fsPx * 2;

            const w = wrapW + bleed * 2;
            const h = wrapH;

            Object.assign(st.svg.style, { width: `${w}px`, height: `${h}px`, left: `${-bleed}px` });
            st.svg.setAttribute('width', w);
            st.svg.setAttribute('height', h);
            st.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

            const half = w / 2;
            const r = level01 <= 0.0001 ? half * 200 : Math.max(circleR(half, level01), half + 0.001);
            const under = Math.max(r * r - half * half, 0);
            const arcHeight = Math.max(r - Math.sqrt(under), 0);
            const baseline = h / 2 + typo.fsPx * 0.35;
            const y = Math.max(baseline - arcHeight / 2, 0);

            st.path.setAttribute(
                'd',
                level01 <= 0.0001
                    ? `M 0 ${y} L ${w} ${y}`
                    : `M 0 ${y} A ${r} ${r} 0 0 0 ${w} ${y}`
            );

            st.text.setAttribute('x', '0');
            st.text.setAttribute('y', `${y}`);
            st.g.setAttribute('transform', 'translate(0 0)');
            textEl.style.opacity = '0';

            cancelAnimationFrame(st.raf);
            st.raf = requestAnimationFrame(() => {
                const fontCss = `${typo.fw} ${typo.fz} ${typo.ff}`;

                let loopLen =
                    measureLS(baseText, fontCss, typo.lsPx, typo.tt) +
                    measureLS(pad, fontCss, typo.lsPx, typo.tt) +
                    measureLS(spacer, fontCss, typo.lsPx, typo.tt) +
                    measureLS(pad, fontCss, typo.lsPx, typo.tt);

                loopLen = Math.max(loopLen || 0, 1);

                const pathLen = st.path.getTotalLength ? st.path.getTotalLength() : wrapW;
                const targetCover = Math.max(pathLen * 4, wrapW * 8);

                const reps = clamp(Math.ceil(targetCover / loopLen) + 6, 6, 600);
                buildRun(st.tp, baseText, spacer, spacerColor, pad, reps, typo.lsPx, typo.tt);

                const textBox = st.text.getBBox();
                const centerOffset = h / 2 - (textBox.y + textBox.height / 2);
                st.g.setAttribute('transform', `translate(0 ${centerOffset})`);

                if (!isSafari) {
                    const fullLen = st.tp.getComputedTextLength();
                    if (Number.isFinite(fullLen) && fullLen > 0) {
                        const perUnit = fullLen / reps;
                        if (Number.isFinite(perUnit) && perUnit > 0) loopLen = perUnit;
                    }
                }

                loopLen = Math.max(loopLen, 1);

                if (st.tw) st.tw.kill();
                st.tw = null;
                if (prm) return;

                st.qs = gsap && gsap.quickSetter ? gsap.quickSetter(st.tp, 'attr') : null;

                const setOffset = (v) => {
                    const val = `${v.toFixed(3)}px`;
                    if (st.qs) st.qs({ startOffset: val });
                    else st.tp.setAttribute('startOffset', val);
                };

                st.px.x = ((performance.now() - startTime) / 1000 * speedPx) % loopLen;
                st.tw = gsap.to(st.px, {
                    x: st.px.x + loopLen,
                    duration: loopLen / speedPx,
                    ease: 'none',
                    repeat: -1,
                    onUpdate: () => {
                        // Flipping path doesn't require inverting animation direction; leave as is.
                        const x = ((st.px.x % loopLen) + loopLen) % loopLen;
                        setOffset(-x);
                    }
                });

            });
        };

        const schedule = (() => {
            let raf = 0;
            return () => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(rebuild);
            };
        })();

        rebuild();

        if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule).catch(() => {});
        else setTimeout(schedule, 150);

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(schedule);
            ro.observe(wrap);
            ro.observe(textEl);
        } else {
            window.addEventListener('resize', schedule);
        }
    });
}

// When everything is ready in the DOM, run this code.
document.addEventListener('DOMContentLoaded', () => {
    setupLenis();
    initRadialTextMarquee();
    sectionAnimation();
});