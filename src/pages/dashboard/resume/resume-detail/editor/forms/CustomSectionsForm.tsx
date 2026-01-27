"use client"
import { useState } from "react"
import { useResume } from "../../../../../../hooks/useResume"
import { Button } from "../../../../../../components/ui/button"
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"
import { Textarea } from "../../../../../../components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { CustomSection } from "../../../../types/resume"

const CustomSectionsForm = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useResume()
  const [formData, setFormData] = useState<CustomSection[]>(
    (state.resumeData.customSections || []).map((section, index) => ({
      ...section,
      order: section.order ?? index,
      achievements: (section.achievements || []).map((achievement, aIndex) => ({
        ...achievement,
        order: achievement.order ?? aIndex,
      })),
    }))
  )

  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleNameChange = (index: number, value: string) => {
    setFormData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    )
    setHasChanges(true)

    // Clear error for this field when user starts typing
    const errorKey = `${index}-name`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    formData.forEach((section, index) => {
      if (!section.name?.trim()) {
        newErrors[`${index}-name`] = "Section name is required"
      }
      if (
        !section.achievements ||
        section.achievements.length === 0 ||
        section.achievements.every((item) => !item.content?.trim())
      ) {
        newErrors[`${index}-achievements`] =
          "At least one achievement item is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return // Don't save if validation fails
    }

    // Ensure all sections and achievements have proper order values
    const formattedData = formData.map((section, sIndex) => ({
      ...section,
      order: section.order ?? sIndex,
      achievements: section.achievements.map((achievement, aIndex) => ({
        ...achievement,
        order: achievement.order ?? aIndex,
      })),
    }))

    dispatch({
      type: "UPDATE_RESUME_DATA",
      payload: { customSections: formattedData },
    })
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }


  const handleAddAchievement = (sectionIndex: number) => {
    setFormData((prev) =>
      prev.map((item, i) =>
        i === sectionIndex
          ? {
              ...item,
              achievements: [
                ...item.achievements,
                {
                  order: item.achievements.length,
                  content: "",
                },
              ],
            }
          : item
      )
    )
    setHasChanges(true)
  }

  const handleUpdateAchievement = (
    sectionIndex: number,
    achievementIndex: number,
    value: string
  ) => {
    setFormData((prev) =>
      prev.map((item, i) =>
        i === sectionIndex
          ? {
              ...item,
              achievements: item.achievements.map((achievement, aIndex) =>
                aIndex === achievementIndex
                  ? { ...achievement, content: value }
                  : achievement
              ),
            }
          : item
      )
    )
    setHasChanges(true)

    // Clear error for this field when user starts typing
    const errorKey = `${sectionIndex}-achievements`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleDeleteAchievement = (
    sectionIndex: number,
    achievementIndex: number
  ) => {
    setFormData((prev) =>
      prev.map((item, i) =>
        i === sectionIndex
          ? {
              ...item,
              achievements: item.achievements
                .filter((_, aIndex) => aIndex !== achievementIndex)
                .map((achievement, newIndex) => ({
                  ...achievement,
                  order: newIndex,
                })),
            }
          : item
      )
    )
    setHasChanges(true)
  }

  const handleAddSection = () => {
    const newSection: CustomSection = {
      order: formData.length,
      name: "",
      achievements: [
        { order: 1, content: "" },
      ],
    }
    setFormData((prev) => [...prev, newSection])
    setHasChanges(true)

    // Scroll to the newly added section form
    setTimeout(() => {
      const newSectionElement = document.querySelector(
        `[data-section-index="${formData.length}"]`
      )
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleDeleteSection = (index: number) => {
    setFormData((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((section, newIndex) => ({
          ...section,
          order: newIndex,
        }))
    )
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
                Add any additional sections like languages, volunteer work, or
                publications
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={handleAddSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>


        </div>

        {formData.map((section, index) => (
          <div
            key={index}
            className="space-y-4 p-4 border rounded-lg bg-card"
            data-section-index={index}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium">
                Custom Section #{index + 1}
              </h4>
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
              <Label className="text-sm font-medium">Section Name *</Label>
              <Input
                value={section.name || ""}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className={`h-10 ${
                  errors[`${index}-name`]
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="e.g., Languages, Volunteer Work, Publications"
              />
              {errors[`${index}-name`] && (
                <p className="text-sm text-red-500">{errors[`${index}-name`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Achievements *</Label>
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
                {section.achievements && section.achievements.length > 0 ? (
                  section.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="group relative">
                      <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Textarea
                            value={achievement.content || ""}
                            onChange={(e) =>
                              handleUpdateAchievement(
                                index,
                                achievementIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 min-h-[40px] max-h-[100px] resize-none border-none bg-transparent p-0 text-sm leading-relaxed focus:outline-none focus:ring-0 shadow-none"
                            placeholder="Enter achievement content..."
                            rows={1}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteAchievement(index, achievementIndex)
                          }
                          className="h-6 w-6 p-0 text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No achievements added yet. Click "Add Achievement" to get
                    started.
                  </div>
                )}
              </div>

              {errors[`${index}-achievements`] && (
                <p className="text-sm text-red-500">
                  {errors[`${index}-achievements`]}
                </p>
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
