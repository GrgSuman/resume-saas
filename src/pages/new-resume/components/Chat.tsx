import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Send, Bot, User } from 'lucide-react'

const Chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI resume assistant. I can help you improve your resume, suggest better wording, or answer any questions about resume writing.',
      timestamp: new Date()
    }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: 'I understand you want to improve your resume. Could you tell me more about your experience or what specific section you\'d like help with?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
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