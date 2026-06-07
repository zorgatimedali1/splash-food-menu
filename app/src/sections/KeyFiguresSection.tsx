import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getKeyFigures } from '@/data';
import CountUp from 'react-countup';

function FigureCard({ number, suffix, label, delay }: { number: number; suffix: string; label: string; delay: number }) {
  const ref = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp', delay });

  return (
    <div ref={ref} className="text-center">
      <div className="font-montserrat text-5xl md:text-6xl font-extrabold text-black">
        <CountUp end={number} duration={2} separator="," suffix={suffix} enableScrollSpy scrollSpyOnce />
      </div>
      <p className="mt-2 text-base text-splash-gray font-inter">{label}</p>
    </div>
  );
}

export default function KeyFiguresSection() {
  return (
    <section className="section-padding bg-white border-t border-splash-border">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {getKeyFigures().map((fig, index) => (
            <FigureCard
              key={fig.label}
              number={fig.number}
              suffix={fig.suffix}
              label={fig.label}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
