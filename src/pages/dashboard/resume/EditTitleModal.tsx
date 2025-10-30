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
import { toast } from 'react-toastify'

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
    <Dialog open={open} onOpenChange={handleDropdownOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-foreground">
            Edit Resume Title
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-title" className="text-sm font-medium text-foreground">
              Resume Title
            </Label>
            <Input
              defaultValue={currentTitle}
              autoFocus={false}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
              disabled={isLoading}
            />
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
              disabled={!newTitle.trim() || newTitle.trim() === currentTitle || isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Title'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTitleModal 