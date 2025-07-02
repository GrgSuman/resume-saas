import React,{useEffect, useState} from "react";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Download, Eye, Edit3 } from "lucide-react";
import { useResume } from "../../hooks/useResume";
import { useNavigate } from "react-router";
// import { toast } from "sonner";

const EditorHeader = ({resumeRef}:{resumeRef:React.RefObject<HTMLDivElement | null>}) => {

  const { state, dispatch } = useResume();
  const navigate = useNavigate();
  // const handleSave = () => {
  //   toast.success("All changes saved",{
  //     duration: 3000,
  //     position: "top-center",
  //   })
  // };

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
      dispatch({ type: 'SET_DOWNLOADING', payload: false })
    };

    if (resumeRef.current && !state?.resumeEditingMode && shouldDownload) {
      dispatch({ type: 'SET_DOWNLOADING', payload: true })
      const html = resumeRef.current.innerHTML;
      downloadPDF(html);
    }


  },[state?.resumeEditingMode,shouldDownload,resumeRef,dispatch])

  const handleDownloadPDF = () => {
    dispatch({ type: 'SET_EDITING_MODE', payload: false })
    setShouldDownload(true)
  };

  const toggleEditMode = () => {
    dispatch({ type: 'SET_EDITING_MODE', payload: !state?.resumeEditingMode })
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className=" flex h-14 items-center justify-between px-4">
        {/* Left side - Back button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={()=>navigate("/dashboard")}
            className="gap-2 text-gray-600 hover:text-black hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Center - Edit Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Toggle Switch */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                state?.resumeEditingMode
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                !state?.resumeEditingMode
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Right side - Save and Download buttons */}
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Save className="h-4 w-4" />
            Save
          </Button> */}
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={state?.resumeDownloading}
            className="gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Download className={`h-4 w-4 transition-transform duration-300 ${
              state?.resumeDownloading ? 'animate-bounce' : 'group-hover:translate-y-[-2px]'
            }`} />
            <span className="transition-all duration-300">
              {state?.resumeDownloading ? "Downloading..." : "Download PDF"}
            </span>
            {state?.resumeDownloading && (
              <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
