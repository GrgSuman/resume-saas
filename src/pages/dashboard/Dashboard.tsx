import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DashboardHeader from "../../components/layouts/DashboardHeader";
import { useAuth } from "../../hooks/useAuth";
import ResumeCard from "./ResumeCard";
import NewResumeForm from "./NewResumeForm";
import axiosInstance from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
  data: resumeData,
    isLoading,
    // isError,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => axiosInstance.get("/resume/user"),
  });

  const mutation = useMutation({
    mutationFn: (resumeName: string) =>
      axiosInstance.post("/resume", { title: resumeName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Something went wrong",{
        position: "top-right",
      });
    } 
    }
  });

  const createNewResume = async (resumeName: string) => {
    mutation.mutate(resumeName);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white">
      <DashboardHeader />
      <div className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome and Create Section */}
          <div className="mb-8 border-b-2 border-black pb-6">
            <div className="mb-6">
              <h1 className="text-5xl font-black uppercase mb-3 tracking-tight">
                Welcome back, {user?.name}
              </h1>
              <p className="text-base text-gray-600 font-mono">
                // Ready to create your next resume?
              </p>
            </div>
            <Button
              onClick={openModal}
              className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wide border-2 border-black hover:bg-[#00E0C6] hover:text-black transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="border-4 border-black p-8 text-center">
              <h3 className="text-2xl font-black uppercase mb-4">LOADING...</h3>
              <div className="h-1 w-full bg-black mb-6"></div>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}

          {/* Resumes Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumeData?.data?.resume.map(
                (data: { id: string; title: string; updatedAt: string }) => (
                  <ResumeCard
                    key={data.id}
                    id={data.id}
                    title={data.title}
                    updatedAt={data.updatedAt}
                  />
                )
              )}
            </div>
          )}
          {!isLoading && resumeData?.data?.resume.length === 0 && (
            <div className="text-center max-w-2xl mx-auto ">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter">
                No resumes yet
              </h3>
              <div className="h-1 w-16 bg-black mx-auto mb-6"></div>
              <p className="text-gray-700 mb-6 text-base">
                Start by creating your first resume. It only takes a few minutes
                to get started.
              </p>
              <Button
                onClick={openModal}
                className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wide border-2 border-black hover:bg-[#00E0C6] hover:text-black transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Resume
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewResumeForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={createNewResume}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
