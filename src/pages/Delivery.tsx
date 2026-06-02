import PageHeader from '@/components/PageHeader';
import SectionTitle from '@/components/SectionTitle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { DELIVERY_SERVICES, DELIVERY_ZONES } from '@/data';

export default function Delivery() {
  const cardsRef = useScrollAnimation<HTMLDivElement>({
    type: 'staggerCards',
    childSelector: '.delivery-card',
    stagger: 0.12,
  });
  const zonesRef = useScrollAnimation<HTMLDivElement>({
    type: 'staggerCards',
    childSelector: '.zone-item',
    stagger: 0.08,
  });

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="LIVRAISON À DOMICILE" breadcrumb="Livraison" />

      {/* Price Banner */}
      <section className="py-8 bg-splash-light-gray">
        <div className="section-container text-center">
          <p className="font-montserrat text-3xl md:text-4xl font-extrabold text-black">
            LIVRAISON — <span className="text-black">2 DT</span>
          </p>
          <p className="mt-2 text-sm text-splash-gray font-inter">
            Frais de livraison fixes pour toutes les commandes
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="section-container max-w-5xl">
          <SectionTitle title="COMMANDEZ VIA" subtitle="Choisissez votre service de livraison" />

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERY_SERVICES.map((service) => (
              <div
                key={service.name}
                className="delivery-card card-hover p-10 text-center flex flex-col items-center"
              >
                <div className="size-16 rounded-2xl bg-gray-950 flex items-center justify-center mb-6">
                  <span className="font-montserrat text-2xl font-bold text-white">{service.name[0]}</span>
                </div>
                <h3 className="font-montserrat text-2xl font-bold text-black">{service.name}</h3>
                <p className="mt-3 text-sm text-splash-gray font-inter">{service.description}</p>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6"
                >
                  COMMANDER
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="py-16 md:py-24 bg-splash-light-gray">
        <div className="section-container max-w-3xl">
          <SectionTitle title="ZONES DE LIVRAISON" />

          <div ref={zonesRef} className="bg-white border border-splash-border rounded-2xl px-6 md:px-10 shadow-card">
            {DELIVERY_ZONES.map((zone) => (
              <div
                key={zone.name}
                className="zone-item flex items-center justify-between py-5 border-b border-splash-border last:border-b-0"
              >
                <span className="text-base text-black font-inter font-medium">{zone.name}</span>
                <span className="text-sm text-black/60 font-inter font-semibold">{zone.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
