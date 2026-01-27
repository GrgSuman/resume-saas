import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "../../../../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "../../../../components/ui/button";
import { Loader2 } from "lucide-react";
import axiosInstance from "../../../../api/axios";
import { cn } from "../../../../lib/utils";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface AutoResumeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const StartApplication = ({
    open,
    onOpenChange,
}: AutoResumeDialogProps) => {
    const queryClient = useQueryClient();
    const [isGenerating, setIsGenerating] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setJobDescription("");
            setErrors({});
            setIsGenerating(false);
        }
    }, [open]);


    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!jobDescription.trim()) {
            newErrors.jobDescription = "Job description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsGenerating(true);

        const data = {
            jobDescription,
        };

        try {
            await axiosInstance.post("/jobs", data);
            // Invalidate jobs query to refetch the updated list
            await queryClient.invalidateQueries({ queryKey: ["jobs"] });
            toast.success("Application created successfully", {
                position: "top-right",
            });
            onOpenChange(false); // Close dialog on success
        } catch (error) {
            toast.error("Please paste the complete job description including company name, job title, location and other details", {
                position: "top-right",
            });
            console.error("Error tracking job:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <div className="max-h-[95vh] min-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
                        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>

                        <DialogHeader className="px-6 pt-6 pb-3 flex-shrink-0 border-b border-slate-100">
                            <DialogTitle className="text-lg font-semibold text-slate-900">
                                Create Application
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Create a tailored resume and cover letter for this job
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                            {/* Scrollable Content */}
                            <div className="flex-1 flex flex-col min-h-0 px-6 py-5 overflow-y-auto">
                                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                                    <Label htmlFor="jobDescription" className="text-sm font-medium text-slate-700 flex-shrink-0">
                                        Job Description
                                    </Label>
                                    <p className="text-xs text-slate-500 mb-2">
                                        AI will extract all details automatically, so please paste the complete job description
                                    </p>
                                    <Textarea
                                        id="jobDescription"
                                        value={jobDescription}
                                        onChange={(e) => {
                                            setJobDescription(e.target.value);
                                            if (errors.jobDescription) setErrors({ ...errors, jobDescription: "" });
                                        }}
                                        placeholder="Paste the full job description here..."
                                        className={cn(
                                            "flex-1 resize-none text-sm",
                                            errors.jobDescription ? "border-red-500" : ""
                                        )}
                                    />
                                    {errors.jobDescription && (
                                        <p className="text-xs text-red-500 flex-shrink-0">{errors.jobDescription}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isGenerating}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-slate-900 text-white hover:bg-slate-800"
                                    disabled={isGenerating}
                                    size="sm"
                                >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Application"
                                )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
};

export default StartApplication;
