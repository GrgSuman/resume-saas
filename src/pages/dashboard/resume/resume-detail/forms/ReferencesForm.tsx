import React, { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { ResumeSectionKey } from "../../../types/constants"
import type { Reference } from "../../../types/resume"
import { useResume } from "../../../../../hooks/useResume"


const ReferencesForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<Reference[]>(state.resumeData.references || [])
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.REFERENCES)?.label)
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
    
    formData.forEach((reference, index) => {
      if (!reference.name?.trim()) {
        newErrors[`${index}-name`] = 'Name is required'
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
      payload: { references: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.REFERENCES ? { ...section, label: sectionLabel } : section) } })
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

  const handleAddReference = () => {
    const newReference = {
      name: "",
      position: "",
      company: "",
      email: "",
      phone: ""
    }
    setFormData(prev => [...prev, { ...newReference, order: prev.length + 1 }])
    setHasChanges(true)
    
    // Scroll to the newly added reference form
    setTimeout(() => {
      const newReferenceElement = document.querySelector(`[data-reference-index="${formData.length}"]`)
      if (newReferenceElement) {
        newReferenceElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteReference = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">References</h3>
            <p className="text-sm text-muted-foreground">Add professional references who can vouch for your work</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddReference}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., References, Professional References"
          />
        </div>
      </div>

      {formData.map((ref, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-reference-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Reference #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteReference(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name *</Label>
              <Input
                value={ref.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                className={`h-10 ${errors[`${index}-name`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., John Smith"
              />
              {errors[`${index}-name`] && (
                <p className="text-sm text-red-500">{errors[`${index}-name`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Position *</Label>
              <Input
                value={ref.position || ""}
                onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                className={`h-10 ${errors[`${index}-position`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., Senior Engineering Manager"
              />
              {errors[`${index}-position`] && (
                <p className="text-sm text-red-500">{errors[`${index}-position`]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Company *</Label>
              <Input
                value={ref.company || ""}
                onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                className={`h-10 ${errors[`${index}-company`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., Tech Corp Inc."
              />
              {errors[`${index}-company`] && (
                <p className="text-sm text-red-500">{errors[`${index}-company`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contact *</Label>
              <Input
                value={ref.contact || ""}
                onChange={(e) => handleInputChange(index, 'contact', e.target.value)}
                className="h-10"
                placeholder="john.smith@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              rows={5}
              value={ref.description || ""}
              onChange={(e) => handleInputChange(index, 'description', e.target.value)}
              className="resize-none"
              placeholder="Brief description of your professional relationship or their recommendation..."
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

export default ReferencesForm


