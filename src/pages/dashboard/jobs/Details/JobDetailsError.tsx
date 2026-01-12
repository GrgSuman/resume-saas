import { Button } from "../../../../components/ui/button";
import { AlertCircle } from "lucide-react";

interface JobDetailsErrorProps {
  onRetry?: () => void;
}

const JobDetailsError = ({ onRetry }: JobDetailsErrorProps) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-red-50 p-3 mb-4 inline-flex">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-sm font-medium text-zinc-900 mb-1">
          Failed to load job
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          There was an error loading the job details. Please try again.
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-zinc-700 border-zinc-200 hover:bg-zinc-50"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobDetailsError;

