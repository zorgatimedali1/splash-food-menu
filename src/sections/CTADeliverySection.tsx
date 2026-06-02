import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Img from '@/components/Img';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CTADeliverySection() {
  const contentRef = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp' });

  return (
    <section className="relative min-h-[60vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden bg-black">
      <Img
        src="/images/about_histoire.jpg"
        alt="Livraison"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="font-inter text-sm text-white/50 uppercase tracking-widest mb-4">Livraison à domicile</p>
        <h2 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight">
          COMMANDEZ <span className="font-light">MAINTENANT</span>
        </h2>
        <p className="mt-4 text-lg text-white/60 font-inter">
          Livraison rapide pour seulement <span className="text-white font-semibold">2 DT</span>
        </p>
        <Link to="/livraison" className="btn-white mt-8 inline-flex">
          <FiArrowRight size={18} />
          VOIR LES DÉTAILS
        </Link>
      </div>
    </section>
  );
}
