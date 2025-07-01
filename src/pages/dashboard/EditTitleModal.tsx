import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { toast } from 'sonner'

interface EditTitleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (newTitle: string) => void
  currentTitle: string
  isLoading?: boolean
}

const EditTitleModal: React.FC<EditTitleModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentTitle,
  isLoading = false
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle)

  useEffect(() => {
    setNewTitle(currentTitle)
  }, [currentTitle, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(newTitle.trim() === currentTitle) {
      onOpenChange(false)
      return
    }

    if(newTitle.trim() === '') {
      toast.error('Title cannot be empty', {
        position: 'top-right',
      })
      return
    }
    onSubmit(newTitle.trim())
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setNewTitle(currentTitle)
    onOpenChange(false)
  }

  const handleDropdownOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDropdownOpenChange} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Pencil className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Edit Resume Title</DialogTitle>
          </div>
          <DialogDescription>
            Update the title of your resume. This will help you identify it easily.
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
                disabled={isLoading}
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
              type="button"
              onClick={handleSubmit}
              disabled={!newTitle.trim() || newTitle.trim() === currentTitle || isLoading}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Title'}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTitleModal 