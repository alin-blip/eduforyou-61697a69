import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Este cu adevărat gratuit să studiezi în UK?',
    answer:
      'Da! Prin Student Finance England (SFE), studenții eligibili pot accesa finanțare completă care acoperă taxele universitare. Nu trebuie să plătești nimic în avans, iar rambursarea începe doar după ce câștigi peste £25,000 pe an.',
  },
  {
    question: 'Cine este eligibil pentru Student Finance England?',
    answer:
      'Cetățenii UE cu Settled Status sau Pre-Settled Status care au locuit în UK cel puțin 3 ani sunt de obicei eligibili. De asemenea, cetățenii britanici și rezidenții permanenți pot aplica.',
  },
  {
    question: 'Ce cursuri sunt disponibile?',
    answer:
      'Oferim o gamă largă de cursuri universitare: Business Management, Health & Social Care, Computing & IT, Construction Management, Engineering, Nursing și multe altele. Cursurile sunt disponibile la nivel de diplomă, licență și master.',
  },
  {
    question: 'Cum funcționează procesul de aplicare?',
    answer:
      'Procesul este simplu: 1) Completezi testul de eligibilitate, 2) Alegi cursul potrivit cu ajutorul consultanților noștri, 3) Te ajutăm cu aplicația la universitate și SFE, 4) Începi studiile! Tot procesul este gratuit și ghidat.',
  },
  {
    question: 'Trebuie să vorbesc engleză la nivel avansat?',
    answer:
      'Un nivel mediu de engleză este suficient pentru majoritatea cursurilor. Unele universități oferă și suport suplimentar pentru limba engleză. Echipa noastră vorbește română și te poate ghida în limba ta.',
  },
  {
    question: 'Pot studia și lucra în același timp?',
    answer:
      'Absolut! Multe cursuri sunt disponibile part-time sau cu program flexibil, permițându-ți să lucrezi în același timp. Studiile online și blended learning sunt de asemenea opțiuni populare.',
  },
  {
    question: 'Cât durează un curs universitar?',
    answer:
      'Durata variază în funcție de program: o diplomă durează de obicei 1-2 ani, o licență (Bachelor) 3-4 ani, iar un master 1-2 ani. Programele part-time pot dura mai mult.',
  },
  {
    question: 'Ce se întâmplă după ce termin cursul?',
    answer:
      'După absolvire, vei avea o calificare universitară britanică recunoscută internațional. Echipa noastră oferă și suport pentru carieră, ajutându-te să găsești un loc de muncă mai bine plătit în domeniul tău.',
  },
  {
    question: 'Cum mă ajută EduForYou concret?',
    answer:
      'EduForYou oferă consultanță gratuită completă: evaluare eligibilitate, alegerea cursului potrivit, completarea aplicațiilor la universitate și SFE, traduceri de documente, și suport continuu pe tot parcursul studiilor.',
  },
  {
    question: 'Este Student Finance England un împrumut?',
    answer:
      'Tehnic, da, este un împrumut studențesc, dar funcționează foarte diferit de un credit bancar. Rambursarea este proporțională cu venitul tău (9% din ce câștigi peste £25,000/an), iar după 40 de ani orice sold rămas este șters automat.',
  },
];

const HomeFAQ = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Întrebări Frecvente
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Totul despre studiile gratuite în UK pentru români
        </p>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default HomeFAQ;
