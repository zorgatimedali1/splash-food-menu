import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionTitle from '@/components/SectionTitle';
import { BEST_SELLERS } from '@/data';
import 'swiper/css';
import 'swiper/css/navigation';

export default function BestSellersSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-splash-light-gray">
      <div className="section-container">
        <div className="flex items-end justify-between mb-14">
          <SectionTitle title="NOS MEILLEURES VENTES" centered={false} className="mb-0" />
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className="w-11 h-11 rounded-xl border border-splash-border bg-white flex items-center justify-center text-black hover:border-black hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className="w-11 h-11 rounded-xl border border-splash-border bg-white flex items-center justify-center text-black hover:border-black hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={visible ? { delay: 5000, disableOnInteraction: false } : false}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {BEST_SELLERS.map((item) => (
            <SwiperSlide key={item.name}>
              <div className="group bg-white border border-splash-border rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-montserrat text-lg font-bold text-black group-hover:text-black/60 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-splash-gray leading-relaxed">
                    {item.description}
                  </p>
                  <p className="mt-3 font-montserrat text-lg font-extrabold text-black">{item.price} DT</p>
                  <Link
                    to={`/product/${item.slug}`}
                    className="mt-3 w-full inline-flex items-center justify-center px-3 py-2.5 rounded-lg bg-black text-white text-xs font-montserrat font-bold hover:bg-black/80 transition-all duration-300"
                  >
                    Commander
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
