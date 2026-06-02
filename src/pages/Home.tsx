import HeroSection from '@/sections/HeroSection';
import BestSellersSection from '@/sections/BestSellersSection';
import KeyFiguresSection from '@/sections/KeyFiguresSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import CTADeliverySection from '@/sections/CTADeliverySection';
import InstagramFeedSection from '@/sections/InstagramFeedSection';
import FAQSection from '@/sections/FAQSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BestSellersSection />
      <KeyFiguresSection />
      <TestimonialsSection />
      <CTADeliverySection />
      <InstagramFeedSection />
      <FAQSection />
    </main>
  );
}
