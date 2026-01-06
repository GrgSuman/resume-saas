import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Save } from "lucide-react";

const statuses = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "archived", label: "Archived" },
];

interface TrackJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrackJobForm = ({ open, onOpenChange }: TrackJobFormProps) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    jobUrl: "",
    jobDescription: "",
    status: statuses[0].value,
    statusDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        jobTitle: "",
        company: "",
        location: "",
        jobUrl: "",
        jobDescription: "",
        status: statuses[0].value,
        statusDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    if(!formData.location.trim()) {
      newErrors.location = "Location is required";
    }   
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: Implement API call to save job
    console.log("Form data:", formData);
    
    // Close dialog after successful save
    onOpenChange(false);
    // TODO: Refresh job list after successful save
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle>Track New Job</DialogTitle>
          <DialogDescription>
            Add a job application to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 pb-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-xs sm:text-sm font-medium text-slate-700">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className={errors.jobTitle ? "border-red-500" : ""}
                    />
                    {errors.jobTitle && (
                      <p className="text-xs text-red-500">{errors.jobTitle}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs sm:text-sm font-medium text-slate-700">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="e.g. Google"
                      className={errors.company ? "border-red-500" : ""}
                    />
                    {errors.company && (
                      <p className="text-xs text-red-500">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs sm:text-sm font-medium text-slate-700">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500">{errors.location}</p>
                    )}
                  </div>

                  {/* Job URL */}
                  <div className="space-y-2">
                    <Label htmlFor="jobUrl" className="text-xs sm:text-sm font-medium text-slate-700">
                      Job Posting URL <span className="text-xs text-slate-400">(optional)</span>
                    </Label>
                    <Input
                      id="jobUrl"
                      type="url"
                      value={formData.jobUrl}
                      onChange={(e) => handleChange("jobUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Status & Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs sm:text-sm font-medium text-slate-700">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date of Status */}
                  <div className="space-y-2">
                    <Label htmlFor="statusDate" className="text-xs sm:text-sm font-medium text-slate-700">
                      Date of Status
                    </Label>
                    <Input
                      id="statusDate"
                      type="date"
                      value={formData.statusDate}
                      onChange={(e) => handleChange("statusDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <Label htmlFor="jobDescription" className="text-xs sm:text-sm font-medium text-slate-700">
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => handleChange("jobDescription", e.target.value)}
                  placeholder="Paste or type the job description here..."
                  className={errors.jobDescription ? "border-red-500" : "min-h-[200px]"}
                />
                {errors.jobDescription && (
                  <p className="text-xs text-red-500">{errors.jobDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackJobForm;
