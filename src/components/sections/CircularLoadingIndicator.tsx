export default function CircularLoadingIndicator({size = 16}: {size?: number}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-[400px]">
    <div className="relative">
      <div className={`w-${size} h-${size} border-4 border-gray-200 rounded-full`}></div>
      <div className={`absolute top-0 left-0 w-${size} h-${size} border-4 border-transparent border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  </div>
  );
};

