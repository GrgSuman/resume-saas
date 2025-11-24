
import React, { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { ResumeSectionKey } from "../../../types/constants"
import type { Project } from "../../../types/resume"
import { useResume } from "../../../../../hooks/useResume"

const ProjectsForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<Project[]>(state.resumeData.projects || [])
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.PROJECTS)?.label)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (index: number, field: string, value: string | string[]) => {
    setFormData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
    setHasChanges(true)
    
    // Clear error for this field when user starts typing
    const errorKey = `${index}-${field}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    formData.forEach((project, index) => {
      if (!project.name?.trim()) {
        newErrors[`${index}-name`] = 'Project name is required'
      }
      if (!project.achievements?.length || project.achievements.every(achievement => !achievement.trim())) {
        newErrors[`${index}-achievements`] = 'At least one achievement is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return // Don't save if validation fails
    }
    
    dispatch({ 
      type: 'UPDATE_RESUME_DATA', 
      payload: { projects: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.PROJECTS ? { ...section, label: sectionLabel } : section) } })
    }
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleSectionLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanges(true)
    setSectionLabel(e.target.value)
  }

  const handleAddAchievement = (projectIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === projectIndex 
        ? { ...item, achievements: [...(item.achievements || []), ""] }
        : item
    ))
    setHasChanges(true)
  }

  const handleUpdateAchievement = (projectIndex: number, achievementIndex: number, value: string) => {
    setFormData(prev => prev.map((item, i) => 
      i === projectIndex 
        ? { 
            ...item, 
            achievements: item.achievements?.map((achievement, aIndex) => 
              aIndex === achievementIndex ? value : achievement
            ) || []
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleDeleteAchievement = (projectIndex: number, achievementIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === projectIndex 
        ? { 
            ...item, 
            achievements: item.achievements?.filter((_, aIndex) => aIndex !== achievementIndex) || []
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleAddProject = () => {
    const newProject = {
      name: "",
      link: "",
      achievements: []
    }
    setFormData(prev => [...prev, newProject])
    setHasChanges(true)
    
    // Scroll to the newly added project form
    setTimeout(() => {
      const newProjectElement = document.querySelector(`[data-project-index="${formData.length}"]`)
      if (newProjectElement) {
        newProjectElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteProject = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Projects</h3>
            <p className="text-sm text-muted-foreground">Showcase your personal and professional projects</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., Projects, Portfolio, Key Projects"
          />
        </div>
      </div>

      {formData.map((project, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-project-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Project #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteProject(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Project Name *</Label>
              <Input
                value={project.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                className={`h-10 ${errors[`${index}-name`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., E-commerce Platform"
              />
              {errors[`${index}-name`] && (
                <p className="text-sm text-red-500">{errors[`${index}-name`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Project Link</Label>
              <Input
                value={project.link || ""}
                onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                className="h-10"
                placeholder="https://project-demo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Description & Achievements *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddAchievement(index)}
                className="h-8"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Achievement
              </Button>
            </div>
            
            <div className="space-y-2">
              {project.achievements?.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="group relative">
                  <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Textarea
                        value={achievement}
                        onChange={(e) => handleUpdateAchievement(index, achievementIndex, e.target.value)}
                        className="flex-1 min-h-[40px] max-h-[100px] resize-none border-none bg-transparent p-0 text-sm leading-relaxed focus:outline-none focus:ring-0 shadow-none"
                        placeholder="Enter an achievement..."
                        rows={1}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAchievement(index, achievementIndex)}
                      className="h-6 w-6 p-0 text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )) || []}
              
              {(!project.achievements || project.achievements.length === 0) && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No achievements added yet. Click "Add Achievement" to get started.
                </div>
              )}
            </div>
            
            {errors[`${index}-achievements`] && (
              <p className="text-sm text-red-500">{errors[`${index}-achievements`]}</p>
            )}
          </div>
        </div>
      ))}

      </div>

      {/* Fixed bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t px-6 py-3 z-10">
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsForm


