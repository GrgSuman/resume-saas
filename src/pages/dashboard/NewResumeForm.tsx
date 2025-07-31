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
import { motion } from 'framer-motion'
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
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Create New Resume
            </DialogTitle>
            <div className="h-px w-full bg-gray-200 my-4"></div>
            <p className="text-gray-700 text-sm">
              Give your resume a descriptive name to get started
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
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
                  className="border-gray-300 focus:border-gray-700 focus:ring-gray-900 shadow-sm"
                />
                <p className="text-xs text-gray-500">
                  You can change this later
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!resumeName.trim() || isLoading}
                className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : 'Create Resume'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default NewResumeForm