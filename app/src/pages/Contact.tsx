import { useState, useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CONTACT_INFO } from '@/data';
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const iconMap: Record<string, React.ElementType> = {
  phone: FaPhone,
  mapPin: FaMapMarkerAlt,
  clock: FaClock,
  mail: FaEnvelope,
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef2 = useRef<HTMLFormElement>(null);

  const cardsRef = useScrollAnimation<HTMLDivElement>({
    type: 'staggerCards',
    childSelector: '.contact-card',
    stagger: 0.08,
  });
  const formRef = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp' });
  const mapRef = useScrollAnimation<HTMLDivElement>({ type: 'slideInRight', delay: 0.2 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem('contact-name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('contact-email') as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem('contact-subject') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('contact-message') as HTMLTextAreaElement).value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      setSubmitted(true);
      formRef2.current?.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="CONTACTEZ-NOUS" breadcrumb="Contact" />

      <section className="py-12 md:py-16">
        <div className="section-container">
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((info) => {
              const Icon = iconMap[info.icon];
              return (
                <div key={info.title} className="contact-card card-hover p-8 text-center">
                  {Icon && <Icon className="size-7 text-black mx-auto" />}
                  <h3 className="mt-4 font-montserrat text-lg font-bold text-black">{info.title}</h3>
                  <p className="mt-2 text-sm text-splash-gray font-inter">
                    {info.title === 'Adresse' ? (
                      <a
                        href="https://www.google.com/maps?q=35.8704108,10.5365372"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : info.title === 'Téléphone' ? (
                      <a href="tel:+21699744593" className="hover:text-black transition-colors">
                        {info.value}
                      </a>
                    ) : info.title === 'Email' ? (
                      <a href="mailto:contact@splashfood.tn" className="hover:text-black transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      info.value
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div ref={formRef}>
              <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold text-black uppercase mb-8 tracking-tight">
                ENVOYEZ-NOUS UN MESSAGE
              </h2>

              {submitted ? (
                <div className="py-10 text-center">
                  <div className="size-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="size-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-montserrat text-xl text-black mb-2">Message envoye !</h3>
                  <p className="text-splash-gray text-sm font-inter">Merci de nous avoir contacte. Nous vous repondrons sous peu.</p>
                </div>
              ) : (
                <form ref={formRef2} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-black mb-2 font-inter">Nom *</label>
                    <input id="contact-name" name="contact-name" type="text" required placeholder="Votre nom" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-black mb-2 font-inter">Email *</label>
                    <input id="contact-email" name="contact-email" type="email" required placeholder="Votre email" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-black mb-2 font-inter">Sujet *</label>
                    <input id="contact-subject" name="contact-subject" type="text" required placeholder="Sujet" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-black mb-2 font-inter">Message *</label>
                    <textarea id="contact-message" name="contact-message" rows={6} required placeholder="Votre message..." className="input-field resize-none" />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 font-inter">{error}</p>
                  )}
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'ENVOI EN COURS...' : 'ENVOYER'}
                  </button>
                </form>
              )}
            </div>

            <div ref={mapRef} className="h-full">
              <iframe
                src="https://www.google.com/maps?q=35.8704108,10.5365372&z=16&output=embed"
                className="w-full h-full min-h-[400px] lg:min-h-[480px] rounded-2xl border border-splash-border shadow-card"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Splash Food"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <a
                href="https://www.google.com/maps?q=35.8704108,10.5365372"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-splash-gray hover:text-black transition-colors font-inter"
              >
                <FaMapMarkerAlt className="size-4" />
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
