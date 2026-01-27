import React, { useState } from "react"
import { useResume } from "../../../../../../hooks/useResume"
import { Button } from "../../../../../../components/ui/button"
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"
import { Textarea } from "../../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { ResumeSectionKey } from "../../../../types/constants"
import type { Certification } from "../../../../types/resume"

const CertificationsForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<Certification[]>(state.resumeData.certifications || [])
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.CERTIFICATIONS)?.label)
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
    
    formData.forEach((certification, index) => {
      if (!certification.name?.trim()) {
        newErrors[`${index}-name`] = 'Certification name is required'
      }
      if (!certification.issuer?.trim()) {
        newErrors[`${index}-issuer`] = 'Issuer is required'
      }
      if (!certification.date?.trim()) {
        newErrors[`${index}-date`] = 'Date is required'
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
      payload: { certifications: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.CERTIFICATIONS ? { ...section, label: sectionLabel } : section) } })
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

  const handleAddCertification = () => {
    const newCertification = {
      name: "",
      issuer: "",
      dateRange: "",
      credentialId: "",
      credentialUrl: ""
    }
    setFormData(prev => [...prev, { ...newCertification, order: prev.length + 1 }])
    setHasChanges(true)
    
    // Scroll to the newly added certification form
    setTimeout(() => {
      const newCertificationElement = document.querySelector(`[data-certification-index="${formData.length}"]`)
      if (newCertificationElement) {
        newCertificationElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteCertification = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Certifications</h3>
            <p className="text-sm text-muted-foreground">List your professional certifications and credentials</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddCertification}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., Certifications, Professional Credentials"
          />
        </div>
      </div>

      {formData.map((cert, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-certification-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Certification #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteCertification(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Certification Name *</Label>
              <Input
                value={cert.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                className={`h-10 ${errors[`${index}-name`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
              {errors[`${index}-name`] && (
                <p className="text-sm text-red-500">{errors[`${index}-name`]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Issuer *</Label>
              <Input
                value={cert.issuer || ""}
                onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                className={`h-10 ${errors[`${index}-issuer`] ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., Amazon Web Services"
              />
              {errors[`${index}-issuer`] && (
                <p className="text-sm text-red-500">{errors[`${index}-issuer`]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date *</Label>
            <Input
              value={cert.date || ""}
              onChange={(e) => handleInputChange(index, 'date', e.target.value)}
              className={`h-10 ${errors[`${index}-date`] ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g., December 2023"
            />
            {errors[`${index}-date`] && (
              <p className="text-sm text-red-500">{errors[`${index}-date`]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              rows={5}
              value={cert.description || ""}
              onChange={(e) => handleInputChange(index, 'description', e.target.value)}
              className="resize-none"
              placeholder="Additional details about the certification, skills gained, or relevance to your career..."
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

export default CertificationsForm


