import React from 'react'
import { Button } from '../../../components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'

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
      <DialogContent className="sm:max-w-[425px] p-0 bg-white rounded-xl border-0 shadow-xl">
        <div className="p-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Delete Resume
              </DialogTitle>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-medium text-slate-900">"{resumeTitle}"</span>? This action cannot be undone and you will lose all your resume data.
            </p>
          </DialogHeader>
          
          <div className="flex flex-row justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium border border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Deleting...' : 'Delete Resume'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteResumeModal 