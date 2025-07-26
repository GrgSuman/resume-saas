import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Resume Title
          </DialogTitle>
          <div className="h-px w-full bg-black my-2"></div>
          <p className="text-gray-700 text-sm font-mono">
            // Update the title of your resume. This will help you identify it easily.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-700" htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
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
              disabled={!newTitle.trim() || newTitle.trim() === currentTitle || isLoading}
              className="bg-gray-900 text-white hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Title'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTitleModal 