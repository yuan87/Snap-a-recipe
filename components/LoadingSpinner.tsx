
import React from 'react';

const LoadingSpinner: React.FC = () => {
  const messages = [
    "Chopping the vegetables...",
    "Preheating the oven...",
    "Simmering the sauce...",
    "Consulting with culinary experts...",
    "Plating your recipes beautifully..."
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col items-center justify-center text-center h-96">
        <svg className="animate-spin -ml-1 mr-3 h-16 w-16 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      <h3 className="text-2xl font-semibold text-stone-700 mt-6 font-['Playfair_Display']">Chef Gemini is thinking...</h3>
      <p className="text-lg text-stone-500 mt-2 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;