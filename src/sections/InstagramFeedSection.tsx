import { FaInstagram, FaFacebook } from 'react-icons/fa';
import SectionTitle from '@/components/SectionTitle';

export default function InstagramFeedSection() {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionTitle title="SUIVEZ-NOUS" subtitle="@splash.food01" />

        <div className="flex justify-center gap-6">
          <a
            href="https://www.instagram.com/splash.food01/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-2xl border border-splash-border flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            <FaInstagram size={36} className="sm:size-10 md:size-12" />
          </a>
          <a
            href="https://www.facebook.com/splash.food01"
            target="_blank"
            rel="noopener noreferrer"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-2xl border border-splash-border flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            <FaFacebook size={36} className="sm:size-10 md:size-12" />
          </a>
        </div>
      </div>
    </section>
  );
}
