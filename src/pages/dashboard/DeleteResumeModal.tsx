import React from 'react'
import { Button } from '../../components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

interface DeleteResumeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  resumeTitle: string
  isLoading?: boolean
}

const DeleteResumeModal: React.FC<DeleteResumeModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  resumeTitle,
  isLoading = false
}) => {
  
  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Delete Resume
          </DialogTitle>
          <div className="h-px w-full bg-black my-2"></div>
          <p className="text-gray-700 text-sm ">
            Are you sure you want to delete "<span className="font-medium">{resumeTitle}</span>"? This action cannot be undone.
          </p>
        </DialogHeader>
        
        <div className="flex flex-row justify-end gap-3 mt-6">
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
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Deleting...' : 'Delete Resume'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteResumeModal 