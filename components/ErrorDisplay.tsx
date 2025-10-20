
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);


const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto mt-10 text-center bg-red-50 p-8 rounded-lg border border-red-200">
      <div className="flex justify-center mb-4">
        <AlertTriangleIcon />
      </div>
      <h3 className="text-xl font-bold text-red-800">Oops! Something went wrong.</h3>
      <p className="text-red-700 mt-2 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;