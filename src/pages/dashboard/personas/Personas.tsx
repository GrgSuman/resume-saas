import { useState } from "react"
import { Link } from "react-router"
import {MoreVertical,Pencil,Trash2,Info} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"

interface Persona {
  id: string
  jobTitle: string
  industry: string
  description: string
}

const samplePersonas: Persona[] = [
  {
    id: "1",
    jobTitle: "Software Engineer",
    industry: "Technology",
    description: "Full-stack developer specializing in modern web applications",
  },
  {
    id: "2",
    jobTitle: "Data Scientist",
    industry: "Technology",
    description: "Analytics professional with expertise in predictive modeling",
  },
  {
    id: "3",
    jobTitle: "UI/UX Designer",
    industry: "Design",
    description: "Creative designer focused on user-centered design solutions",
  },
  {
    id: "4",
    jobTitle: "Product Manager",
    industry: "Technology",
    description: "Strategic product leader driving innovation and growth",
  },
]

const getJobEmoji = (jobTitle: string): string => {
  const title = jobTitle.toLowerCase()
  if (title.includes("software") || title.includes("engineer") || title.includes("developer")) return "💻"
  if (title.includes("data") || title.includes("analyst") || title.includes("scientist")) return "📊"
  if (title.includes("designer") || title.includes("ui") || title.includes("ux")) return "🎨"
  if (title.includes("product") || title.includes("manager")) return "📈"
  if (title.includes("devops") || title.includes("infrastructure")) return "⚙️"
  if (title.includes("marketing") || title.includes("marketer")) return "📢"
  if (title.includes("writer") || title.includes("content")) return "✍️"
  if (title.includes("security") || title.includes("cyber")) return "🔒"
  if (title.includes("medical") || title.includes("health")) return "🏥"
  if (title.includes("teacher") || title.includes("educator")) return "👨‍🏫"
  return "💼"
}

const Personas = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [personaName, setPersonaName] = useState("")

  const handleCreatePersona = () => {
    if (personaName.trim()) {
      console.log("Create persona with name:", personaName.trim())
      setPersonaName("")
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            Job Personas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create profiles for different roles to customize your applications
          </p>
        </div>

        {/* Info Banner - Informational */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Job Personas</strong> are professional profiles that define your skills and experience for specific roles. 
              When creating an <strong className="text-gray-900 italic">auto-tailored resume or cover letter</strong>, you can <strong className="text-gray-900">select a persona</strong> that matches the job. 
              Our system uses your selected persona along with the job description to automatically customize your application materials.
            </div>
          </div>
        </div>

        {/* Grid-based Profile Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* Create New Persona Card */}
          <div
            onClick={() => setIsCreateDialogOpen(true)}
            className="group border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-slate-400 hover:bg-slate-50/50 transition-all cursor-pointer bg-white"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-3xl">➕</div>
              <div>
                <h3 className="font-medium text-sm text-slate-900 leading-tight">
                  {samplePersonas.length === 0 ? "Create your first persona" : "Add a persona"}
                </h3>
              </div>
            </div>
          </div>

          {/* Persona Cards */}
          {samplePersonas.length === 0 ? null : (
            samplePersonas.map((persona) => {
              const emoji = getJobEmoji(persona.jobTitle)
              return (
                <Link
                  key={persona.id}
                  to={`/dashboard/personas/${persona.id}`}
                  className="group border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer relative bg-white block"
                >
                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => console.log("Edit", persona.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          const confirmed = window.confirm(`Are you sure you want to delete "${persona.jobTitle}" persona?`)
                          if (confirmed) {
                            console.log("Delete persona:", persona.id, persona.jobTitle)
                            // TODO: Implement actual delete functionality
                          } else {
                            console.log("Delete cancelled")
                          }
                        }} 
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Emoji and Title */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-3xl">{emoji}</div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900 leading-tight">{persona.jobTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{persona.industry}</p>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Create Persona Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Create New Persona
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 ">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Persona Name
              </label>
              <Input
                placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && personaName.trim()) {
                    e.preventDefault()
                    handleCreatePersona()
                  }
                }}
                autoFocus
                className="h-11"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                This will be the name of your persona profile
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setPersonaName("")
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePersona}
              disabled={!personaName.trim()}
              className="flex-1"
            >
              Create Persona
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Personas
