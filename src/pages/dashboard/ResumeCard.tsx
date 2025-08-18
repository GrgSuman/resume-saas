import { Button } from "../../components/ui/button";
import { Copy, MoreVertical, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import DeleteResumeModal from "./DeleteResumeModal";
import EditTitleModal from "./EditTitleModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const colors = [
  'from-blue-500/20 to-indigo-500/20',
  'from-purple-500/20 to-pink-500/20', 
  'from-green-500/20 to-emerald-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-teal-500/20 to-cyan-500/20',
  'from-violet-500/20 to-purple-500/20',
  'from-rose-500/20 to-pink-500/20',
  'from-sky-500/20 to-blue-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-lime-500/20 to-green-500/20'
]

const emojis = [
  '💼', '📄', '🎯', '🚀', '⭐', '💡', '🎨', '🔧', '📊', '🌟',
  '🎪', '🎭', '🎪', '🎨', '🎯', '🎪', '🎭', '🎪', '🎨', '🎯'
]

export default function ResumeCard({id, title, updatedAt}: {id: string, title: string, updatedAt: string}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { deductCredits } = useAuth();
  const queryClient = useQueryClient();

  // Duplicate Resume 
  const duplicateResumeMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/resume/duplicate`,{
      resumeId: id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      deductCredits('CLONE_RESUME');
      setIsDeleteModalOpen(false);
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
          toast.error(error.response?.data?.message || "Something went wrong",{
            position: "top-right",
          });
        }
      } 
      }
  });

  // Delete Resume Mutation
  const deleteResumeMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/resume/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsDeleteModalOpen(false);
    },
  }); 

  // Edit Resume Title Mutation
  const editResumeTitleMutation = useMutation({
    mutationFn: (newTitle: string) => axiosInstance.patch(`/resume/${id}`, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsEditModalOpen(false);
    },
  });
  
  const colorIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  const emojiIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % emojis.length;
  const selectedColor = colors[colorIndex];
  const selectedEmoji = emojis[emojiIndex];

  const handleEditTitle = (newTitle: string) => {
    editResumeTitleMutation.mutate(newTitle);
  };

  const handleDeleteResume = () => {
    deleteResumeMutation.mutate();
  };

  const openEditModal = () => {
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDuplicate = () => {
    setIsDropdownOpen(false);
    duplicateResumeMutation.mutate();
  };
  
  return (
    <>
      <div 
        onClick={() => navigate(`/dashboard/resume/${id}`)} 
        className={`group relative cursor-pointer rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20  transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[220px] bg-gradient-to-br ${selectedColor}`}
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
                onClick={handleDuplicate}
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
          <h3 className="font-semibold text-xl text-slate-900 line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Date Info */}
        <div className="mt-auto">
          <p className="text-sm text-slate-600 font-medium">
            Updated {new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Modals */}
      <EditTitleModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditTitle}
        currentTitle={title}
        isLoading={editResumeTitleMutation.isPending}
      />
      
      <DeleteResumeModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteResume}
        resumeTitle={title}
        isLoading={deleteResumeMutation.isPending}
      />
    </>
  );
}