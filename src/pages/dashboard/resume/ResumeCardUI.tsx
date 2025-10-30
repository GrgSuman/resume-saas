"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { Copy, MoreVertical, Trash2, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import EditTitleModal from "./EditTitleModal";
import DeleteResumeModal from "./DeleteResumeModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
// import { useAuth } from "../../../hooks/useAuth";

interface ResumeCardUIProps {
  resume: {
    id: string;
    title: string;
    updatedAt: string;
  };
}

const colors = [
  '#E3F2FD', // Light Blue (calm)
  '#F3E5F5', // Lavender (soft purple)
  '#E8F5E9', // Mint Green (fresh)
  '#FFF3E0', // Soft Orange (warm)
  '#E0F7FA', // Aqua (cool + clean)
  '#FFF0F6', // Pink Tint (gentle)
  '#FFFDE7', // Pale Yellow (cheerful)
  '#F9FBE7', // Soft Lime (energetic but subtle)
  '#F1F8E9', // Green Tint (natural)
  '#ECEFF1', // Cool Gray (neutral)
]


const emojis = [
  '💼', '📄', '🎯', '🚀', '⭐', '💡', '🎨', '🔧', '📊', '🌟',
  '🎪', '🎭', '🎪', '🎨', '🎯', '🎪', '🎭', '🎪', '🎨', '🎯'
]

const ResumeCardUI = ({ resume }: ResumeCardUIProps) => {
  const [isEditTitleOpen, setIsEditTitleOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { deductCredits } = useAuth();


  // Edit title mutation
  const editTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const response = await axiosInstance.patch(`/resume/${resume.id}`, {
        title: newTitle
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Resume title updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsEditTitleOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update title. Please try again.");
      console.error("Error updating title:", error);
    }
  });

  // Duplicate Resume 
  const cloneResumeMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/resume/duplicate`,{
      resumeId: resume.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      // deductCredits('CLONE_RESUME');
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if(error.response?.data?.message === "Insufficient credits"){
          toast.info("Insufficient credits, Click to Buy credits");
          setTimeout(() => {
            navigate("/dashboard/credits");
          }, 2000);
        }else{
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      }
    }
  });

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/resume/${resume.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsDeleteModalOpen(false);
    },
  });

  const colorIndex = Math.abs(resume.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  const emojiIndex = Math.abs(resume.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % emojis.length;
  const selectedColor = colors[colorIndex];
  const selectedEmoji = emojis[emojiIndex];

  const handleEditTitle = (newTitle: string) => {
    editTitleMutation.mutate(newTitle);
  };

  const handleDeleteResume = () => {
    deleteResumeMutation.mutate();
  };

  const openEditModal = () => {
    setIsDropdownOpen(false);
    setIsEditTitleOpen(true);
  };

  const openDeleteModal = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleClone = () => {
    setIsDropdownOpen(false);
    cloneResumeMutation.mutate();
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/dashboard/resume/${resume.id}`)} 
        className="group relative cursor-pointer rounded-2xl backdrop-blur-sm border  transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[220px]"
        style={{ backgroundColor: selectedColor }}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{selectedEmoji}</span>
          
          {/* Dropdown Menu */}
          <DropdownMenu 
            open={isDropdownOpen} 
            onOpenChange={(open) => {
              setIsDropdownOpen(open);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/40 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200"
                aria-label="More"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-44 p-1 border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={openEditModal}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleClone}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                Clone Resume
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openDeleteModal}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
            {resume.title}
          </h3>
        </div>

        {/* Date Info */}
        <div className="mt-auto">
          <p className="text-sm text-slate-600 font-medium">
            Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Modals */}
      <EditTitleModal
        open={isEditTitleOpen}
        onOpenChange={setIsEditTitleOpen}
        onSubmit={handleEditTitle}
        currentTitle={resume.title}
        isLoading={editTitleMutation.isPending}
      />
      
      <DeleteResumeModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteResume}
        resumeTitle={resume.title}
        isLoading={deleteResumeMutation.isPending}
      />
    </>
  );
};

export default ResumeCardUI;

