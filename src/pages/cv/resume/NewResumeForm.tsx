import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-foreground">
            Create New Resume
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-name" className="text-sm font-medium text-foreground">
              Resume Name
            </Label>
            <Input
              id="resume-name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="eg. Health Worker Resume"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              You can change this later
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
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
              disabled={!resumeName.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : 'Create Resume'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewResumeForm