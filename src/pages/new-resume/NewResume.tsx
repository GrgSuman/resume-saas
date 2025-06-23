import  { useRef, useState } from 'react'
import EditorHeader from './EditorHeader'
import ResumePreview from './components/ResumePreview'
import Chat from './components/Chat'
import Settings from './components/Settings'
import { MessageSquare, Settings as SettingsIcon } from 'lucide-react'


const NewResume = () => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'settings'>('assistant')
  const resumeRef = useRef<HTMLDivElement|null>(null)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <EditorHeader resumeRef={resumeRef}/>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Resume Preview */}
        <div className="flex-1 overflow-hidden">
          <ResumePreview resumeRef={resumeRef}/>
        </div>
        
        {/* Right Side - Tabs */}
        <div className="w-1/4 border-l bg-white flex flex-col min-w-80">
          {/* Tab Navigation */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'assistant'
                  ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Assistant
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'assistant' && <Chat />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewResume