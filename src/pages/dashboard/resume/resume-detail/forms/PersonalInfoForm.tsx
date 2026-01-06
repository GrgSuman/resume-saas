
import React from "react"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Button } from "../../../../../components/ui/button"
import { useState } from "react"
import type { PersonalInfo } from "../../../types/resume"
import { ResumeSectionKey } from "../../../types/constants"
import { useResume } from "../../../../../hooks/useResume"

const PersonalInfoForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<PersonalInfo>(state.resumeData.personalInfo)
  const [summaryLabel, setSummaryLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.PERSONAL_INFO)?.label)
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    dispatch({ 
      type: 'UPDATE_RESUME_DATA', 
      payload: { personalInfo: formData } 
    })
    if (summaryLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.PERSONAL_INFO ? { ...section, label: summaryLabel } : section) } })
    }
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleSummaryLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanges(true)
    setSummaryLabel(e.target.value)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Enter your basic contact details and professional summary</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Full Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="h-10"
              placeholder="e.g., John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Job Title *</Label>
            <Input
              value={formData.profession || ""}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="h-10"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-10"
              placeholder="john.doe@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Phone</Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="h-10"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Address</Label>
          <Input
            value={formData.address || ""}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="h-10"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">Social Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">LinkedIn</Label>
            <Input
              value={formData.linkedin || ""}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="h-10"
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">GitHub</Label>
            <Input
              value={formData.github || ""}
              onChange={(e) => handleInputChange('github', e.target.value)}
              className="h-10"
              placeholder="github.com/username"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Website</Label>
            <Input
              value={formData.website || ""}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="h-10"
              placeholder="yourwebsite.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Twitter</Label>
            <Input
              value={formData.twitter || ""}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              className="h-10"
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Summary Section Label</Label>
          <Input
            value={summaryLabel}
            onChange={handleSummaryLabelChange}
            className="h-10"
            placeholder="e.g., Professional Summary, About Me, Profile"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Summary Content</Label>
          <Textarea
            rows={6}
            value={formData.summary || ""}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            className="resize-none"
            placeholder="Write a brief summary of your professional background and key achievements..."
          />
        </div>
      </div>

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

export default PersonalInfoForm


