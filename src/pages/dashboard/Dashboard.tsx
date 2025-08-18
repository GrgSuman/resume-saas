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
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, deductCredits } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 
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
      deductCredits("CREATE_RESUME");
      setIsModalOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if(error.response?.data?.message === "Insufficient credits"){
          toast.info("Insufficient credits, Click to Buy credits",{
            onClick:()=>{
              navigate("/dashboard/credits");
            }
          });
        }else{
          toast.error(error.response?.data?.message || "Something went wrong", {
            position: "top-right",
          });
        }
      }
    },
  });

  const createNewResume = async (resumeName: string) => {
    mutation.mutate(resumeName);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <DashboardHeader />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome and Create Section */}
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="text-5xl font-semibold text-slate-900 mb-3">
                Hello {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-xl text-slate-600 font-medium">
                Ready to create your next resume?
              </p>
            </div>
            <Button
              onClick={openModal}
              className="px-10 py-4 cursor-pointer bg-[#7060fc] text-white font-semibold rounded-md hover:bg-[#6050e5] transition-all duration-200 shadow-sm hover:shadow-md text-md"
            >
              <Plus className="mr-1 h-6 w-6" />
              Create New Resume
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 border-3 border-slate-200 border-t-[#7060fc] rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Loading...
              </h3>
              <p className="text-slate-500">
                Please wait while we fetch your resumes
              </p>
            </div>
          )}

          {/* Resumes Grid */}
          {!isLoading && resumeData?.data?.resume?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Your Resumes ({resumeData?.data?.resume?.length})
              </h2>
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
            </div>
          )}

          {/* Empty State */}
          {!isLoading && resumeData?.data?.resume?.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                No resumes yet
              </h3>
              <p className="text-slate-600 mb-8 text-base">
                Start by creating your first resume. It only takes a few minutes
                to get started.
              </p>
              <Button
                onClick={openModal}
                className="px-10 py-4 bg-[#7060fc] text-white font-semibold rounded-lg hover:bg-[#6050e5] transition-all duration-200 shadow-sm hover:shadow-md text-lg"
              >
                <Plus className="mr-3 h-6 w-6" />
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
