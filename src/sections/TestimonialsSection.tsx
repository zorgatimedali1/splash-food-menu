import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaStar } from 'react-icons/fa';
import SectionTitle from '@/components/SectionTitle';
import { TESTIMONIALS } from '@/data';
import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-splash-light-gray">
      <div className="section-container">
        <SectionTitle title="CE QU'ILS DISENT DE NOUS" />

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, bulletActiveClass: 'swiper-pagination-bullet-active-custom' }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-splash-border rounded-2xl p-6 lg:p-8 h-full flex flex-col shadow-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} className="text-black text-sm" />
                  ))}
                </div>
                <p className="text-black/80 text-base leading-relaxed flex-1 font-inter">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="mt-4 font-montserrat text-base font-bold text-black">{testimonial.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .testimonial-swiper .swiper-pagination {
          position: relative;
          margin-top: 2.5rem;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D4D4D4;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .testimonial-swiper .swiper-pagination-bullet-active-custom {
          background: #000000 !important;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
