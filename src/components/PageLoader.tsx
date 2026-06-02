import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });

    tl.fromTo(
      '.loader-logo',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
      .fromTo(
        '.loader-bar',
        { width: '0%' },
        { width: '100%', duration: 1.2, ease: 'power2.inOut' }
      )
      .to('.loader-container', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.2,
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-container fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="loader-logo font-montserrat text-4xl font-extrabold text-black tracking-tight">
        SPLASH <span className="font-light">FOOD</span>
      </div>
      <div className="w-48 h-[2px] bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="loader-bar h-full bg-gray-950 rounded-full" />
      </div>
    </div>
  );
}
