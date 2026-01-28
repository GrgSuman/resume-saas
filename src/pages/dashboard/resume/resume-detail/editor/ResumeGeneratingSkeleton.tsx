import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../../../../../components/ui/scroll-area";

interface ResumeGeneratingSkeletonProps {
  zoomLevel: number;
}

const ResumeGeneratingSkeleton = ({ zoomLevel }: ResumeGeneratingSkeletonProps) => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };
    setIsSmallDevice(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className="flex justify-center items-start px-4 py-15" style={{ minHeight: '100%' }}>
          <div
            className="bg-white transition-all shadow-lg"
            style={{
              minWidth: "210mm",
              minHeight: "297mm",
              maxWidth: "210mm",
              transform: `scale(${zoomLevel})`,
              transformOrigin: isSmallDevice ? "left top" : "center top",
            }}
          >
            <div
              className="relative"
              style={{
                padding: "28px",
                fontSize: "14px",
                fontFamily: "Lato",
                lineHeight: "1.4em",
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>
              
              {/* Header Section */}
              <div className="space-y-4 mb-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="flex gap-4 mt-3">
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-3 mb-6">
                <div className="h-5 bg-gray-300 rounded w-24 mb-2 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-4 mb-6">
                <div className="h-5 bg-gray-300 rounded w-32 mb-3 animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-36 animate-pulse" />
                    <div className="space-y-1.5 mt-2">
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-11/12 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-10/12 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Section */}
              <div className="space-y-3 mb-6">
                <div className="h-5 bg-gray-300 rounded w-28 mb-3 animate-pulse" />
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2 pb-3">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="space-y-3">
                <div className="h-5 bg-gray-300 rounded w-20 mb-3 animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ResumeGeneratingSkeleton;

