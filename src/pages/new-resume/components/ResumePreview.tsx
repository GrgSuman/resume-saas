import TemplateOne from "../templates/TemplateOne"

const ResumePreview = ({resumeRef}:{resumeRef:React.RefObject<HTMLDivElement | null>}) => {
 
  return (
    <div className="flex flex-col h-full">
      {/* Resume Preview */}
      <div className="flex-1 flex justify-center p-4 py-10 bg-gray-50 overflow-auto">
        <TemplateOne ref={resumeRef} />
      </div>
    </div>
  )
}

export default ResumePreview 