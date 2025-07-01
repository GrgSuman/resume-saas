import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  isError
}) => {
  const [resumeName, setResumeName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(resumeName.trim() === '') {
      toast.error('Resume name is required', {
        position: 'top-right',
      })
      return
    }
    if (resumeName.trim()) {
      onSubmit(resumeName.trim())
      setResumeName('')
    }
  }

  useEffect(() => {
    if (isError) {
      toast.error("Resume name is required", {
        position: 'top-right',
      })
    }
  }, [isError])

  const handleCancel = () => {
    setResumeName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Give your resume a name to get started. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resume-name">Resume Name</Label>
              <Input
                id="resume-name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            //   disabled={!resumeName.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Resume'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewResumeForm