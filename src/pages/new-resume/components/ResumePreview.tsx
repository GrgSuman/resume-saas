import TemplateOne from "../templates/TemplateOne"
import { useResume } from "../../../context/ResumeContext"

const ResumePreview = ({resumeRef}:{resumeRef:React.RefObject<HTMLDivElement | null>}) => {
  const { resumeData } = useResume();
  return (
    <div className=" flex justify-center p-4 py-10 bg-gray-50 h-full overflow-auto" contentEditable={false}>
      <TemplateOne ref={resumeRef} data={resumeData} />
    </div>
  )
}

export default ResumePreview 