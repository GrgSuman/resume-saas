import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import axiosInstance from "../../../../api/axios";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Save } from "lucide-react";
import type { Job } from "../../types/jobs";

const jobTypes = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

interface TrackJobFormEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

const TrackJobFormEdit = ({ open, onOpenChange, job }: TrackJobFormEditProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    jobUrl: "",
    companyUrl: "",
    jobType: jobTypes[0].value,
    jobDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill form when job is provided or reset when dialog closes
  useEffect(() => {
    if (open && job) {
      // Prefill with job data
      setFormData({
        jobTitle: job.title || "",
        company: job.companyName || "",
        location: job.location || "",
        jobUrl: job.jobUrl || "",
        companyUrl: job.companyUrl || "",
        jobType: job.jobType || jobTypes[0].value,
        jobDescription: job.jobDescription || "",
      });
      setErrors({});
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        jobTitle: "",
        company: "",
        location: "",
        jobUrl: "",
        companyUrl: "",
        jobType: jobTypes[0].value,
        jobDescription: "",
      });
      setErrors({});
    }
  }, [open, job]);

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

  const updateJobMutation = useMutation({
    mutationFn: async (data: {title: string, companyName: string, location: string, jobUrl: string | null, companyUrl: string | null, jobType: string, jobDescription: string}) => {
      if (!job?.id) {
        throw new Error("Job ID is required");
      }
      const response = await axiosInstance.patch(`/jobs/${job.id}`, {
        job: {
          title: data.title,
          companyName: data.companyName,
          location: data.location,
          jobUrl: data.jobUrl,
          companyUrl: data.companyUrl,
          jobType: data.jobType,
          jobDescription: data.jobDescription,
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", job?.id] });
      toast.success("Job updated successfully!", {
        position: "top-right",
      });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update job", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to update job", {
          position: "top-right",
        });
      }
    },
  });

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
    if (!job?.id) {
      toast.error("Job ID is required", {
        position: "top-right",
      });
      return;
    }

    const data = {
      title: formData.jobTitle,
      companyName: formData.company,
      location: formData.location,
      jobUrl: formData.jobUrl,
      companyUrl: formData.companyUrl,
      jobType: formData.jobType,
      jobDescription: formData.jobDescription,
    };
    updateJobMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Update job application details
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Site URL */}
                  <div className="space-y-2">
                    <Label htmlFor="companyUrl" className="text-xs sm:text-sm font-medium text-slate-700">
                      Company Website <span className="text-xs text-slate-400">(optional)</span>
                    </Label>
                    <Input
                      id="companyUrl"
                      type="url"
                      value={formData.companyUrl}
                      onChange={(e) => handleChange("companyUrl", e.target.value)}
                      placeholder="https://company.com"
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <Label htmlFor="jobType" className="text-xs sm:text-sm font-medium text-slate-700">
                      Job Type
                    </Label>
                    <Select
                      value={formData.jobType}
                      onValueChange={(value) => handleChange("jobType", value)}
                    >
                      <SelectTrigger id="jobType" value={formData.jobType}  className="w-full">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-xs sm:text-sm font-medium text-slate-700">
                  Job Description <span className="text-red-500">*</span>
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
            <Button 
              type="submit" 
              className="gap-2"
              disabled={updateJobMutation.isPending}
            >
              <Save className="h-4 w-4" />
              {updateJobMutation.isPending ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackJobFormEdit;
