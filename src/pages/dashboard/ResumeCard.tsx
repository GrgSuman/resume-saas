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

const colors = [
  'bg-blue-100/70',
  'bg-purple-100/70', 
  'bg-pink-100/70',
  'bg-indigo-100/70',
  'bg-cyan-100/70',
  'bg-emerald-100/70',
  'bg-teal-100/70',
  'bg-violet-100/70',
  'bg-rose-100/70',
  'bg-sky-100/70'
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

  const queryClient = useQueryClient();

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
    alert(`Duplicate ${title}`);
  };
  
  return (
    <>
      <div onClick={() => navigate(`/dashboard/resume/${id}`)} className={`group relative cursor-pointer rounded-xl border border-gray-200 ${selectedColor} p-6 transition-all duration-300 hover:shadow-sm flex flex-col h-[220px] cursor-pointer`}>
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
                className="h-8 w-8 p-0  hover:bg-white/80 hover:text-gray-800 rounded-full cursor-pointer transition-all duration-200"
                aria-label="More"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 p-1" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={openEditModal}
                className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
              >
                <Pencil className="h-4 w-4" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDuplicate}
                className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openDeleteModal}
                className="flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="font-medium text-2xl text-gray-900 line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Date Info */}
        <div className="mt-auto">
          <p className="text-sm text-gray-600 font-medium">
            Updated {new Date(updatedAt).toLocaleDateString()}
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
