import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DashboardHeader from "../../components/layouts/DashboardHeader";
import { useAuth } from "../../hooks/useAuth";
import ResumeCard from "./ResumeCard";
import NewResumeForm from "./NewResumeForm";
import axiosInstance from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
    mutationFn: (resumeName: string) => axiosInstance.post("/resume", { title: resumeName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsModalOpen(false);
    },
  });

  const createNewResume = async (resumeName: string) => {
    mutation.mutate(resumeName);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <DashboardHeader />
      <div className="py-10
        min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome and Create Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-6xl font-medium text-gray-900 tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg text-gray-600 my-5">
                Ready to create your next resume?
              </p>
            </div>
              <Button onClick={openModal} className="cursor-pointer text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Create New Resume
              </Button>
          </div>

          {/* Resumes Grid  */}
          {
            isLoading ? <div>Loading...</div> :
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {resumeData?.data?.resume.map((data:{id:string, title:string, updatedAt:string}) => (
                <ResumeCard key={data.id} id={data.id} title={data.title} updatedAt={data.updatedAt} />
              ))}
            </div>
          }

          {/* Empty State */}
          {resumeData?.data?.resume.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md text-center">
                Create your first resume to get started with your job search.
                You can always edit, duplicate, or download your resumes later.
              </p>
                <Button onClick={openModal} className="px-6 py-3 text-white border-0 shadow-lg transition-all duration-200">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Resume
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
        isError={mutation.isError}
      />
    </div>
  );
}
