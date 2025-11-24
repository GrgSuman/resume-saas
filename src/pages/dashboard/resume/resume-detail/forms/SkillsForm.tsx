
import React, { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { SkillCategory } from "../../../types/resume"
import { useResume } from "../../../../../hooks/useResume"
import { ResumeSectionKey } from "../../../types/constants"

const SkillsForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<SkillCategory[]>(
    state.resumeData.skills.map(skillGroup => ({
      ...skillGroup,
      items: Array.isArray(skillGroup.items) ? skillGroup.items : [skillGroup.items]
    }))
  )
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.SKILLS)?.label)
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
    
    formData.forEach((skillGroup, index) => {
      const items = Array.isArray(skillGroup.items) ? skillGroup.items : [skillGroup.items]
      if (!items.length || items.every(item => !item.trim())) {
        newErrors[`${index}-items`] = 'At least one skill is required'
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
      payload: { skills: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.SKILLS ? { ...section, label: sectionLabel } : section) } })
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


  const handleAddSkill = (skillIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === skillIndex 
        ? { 
            ...item, 
            items: Array.isArray(item.items) 
              ? [...item.items, ""] 
              : [...(item.items ? [item.items] : []), ""]
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleUpdateSkill = (skillIndex: number, itemIndex: number, value: string) => {
    setFormData(prev => prev.map((item, i) => 
      i === skillIndex 
        ? { 
            ...item, 
            items: Array.isArray(item.items) 
              ? item.items.map((skill, sIndex) => 
                  sIndex === itemIndex ? value : skill
                )
              : [value]
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleDeleteSkill = (skillIndex: number, itemIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === skillIndex 
        ? { 
            ...item, 
            items: Array.isArray(item.items) 
              ? item.items.filter((_, sIndex) => sIndex !== itemIndex)
              : []
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleAddCategory = () => {
    const newCategory = {
      category: "",
      items: []
    }
    setFormData(prev => [...prev, newCategory])
    setHasChanges(true)
    
    // Scroll to the newly added category form
    setTimeout(() => {
      const newCategoryElement = document.querySelector(`[data-category-index="${formData.length}"]`)
      if (newCategoryElement) {
        newCategoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteCategory = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Skills</h3>
            <p className="text-sm text-muted-foreground">Organize your technical and professional skills by category</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skills
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., Skills, Technical Skills, Core Competencies"
          />
        </div>

      </div>

      {formData.map((skillGroup, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-category-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Skill Category #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteCategory(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Category Name</Label>
              <span className="text-xs text-muted-foreground">(leave empty for simple list without grouping)</span>
            </div>
            <Input
              value={skillGroup.category || ""}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              className="h-10"
              placeholder="Technical Skills or Soft Skills or any other category"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Skills *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddSkill(index)}
                className="h-8"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Skill
              </Button>
            </div>
            
            <div className="space-y-2">
              {Array.isArray(skillGroup.items) ? skillGroup.items.map((skill, skillItemIndex) => (
                <div key={skillItemIndex} className="group relative">
                  <div className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/50 transition-colors">
                    <Input
                      value={skill}
                      onChange={(e) => handleUpdateSkill(index, skillItemIndex, e.target.value)}
                      className="border-none bg-transparent p-0 text-sm focus:outline-none focus:ring-0 shadow-none flex-1"
                      placeholder="Enter skill..."
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSkill(index, skillItemIndex)}
                      className="h-6 w-6 p-0 text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )) : []}
              
              {(!Array.isArray(skillGroup.items) || skillGroup.items.length === 0) && (
                <div className="w-full text-center py-4 text-muted-foreground text-sm">
                  No skills added yet. Click "Add Skill" to get started.
                </div>
              )}
            </div>
            
            {errors[`${index}-items`] && (
              <p className="text-sm text-red-500">{errors[`${index}-items`]}</p>
            )}
          </div>
        </div>
        ))
      }

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

export default SkillsForm


