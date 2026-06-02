import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fadeUp' | 'slideInLeft' | 'slideInRight' | 'scaleReveal' | 'staggerCards';

interface ScrollAnimationOptions {
  type: AnimationType;
  trigger?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  childSelector?: string;
}

export function useScrollAnimation<T extends HTMLElement>(options: ScrollAnimationOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      type,
      duration = 0.6,
      delay = 0,
      stagger = 0.1,
      start = 'top 80%',
      childSelector,
    } = options;

    let targets: Element | Element[] = el;
    if (childSelector) {
      targets = Array.from(el.querySelectorAll(childSelector));
    }

    let startPos = start;
    if (type === 'staggerCards') {
      startPos = 'top 70%';
    }

    const baseVars: gsap.TweenVars = {
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: startPos,
        toggleActions: 'play none none none',
        once: true,
      },
    };

    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {};

    switch (type) {
      case 'fadeUp':
        fromVars = { opacity: 0, y: 40 };
        toVars = { opacity: 1, y: 0 };
        break;
      case 'slideInLeft':
        fromVars = { opacity: 0, x: -60 };
        toVars = { opacity: 1, x: 0 };
        break;
      case 'slideInRight':
        fromVars = { opacity: 0, x: 60 };
        toVars = { opacity: 1, x: 0 };
        break;
      case 'scaleReveal':
        fromVars = { opacity: 0, scale: 0.9 };
        toVars = { opacity: 1, scale: 1 };
        break;
      case 'staggerCards':
        fromVars = { opacity: 0, y: 30 };
        toVars = { opacity: 1, y: 0, stagger };
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromVars, { ...baseVars, ...toVars });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}


