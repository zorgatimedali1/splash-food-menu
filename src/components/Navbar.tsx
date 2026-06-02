import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { NAV_LINKS } from '@/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 will-change-transform ${
          scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between h-20">
          <Link to="/" className="font-montserrat text-2xl lg:text-[26px] font-extrabold text-black tracking-tight">
            SPLASH <span className="font-light">FOOD</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-inter text-xs font-semibold tracking-widest uppercase transition-colors duration-300 hover:text-black/60 ${
                  location.pathname === link.path ? 'text-black' : 'text-black/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>



          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-black p-2"
            aria-label="Ouvrir le menu"
          >
            <HiMenu size={24} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-lg"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-8 transition-transform duration-400 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-black p-2"
            aria-label="Fermer le menu"
          >
            <HiX size={24} />
          </button>

          <div className="flex flex-col gap-8 mt-20">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-montserrat text-3xl font-bold tracking-tight transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-black' : 'text-black/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>


        </div>
      </div>
    </>
  );
}
