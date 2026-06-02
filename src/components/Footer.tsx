import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/data';

const mid = Math.ceil(NAV_LINKS.length / 2);
const leftLinks = NAV_LINKS.slice(0, mid);
const rightLinks = NAV_LINKS.slice(mid);

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div>
            <Link to="/" className="font-montserrat text-2xl font-extrabold text-white tracking-tight">
              SPLASH <span className="font-light">FOOD</span>
            </Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Restaurant street food premium. Pizza, tacos, sandwichs, pâtes et bien plus encore.
            </p>
          </div>

          <div>
            <h4 className="font-montserrat text-sm font-semibold text-white uppercase tracking-widest mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              {leftLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat text-sm font-semibold text-white uppercase tracking-widest mb-6">Services</h4>
            <ul className="space-y-3">
              {rightLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat text-sm font-semibold text-white uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <a
                  href="https://www.google.com/maps?q=35.8704108,10.5365372"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300"
                >
                  Avenue 14 Janvier, Kalaa Kebira 4060
                </a>
              </li>
              <li>
                <a href="tel:+21699744593" className="hover:text-white transition-colors duration-300">
                  +216 99 744 593
                </a>
              </li>
              <li>
                <a href="mailto:contact@splashfood.tn" className="hover:text-white transition-colors duration-300">
                  contact@splashfood.tn
                </a>
              </li>
              <li>Lun-Dim: 11h - 23h</li>
            </ul>
          </div>
        </div>

        <div className="separator mt-16 mb-8 bg-white/10" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            2026 Splash Food Resto. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/splash.food01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white transition-colors duration-300 uppercase tracking-widest font-inter font-semibold"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/splash.food01/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white transition-colors duration-300 uppercase tracking-widest font-inter font-semibold"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/21699744593"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white transition-colors duration-300 uppercase tracking-widest font-inter font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
