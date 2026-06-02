import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import SectionTitle from '@/components/SectionTitle';
import { FAQ_ITEMS } from '@/data';

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-splash-border">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="font-inter text-base lg:text-lg font-semibold text-black pr-4 group-hover:text-black/60 transition-colors duration-300">
          {question}
        </span>
        <FiChevronRight
          size={20}
          className={`text-black/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-out ${
          isOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-splash-gray text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-splash-light-gray">
      <div className="section-container max-w-3xl">
        <SectionTitle title="QUESTIONS FREQUENTES" />

        <div className="bg-white border border-splash-border rounded-2xl px-6 md:px-10 shadow-card">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
