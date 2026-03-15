import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const NAMES = [
  'Maria din București',
  'Andrei din Cluj',
  'Elena din Londra',
  'Ion din Manchester',
  'Ana din Birmingham',
  'Mihai din Leeds',
  'Cristina din Bristol',
  'Florin din Edinburgh',
  'Ioana din Glasgow',
  'Dan din Liverpool',
  'Raluca din Cardiff',
  'Bogdan din Sheffield',
];

const ACTIONS = [
  's-a înscris la webinar',
  'și-a rezervat locul la webinar',
  's-a înregistrat pentru webinarul IKIGAI',
  'a confirmat participarea la webinar',
];

const SocialProofToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const generateMessage = useCallback(() => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    return `${name} ${action}`;
  }, []);

  useEffect(() => {
    const showToast = () => {
      setMessage(generateMessage());
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    // First show after 15 seconds
    const initialTimeout = setTimeout(() => {
      showToast();

      // Then every 30 seconds
      const interval = setInterval(showToast, 30000);
      return () => clearInterval(interval);
    }, 15000);

    return () => clearTimeout(initialTimeout);
  }, [generateMessage]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-white p-4 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg">
          &#127891;
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="mt-1 text-xs text-gray-400">Acum câteva momente</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Închide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SocialProofToast;
