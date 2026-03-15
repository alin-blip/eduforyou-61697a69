import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const NAMES = [
  'Andrei din Manchester',
  'Maria din Londra',
  'Ion din Birmingham',
  'Elena din Leeds',
  'Alexandru din Bristol',
  'Ana din Edinburgh',
  'Mihai din Glasgow',
  'Cristina din Liverpool',
  'Florin din Sheffield',
  'Ioana din Cardiff',
  'Dan din Nottingham',
  'Raluca din Newcastle',
  'Bogdan din Southampton',
  'Diana din Oxford',
  'Vlad din Cambridge',
];

const ACTIONS = [
  's-a înscris la',
  'a primit finanțare pentru',
  'a fost acceptat la',
  'a început cursul de',
  'a completat aplicația pentru',
  'a obținut Student Finance pentru',
];

const COURSES = [
  'Business Management',
  'Health & Social Care',
  'Computing & IT',
  'Construction Management',
  'Engineering',
  'Nursing Studies',
];

const GlobalSocialProof = () => {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', action: '', course: '' });
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/student');

  const generateNotification = useCallback(() => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const course = COURSES[Math.floor(Math.random() * COURSES.length)];
    return { name, action, course };
  }, []);

  useEffect(() => {
    if (isDashboard) return;

    const showNotification = () => {
      setNotification(generateNotification());
      setVisible(true);

      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return hideTimeout;
    };

    // Show first one after 10 seconds
    const initialTimeout = setTimeout(() => {
      const hideTimeout = showNotification();

      // Then every 30 seconds
      const interval = setInterval(() => {
        showNotification();
      }, 30000);

      return () => {
        clearTimeout(hideTimeout);
        clearInterval(interval);
      };
    }, 10000);

    return () => clearTimeout(initialTimeout);
  }, [isDashboard, generateNotification]);

  if (isDashboard || !visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg">
          &#9989;
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {notification.name}
          </p>
          <p className="text-sm text-gray-600">
            {notification.action} <span className="font-medium">{notification.course}</span>
          </p>
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

export default GlobalSocialProof;
