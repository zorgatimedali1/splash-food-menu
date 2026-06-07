import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
}

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  const ref = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp' });

  return (
    <section className="pt-28 md:pt-36 pb-12 md:pb-16 bg-white">
      <div className="section-container" ref={ref}>
        <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight">
          {title}
        </h1>
        <nav className="mt-4">
          <ol className="flex items-center gap-2 text-sm text-splash-gray">
            <li>
              <Link to="/" className="hover:text-black transition-colors duration-300">
                Accueil
              </Link>
            </li>
            <li>/</li>
            <li className="text-black font-medium">{breadcrumb}</li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
