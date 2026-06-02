import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function forceScrollTop() {
  window.scrollTo(0, 0);
  const lenisInstance = (window as any).__lenis;
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 0.7,
    });

    (window as any).__lenis = lenis;

    forceScrollTop();
    ScrollTrigger.refresh();

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback: gsap.TickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);

    const onLoad = () => forceScrollTop();
    window.addEventListener('load', onLoad);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) forceScrollTop();
    };
    window.addEventListener('pageshow', onPageShow);

    const rafIds = [0, 1, 2, 3].map(() =>
      requestAnimationFrame(() => forceScrollTop())
    );

    const timeoutId = setTimeout(forceScrollTop, 150);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('pageshow', onPageShow);
      rafIds.forEach(cancelAnimationFrame);
      clearTimeout(timeoutId);
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
