import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogPortal } from "../../../../../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "../../../../../components/ui/button";
import { Textarea } from "../../../../../components/ui/textarea";
import { useResume } from "../../../../../hooks/useResume";

interface JobDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDescriptionDialog = ({
  open,
  onOpenChange,
}: JobDescriptionDialogProps) => {
  const { state, dispatch } = useResume();
  const [tempJobDescription, setTempJobDescription] = useState("");

  const jobDescription = state.jobDescription || "";
  const hasJobDescription = jobDescription.trim().length > 0;

  // Initialize tempJobDescription when dialog opens
  useEffect(() => {
    if (open) {
      setTempJobDescription(jobDescription);
    }
  }, [open, jobDescription]);

  const handleSave = () => {
    const trimmedValue = tempJobDescription.trim();
    
    // Dispatch to global state
    dispatch({
      type: "SET_JOB_DESCRIPTION",
      payload: trimmedValue,
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Revert changes on cancel
    setTempJobDescription(jobDescription);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="max-h-[95vh] min-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
            <DialogTitle className="sr-only">
              {hasJobDescription ? "Update Job Description" : "Add Job Description"}
            </DialogTitle>
            
            <DialogPrimitive.Close 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10"
              onClick={handleCancel}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            {/* Header */}
            <div className="px-6 pt-6 pb-3 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {hasJobDescription ? "Update Job Description" : "Add Job Description"}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Paste the complete job description for better keyword matching and tailored recommendations
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Content */}
              <div className="flex-1 flex flex-col min-h-0 px-6 py-5 overflow-y-auto">
                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                  <Textarea
                    id="jobDescription"
                    value={tempJobDescription}
                    onChange={(e) => setTempJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="flex-1 resize-none text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-white flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  size="sm"
                >
                  {hasJobDescription ? "Update" : "Add"} Job Description
                </Button>
              </div>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default JobDescriptionDialog;

