import React,{useEffect, useState} from "react";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Save, Download, Lock, Unlock } from "lucide-react";
import { useResume } from "../../context/new/ResumeContextData";

const EditorHeader = ({resumeRef}:{resumeRef:React.RefObject<HTMLDivElement | null>}) => {

  const { state, dispatch } = useResume();

  const handleBack = () => {
    // TODO: Implement back navigation
    console.log("Back button clicked");
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save button clicked");
  };

  const [shouldDownload, setShouldDownload] = useState(false);

  useEffect(()=>{
    const downloadPDF = async (htmlContent: string) => {
      const res = await fetch("http://localhost:8000/generate-pdf", {
        method: "POST",
        body: JSON.stringify({ htmlContent }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      setShouldDownload(false)
      dispatch({ type: 'RESUME_DOWNLOADING', payload: false })
    };

    if (resumeRef.current && !state.resumeEditingMode && shouldDownload) {
      dispatch({ type: 'RESUME_DOWNLOADING', payload: true })
      const html = resumeRef.current.innerHTML;
      downloadPDF(html);
    }


  },[state.resumeEditingMode,shouldDownload,resumeRef,dispatch])

  const handleDownloadPDF = () => {
    dispatch({ type: 'RESUME_EDITING_MODE', payload: false })
    setShouldDownload(true)
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Back button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Center - Edit Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={()=>dispatch({ type: 'RESUME_EDITING_MODE', payload: !state.resumeEditingMode })}
            className={`gap-2 transition-all duration-200 ${
              state.resumeEditingMode
                ? "border-green-500 text-green-600 hover:bg-green-50"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {state.resumeEditingMode ? (
              <>
                <Unlock className="h-4 w-4" />
                Edit Mode
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Preview Mode
              </>
            )}
          </Button>
        </div>

        {/* Right side - Save and Download buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            {state.resumeDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
