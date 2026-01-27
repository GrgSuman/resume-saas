import React, { useState } from "react"
import { useResume } from "../../../../../../hooks/useResume"
import { Button } from "../../../../../../components/ui/button"
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"
import { Textarea } from "../../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { ResumeSectionKey } from "../../../../types/constants"
import type { Education } from "../../../../types/resume"

const EducationForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<Education[]>(state.resumeData.education)
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.EDUCATION)?.label)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (index: number, field: string, value: string) => {
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
    
    formData.forEach((education, index) => {
      if (!education.degree?.trim()) {
        newErrors[`${index}-degree`] = 'Degree is required'
      }
      if (!education.institution?.trim()) {
        newErrors[`${index}-institution`] = 'Institution is required'
      }
      if (!education.dateRange?.trim()) {
        newErrors[`${index}-dateRange`] = 'Date range is required'
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
      payload: { education: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.EDUCATION ? { ...section, label: sectionLabel } : section) } })
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

  const handleAddEducation = () => {
    const newEducation: Education = {
      order: formData.length + 1,
      degree: "",
      institution: "",
      dateRange: "",
      grade: "",
      description: ""
    }
    setFormData(prev => [...prev, { ...newEducation, order: prev.length + 1 }])
    setHasChanges(true)
    
    // Scroll to the newly added education form
    setTimeout(() => {
      const newEducationElement = document.querySelector(`[data-education-index="${formData.length}"]`)
      if (newEducationElement) {
        newEducationElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteEducation = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Education</h3>
            <p className="text-sm text-muted-foreground">Add your academic qualifications and achievements</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddEducation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., Education, Academic Background"
          />
        </div>
      </div>

      {formData.map((edu, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-education-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Education #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteEducation(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                className={`h-10 ${errors[`${index}-degree`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
              {errors[`${index}-degree`] && (
                <p className="text-sm text-red-500">{errors[`${index}-degree`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Institution *</Label>
              <Input
                value={edu.institution}
                onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                className={`h-10 ${errors[`${index}-institution`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., University of California, Berkeley"
              />
              {errors[`${index}-institution`] && (
                <p className="text-sm text-red-500">{errors[`${index}-institution`]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range *</Label>
              <Input
                value={edu.dateRange}
                onChange={(e) => handleInputChange(index, 'dateRange', e.target.value)}
                className={`h-10 ${errors[`${index}-dateRange`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., 2018 - 2022"
              />
              {errors[`${index}-dateRange`] && (
                <p className="text-sm text-red-500">{errors[`${index}-dateRange`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">GPA</Label>
              <Input
                value={edu.grade || ""}
                onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                className="h-10"
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              rows={5}
              value={edu.description || ""}
              onChange={(e) => handleInputChange(index, 'description', e.target.value)}
              className="resize-none"
              placeholder="Additional details about your education, honors, or relevant coursework..."
            />
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

export default EducationForm


