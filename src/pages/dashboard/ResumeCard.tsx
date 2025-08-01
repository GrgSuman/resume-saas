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
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

const colors = [
  'bg-[#00E0C6]/20',
  'bg-yellow-400/20', 
  'bg-blue-400/20',
  'bg-red-400/20',
  'bg-purple-400/20',
  'bg-green-400/20',
  'bg-pink-400/20',
  'bg-indigo-400/20',
  'bg-orange-400/20',
  'bg-teal-400/20'
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
        toast.error(error.response?.data?.message || "Something went wrong",{
          position: "top-right",
        });
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
        className={`group relative cursor-pointer rounded-lg border-2 border-black ${selectedColor} p-6 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[220px]`}
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
                className="h-8 w-8 p-0 border-2 border-black hover:bg-black hover:text-white rounded-full transition-all duration-200"
                aria-label="More"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-44 p-1 border-2 border-black bg-white" 
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={openEditModal}
                className="flex items-center gap-2 px-2 py-2 text-sm font-bold hover:bg-black hover:text-white rounded-none"
              >
                <Pencil className="h-4 w-4" />
                EDIT TITLE
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDuplicate}
                className="flex items-center gap-2 px-2 py-2 text-sm font-bold hover:bg-black hover:text-white rounded-none"
              >
                <Copy className="h-4 w-4" />
                CLONE RESUME
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openDeleteModal}
                className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-red-600 hover:bg-black hover:text-white rounded-none"
              >
                <Trash2 className="h-4 w-4" />
                DELETE
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-tight uppercase">
            {title}
          </h3>
        </div>

        {/* Date Info */}
        <div className="mt-auto">
          <p className="text-sm text-gray-700 font-bold">
            UPDATED {new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
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