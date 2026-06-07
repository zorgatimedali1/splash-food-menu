import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({ title, subtitle, centered = true, className = '' }: SectionTitleProps) {
  const ref = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp' });

  return (
    <div ref={ref} className={`mb-14 lg:mb-18 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-extrabold text-black tracking-tight uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-splash-gray font-inter max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
