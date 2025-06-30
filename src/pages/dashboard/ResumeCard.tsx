import { Button } from "../../components/ui/button";
import { Edit, Copy, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";


export default function ResumeCard({id, title, updatedAt}: {id: string, title: string, updatedAt: string}) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-lg flex flex-col max-h-[180px] min-h-[180px]">
      {/* Dropdown Menu */}
      <div className="absolute top-3 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="More"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 p-1">
            <DropdownMenuItem
              onClick={() => alert(`Edit title for ${title}`)}
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
            >
              <Pencil className="h-4 w-4" />
              Edit title
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`Duplicate ${title}`)}
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`Delete ${title}`)}
              className="flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Content - Takes up available space */}
      <div className="flex-1 mb-3">
        <h3 className="font-medium pr-5 text-lg text-gray-900 line-clamp-2 mb-1">
            {title}
        </h3>
        <p className="text-sm text-gray-500">
          Updated {new Date(updatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Main Action: Open Resume - Always at bottom */}
      <div className="mt-auto">
        <Link to={`/dashboard/resume/${id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full text-sm justify-center rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Open Resume
          </Button>
        </Link>
      </div>
    </div>
  );
}
