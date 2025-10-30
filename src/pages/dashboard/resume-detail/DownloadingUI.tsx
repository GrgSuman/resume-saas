const DownloadingUI = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight text-center">
          Generating your resume...
        </h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          We're crafting a polished PDF version for you. This may take a few seconds.
        </p>

        {/* Smooth progress bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-[progress_2s_ease-in-out_infinite]" />
        </div>

        <style>{`
          @keyframes progress {
            0% {
              transform: translateX(-100%);
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateX(100%);
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DownloadingUI;
