import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Copy, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router";
import DashboardHeader from "../../components/layouts/DashboardHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth"
import axiosInstance from "../../api/axios";

interface Resume {
  id: string;
  title: string;
  template: string;
  updatedAt: string;
  color?: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [resumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Software Developer Resume of Suman Gupta",
      template: "modern",
      updatedAt: "2024-01-15",
      color: "bg-blue-50"
    },
  ]);

  return (
    <div>
      <DashboardHeader />
      <div className="py-10 bg-gradient-to-b from-white via-purple-50 to-purple-200 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome and Create Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-6xl font-medium text-gray-900 tracking-tight">
                Welcome back, {user?.email}!
              </h1>
              <p className="text-lg text-gray-600 my-5">
                Ready to create your next resume?
              </p>
            </div>
            {resumes.length > 0 && <Link to="/dashboard/new">
              <Button className="cursor-pointer text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Create New Resume
              </Button>
            </Link>}
          </div>

          <Button onClick={async () => {
            try {
              const res = await axiosInstance.get('/auth/get-user');
              console.log(res);
            } catch (error) {
              console.log("error is:", error);
            }
          }}>
            Get User
          </Button> 

          {/* Resumes Grid - 3 Cards Per Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="group relative rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-lg flex flex-col max-h-[180px] min-h-[180px]"
                >
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
                      <DropdownMenuContent  className="w-44 p-1">
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Edit title for ${resume.title}`)
                          }
                          className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit title
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`Duplicate ${resume.title}`)}
                          className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
                        >
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => alert(`Delete ${resume.title}`)}
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
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Updated {resume.updatedAt}
                    </p>
                  </div>

                  {/* Main Action: Open Resume - Always at bottom */}
                  <div className="mt-auto">
                    <Link to={`/dashboard/new`} className="w-full">
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
              ))}
            </div>

          {/* Empty State - Google Keep Style */}
          {resumes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 shadow-md">
                  <Plus className="h-10 w-10 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md text-center">
                Create your first resume to get started with your job search. 
                You can always edit, duplicate, or download your resumes later.
              </p>
              <Link to="/dashboard/new">
                <Button
                  className="px-6 py-3 text-white border-0 shadow-lg transition-all duration-200"
                
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Resume
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
