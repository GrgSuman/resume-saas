export default function CircularLoadingIndicator({size = 16}: {size?: number}) {
  // Map common sizes to Tailwind classes
  const sizeMap: Record<number, string> = {
    16: "w-16 h-16",
    20: "w-20 h-20",
    24: "w-24 h-24",
    32: "w-32 h-32",
  };
  
  const sizeClass = sizeMap[size] || `w-[${size}px] h-[${size}px]`;
  const borderWidth = size <= 16 ? "border-4" : size <= 24 ? "border-[6px]" : "border-8";
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-[400px]">
      <div className="relative">
        <div className={`${sizeClass} ${borderWidth} border-gray-200 rounded-full`}></div>
        <div className={`absolute top-0 left-0 ${sizeClass} ${borderWidth} border-transparent border-t-slate-600 rounded-full animate-spin`}></div>
      </div>
    </div>
  );
};

