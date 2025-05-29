import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-12" aria-label="Loading palettes" role="status">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      <p className="text-red-400 text-lg font-medium">Matching your vibe with palettes & fonts...</p>
      <p className="text-gray-400 text-sm">The AI is crafting perfection, please wait a moment!</p>
    </div>
  );
};

export default LoadingSpinner;