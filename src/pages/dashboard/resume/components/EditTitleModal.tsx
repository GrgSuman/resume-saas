import React, { useState, useEffect } from 'react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '../../../../components/ui/dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
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

  useEffect(() => {
    if (open) {
      setNewTitle(currentTitle)
    }
  }, [open, currentTitle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(newTitle.trim() === currentTitle) {
      onOpenChange(false)
      return
    }

    if(newTitle.trim() === '') {
      toast.error('Resume name cannot be empty', {
        position: 'top-right',
      })
      return
    }
    onSubmit(newTitle.trim())
  }

  const handleCancel = () => {
    setNewTitle(currentTitle)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white shadow-xl rounded-lg border border-slate-200">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 z-10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Edit Resume Name
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col min-h-0 px-6 pt-0 pb-4 overflow-y-auto">
                <div className="max-w-xl mx-auto w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">
                      Resume Name
                    </label>
                    <Input
                      placeholder="e.g. Software Engineer Resume"
                      value={newTitle}
                      autoFocus
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTitle.trim() && newTitle.trim() !== currentTitle && !isLoading) {
                          e.preventDefault()
                          const form = e.currentTarget.closest('form')
                          if (form) {
                            form.requestSubmit()
                          }
                        }
                      }}
                      className="h-11 shadow-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 px-6 pt-4 pb-4 bg-white flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newTitle.trim() || newTitle.trim() === currentTitle || isLoading}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  size="sm"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export default EditTitleModal 