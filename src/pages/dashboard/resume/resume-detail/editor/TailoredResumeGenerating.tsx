'use client'

import { useState, useEffect, useRef } from 'react'

const thinkingMessages = [
  'Analyzing job requirements...',
  'Reviewing your experience...',
  'Matching skills to job description...',
  'Optimizing bullet points...',
  'Enhancing keywords for ATS...',
  'Crafting professional summary...',
  'Finalizing tailored resume...',
]

const TailoredResumeGenerating = () => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentMessage = thinkingMessages[currentMessageIndex] || ''
    let charIndex = 0
    setDisplayedText('')
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        // Wait a bit before moving to next message
        setTimeout(() => {
          setCurrentMessageIndex(prev => (prev + 1) % thinkingMessages.length)
        }, 1500)
      }
    }, 30)

    return () => clearInterval(typeInterval)
  }, [currentMessageIndex])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [displayedText])

  return (
    <>
    <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #374151 0%,
            #374151 30%,
            #6b7280 40%,
            #d1d5db 47%,
            #ffffff 50%,
            #d1d5db 53%,
            #6b7280 60%,
            #374151 70%,
            #374151 100%
          );
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full flex items-start justify-center pt-20 z-[9999] bg-black/30 backdrop-blur-[1px] pointer-events-auto">
        <div className="flex flex-col bg-white rounded-xl px-8 py-6 shadow-lg max-w-md w-full mx-4" style={{ backgroundColor: '#ffffff' }}>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 animate-shimmer">
              Tailoring your resume...
            </h3>
          </div>
          
          <div 
            ref={containerRef}
            className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 min-h-[60px] max-h-[200px] overflow-y-auto"
          >
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <span>
                {displayedText}
                <span className={`inline-block w-2 h-4 bg-primary ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TailoredResumeGenerating
