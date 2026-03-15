const UNIVERSITIES = [
  'University of Westminster',
  'University of Bedfordshire',
  'University of Sunderland',
  'London Metropolitan University',
  'University of Bolton',
  'Canterbury Christ Church University',
  'University of Wolverhampton',
  'University of East London',
  'Anglia Ruskin University',
  'Coventry University',
];

const UniversityPartnersBanner = () => {
  return (
    <section className="overflow-hidden bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-gray-500">
          Universități Partenere
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-gray-50 to-transparent" />

        {/* Scrolling row */}
        <div className="flex animate-scroll gap-6">
          {/* Duplicate for seamless loop */}
          {[...UNIVERSITIES, ...UNIVERSITIES].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm"
            >
              <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default UniversityPartnersBanner;
