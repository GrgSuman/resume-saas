import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, FileText, Edit, Download, Copy, Trash2 } from "lucide-react"
import { Link } from "react-router"

interface Resume {
  id: string
  title: string
  template: string
  updatedAt: string
  status: "draft" | "completed"
}

export default function Dashboard() {
  const [resumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Software Developer Resume",
      template: "modern",
      updatedAt: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      title: "Frontend Developer Resume",
      template: "creative",
      updatedAt: "2024-01-10",
      status: "draft",
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50 p-15">

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your resumes and track your job application success</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Resumes</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
                <Download className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Templates Used</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Copy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">↗</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
          <Link to="/builder/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{resume.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Updated {resume.updatedAt}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resume.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {resume.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Link to={`/builder/${resume.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Clone
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Card */}
          <Link to="/builder/new">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-48 text-gray-500 hover:text-blue-600">
                <Plus className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Create New Resume</p>
                <p className="text-sm">Start from scratch or use a template</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
