import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Send, Bot, User } from 'lucide-react'
import { useResume } from '../../../hooks/useResume'
import axiosInstance from '../../../api/axios'

const Chat = () => {
  const { state, dispatch } = useResume();
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI resume assistant. I can help you improve your resume, suggest better wording, or answer any questions about resume writing.',
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async (userPrompt:string) => {
    const {resumeData,resumeSettings} = state
    dispatch({type: 'SET_LOADING', payload: true});
    try{
      const response = await axiosInstance.post('/resumegpt/', {resumeData,resumeSettings,userPrompt})
      dispatch({type: 'UPDATE_RESUME_DATA', payload: response.data.resume.resumeData})
      dispatch({type: 'UPDATE_RESUME_SETTINGS', payload: response.data.resume.resumeSettings})
      dispatch({type: 'SET_LOADING', payload: false});
      console.log(response.data)
      return response.data.resume.message
    }catch(error){
      console.error('Error sending message:', error)
    }
  }

  const handleSendMessage = async() => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])
    setMessage('')

    const aiResponseMsg = await sendMessage(message)

    const aiResponse = {
      id: messages.length + 2,
      type: 'bot' as const,
      content: aiResponseMsg,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="h-5 w-5 text-teal-600" />
        <h3 className="font-semibold">AI Assistant</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-teal-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.type === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your resume..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Chat