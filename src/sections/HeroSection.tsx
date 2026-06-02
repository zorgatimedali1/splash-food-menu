import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const baseUrl = import.meta.env.BASE_URL ?? '/';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 });

      tl.fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-btn', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.6');

      return () => { tl.kill(); };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center bg-gray-950">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src={`${baseUrl}videos/hero_video.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={`${baseUrl}images/splash_burger.jpg`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="hero-title font-montserrat text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-extrabold text-white uppercase tracking-tight opacity-0 leading-none">
          SPLASH <span className="font-light">FOOD</span>
        </h1>
        <p className="hero-subtitle mt-6 text-lg md:text-xl lg:text-2xl text-white/70 font-inter font-light opacity-0">
          Le gout qui fait sensation
        </p>
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu" className="hero-btn btn-secondary border-white text-white hover:bg-white hover:text-black opacity-0">
            VOIR LE MENU
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-5 h-9 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
