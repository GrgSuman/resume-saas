import { RefreshCw } from "lucide-react";

const CoverLetterWritingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-lg">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Generating your cover letter...
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This may take a few moments
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterWritingOverlay;


