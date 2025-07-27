import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { toast } from "sonner"

interface NewResumeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (resumeName: string) => void
  isLoading?: boolean
  isError?: boolean
}

const NewResumeForm: React.FC<NewResumeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [resumeName, setResumeName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(resumeName.trim() === '') {
      toast.error('Please enter a resume name')
      return
    }
    if (resumeName.trim()) {
      onSubmit(resumeName.trim())
      setResumeName('')
    }
  }

  const handleCancel = () => {
    setResumeName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]  p-6 bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Create New Resume
          </DialogTitle>
          <div className="h-px w-full bg-black my-2"></div>
          <p className="text-gray-700 text-sm font-mono">
            // Give your resume a name to get started
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-700" htmlFor="resume-name">
                Resume Name
              </Label>
              <Input
                id="resume-name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
                disabled={isLoading}
                autoFocus
                className="border border-gray-300 focus:border-gray-900 focus-visible:ring-gray-900"
              />
            </div>
          </div>
          <div className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!resumeName.trim() || isLoading}
              className="bg-gray-900 text-white hover:bg-gray-700"
            >
              {isLoading ? 'Creating...' : 'Create Resume'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewResumeForm