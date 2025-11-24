"use client"
import React, { useState } from "react"
import { useResume } from "../../../../../hooks/useResume"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { ResumeSectionKey } from "../../../types/constants"
import type { CustomSection } from "../../../types/resume"
import { Switch } from "../../../../../components/ui/switch"

const CustomSectionsForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<CustomSection[]>(state.resumeData.customSections || [])
  const [sectionLabel, setSectionLabel] = useState(state.resumeSettings.sections?.find(section => section.key === ResumeSectionKey.CUSTOM_SECTIONS)?.label)
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
    
    formData.forEach((section, index) => {
      if (!section.label?.trim()) {
        newErrors[`${index}-label`] = 'Section title is required'
      }
      const content = Array.isArray(section.content) ? section.content : [section.content || ""]
      if (!content.length || content.every(item => !item.trim())) {
        newErrors[`${index}-content`] = 'At least one content item is required'
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
      payload: { customSections: formData } 
    })
    if (sectionLabel) {
      dispatch({ type: 'UPDATE_RESUME_SETTINGS', payload: { sections: state.resumeSettings.sections?.map(section => section.key === ResumeSectionKey.CUSTOM_SECTIONS ? { ...section, label: sectionLabel, customSectionsMode: 'mixed' } : section) } })
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

  const handleToggleMode = (index: number, isListMode: boolean) => {
    setFormData(prev => prev.map((item, i) => 
      i === index 
        ? { 
            ...item, 
            isListMode,
            // Convert between list and description formats
            content: isListMode 
              ? (typeof item.content === 'string' ? [item.content] : item.content)
              : (Array.isArray(item.content) ? item.content.join('\n') : item.content)
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleAddContent = (sectionIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === sectionIndex 
        ? { 
            ...item, 
            content: Array.isArray(item.content) 
              ? [...item.content, ""] 
              : [item.content || "", ""]
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleUpdateContent = (sectionIndex: number, contentIndex: number, value: string) => {
    setFormData(prev => prev.map((item, i) => 
      i === sectionIndex 
        ? { 
            ...item, 
            content: Array.isArray(item.content) 
              ? item.content.map((content, cIndex) => cIndex === contentIndex ? value : content)
              : [value]
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleDeleteContent = (sectionIndex: number, contentIndex: number) => {
    setFormData(prev => prev.map((item, i) => 
      i === sectionIndex 
        ? { 
            ...item, 
            content: Array.isArray(item.content) 
              ? item.content.filter((_, cIndex) => cIndex !== contentIndex)
              : []
          }
        : item
    ))
    setHasChanges(true)
  }

  const handleAddSection = () => {
    const newSection = {
      label: "",
      content: [],
      isListMode: true // Default to list mode
    }
    setFormData(prev => [...prev, newSection])
    setHasChanges(true)
    
    // Scroll to the newly added section form
    setTimeout(() => {
      const newSectionElement = document.querySelector(`[data-section-index="${formData.length}"]`)
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleDeleteSection = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  return (
    <div className="relative">
      <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Custom Sections</h3>
            <p className="text-sm text-muted-foreground">
              Add any additional sections like languages, volunteer work, or publications
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Section Label</Label>
          <Input
            value={sectionLabel}
            onChange={handleSectionLabelChange}
            className="h-10"
            placeholder="e.g., Custom Sections, Additional Information"
          />
        </div>
      </div>

      {formData.map((section, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card" data-section-index={index}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium">Custom Section #{index + 1}</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteSection(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Section Title *</Label>
            <Input
              value={section.label || ""}
              onChange={(e) => handleInputChange(index, 'label', e.target.value)}
              className={`h-10 ${errors[`${index}-label`] ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g., Languages, Volunteer Work, Publications"
            />
            {errors[`${index}-label`] && (
              <p className="text-sm text-red-500">{errors[`${index}-label`]}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Content Format</Label>
                <p className="text-xs text-muted-foreground">
                  {section.isListMode ? 'List items (bullet points)' : 'Simple description'}
                </p>
              </div>
              <Switch
                checked={section.isListMode ?? true}
                onCheckedChange={(checked) => handleToggleMode(index, checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            {section.isListMode ? (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Content *</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddContent(index)}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {Array.isArray(section.content) ? section.content.map((content, contentIndex) => (
                    <div key={contentIndex} className="group relative">
                      <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Textarea
                            value={content}
                            onChange={(e) => handleUpdateContent(index, contentIndex, e.target.value)}
                            className="flex-1 min-h-[40px] max-h-[100px] resize-none border-none bg-transparent p-0 text-sm leading-relaxed focus:outline-none focus:ring-0 shadow-none"
                            placeholder="Enter content..."
                            rows={1}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteContent(index, contentIndex)}
                          className="h-6 w-6 p-0 text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No content added yet. Click "Add Item" to get started.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description *</Label>
                <Textarea
                  value={typeof section.content === 'string' ? section.content : ''}
                  onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                  className={`resize-none ${errors[`${index}-content`] ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter a description for this section..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Write a simple description or paragraph for this section.
                </p>
              </div>
            )}
            
            {errors[`${index}-content`] && (
              <p className="text-sm text-red-500">{errors[`${index}-content`]}</p>
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

export default CustomSectionsForm


