import TemplateOne from "../templates/TemplateOne"
import TemplateTwo from "../templates/TemplateTwo"
import TemplateThree from "../templates/TemplateThree"
import { useResume } from "../../../hooks/useResume"

const ResumePreview = ({resumeRef}:{resumeRef:React.RefObject<HTMLDivElement | null>}) => {

  const {state} = useResume()

  
  return (
    <div className="flex flex-col h-full">
      {/* Resume Preview */}
      <div className="flex-1 flex justify-center p-4 py-10 bg-gray-50 overflow-auto">
          {state.resumeSettings.template === "Creative" ? <TemplateOne ref={resumeRef} /> : null}
          {state.resumeSettings.template === "Professional" ? <TemplateTwo ref={resumeRef} /> : null}
          {state.resumeSettings.template === "Two Column" ? <TemplateThree ref={resumeRef} /> : null}
      </div>
    </div>
  )
}

export default ResumePreview 