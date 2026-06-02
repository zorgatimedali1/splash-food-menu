import PageHeader from '@/components/PageHeader';
import SectionTitle from '@/components/SectionTitle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TEAM_MEMBERS } from '@/data';

export default function About() {
  const storyRef = useScrollAnimation<HTMLDivElement>({ type: 'slideInLeft' });
  const storyTextRef = useScrollAnimation<HTMLDivElement>({ type: 'fadeUp', delay: 0.2 });
  const missionTextRef = useScrollAnimation<HTMLDivElement>({ type: 'slideInLeft' });
  const missionImgRef = useScrollAnimation<HTMLDivElement>({ type: 'slideInRight', delay: 0.2 });
  const teamRef = useScrollAnimation<HTMLDivElement>({
    type: 'staggerCards',
    childSelector: '.team-card',
    stagger: 0.12,
  });

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="A PROPOS DE NOUS" breadcrumb="A Propos" />

      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div ref={storyRef}>
              <img
                src="/images/about_histoire.jpg"
                alt="Notre histoire"
                className="w-full rounded-2xl object-cover aspect-video shadow-card"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div ref={storyTextRef}>
              <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-black uppercase mb-6 tracking-tight">
                NOTRE HISTOIRE
              </h2>
              <p className="text-black/80 leading-relaxed mb-4 font-inter">
                Splash Food est ne d&apos;une passion pour le street food de qualite. Fonde a Kalaa Kebira, notre restaurant a rapidement conquis les coeurs des amateurs de burgers et tacos.
              </p>
              <p className="text-black/80 leading-relaxed font-inter">
                Notre mission est simple : offrir une experience gastronomique unique en alliant la rapidite du fast-food a la qualite de la haute cuisine. Chaque ingredient est soigneusement selectionne, chaque recette est perfectionnee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-splash-light-gray">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div ref={missionTextRef} className="order-2 lg:order-1">
              <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-black uppercase mb-6 tracking-tight">
                NOTRE MISSION
              </h2>
              <p className="text-black/80 leading-relaxed mb-8 font-inter">
                Nous croyons que le bon gout ne devrait pas etre un luxe. C&apos;est pourquoi nous nous engageons a proposer des produits premium a des prix accessibles. Notre equipe de chefs passionnes travaille chaque jour pour reinventer le street food.
              </p>
              <div className="space-y-4">
                {['Qualite avant tout', 'Ingredients frais et locaux', 'Recettes innovantes'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                    <span className="text-black/80 font-inter font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div ref={missionImgRef} className="order-1 lg:order-2">
              <img
                src="/images/about_mission.jpg"
                alt="Notre mission"
                className="w-full rounded-2xl object-cover aspect-video shadow-card"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionTitle title="NOTRE EQUIPE" subtitle="Des passionnes a votre service" />

          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="team-card group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-splash-border">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="mt-5 font-montserrat text-lg font-bold text-black">{member.name}</h3>
                <p className="text-splash-gray text-sm font-inter">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
