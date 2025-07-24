import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Paperclip, Send, X, Edit3, Sparkles } from "lucide-react";
import { useResume } from "../../../hooks/useResume";
import axiosInstance from "../../../api/axios";
import { useParams } from "react-router";

type Message = {
  id: number;
  type: "user" | "model";
  text: string;
  timestamp: Date;
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {id} = useParams();

  const { state, dispatch } = useResume();
  const resumeTitle = state?.resumeTitle || "";
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeTitle);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(()=>{
    const fetchMessages = async () => {
      try {
        setConversationLoading(true);
        const response = await axiosInstance.get(`/resumegpt/${id}`);
        setMessages(response.data.conversation.map((msg:{id:number,role:string,text:string,timestamp:Date})=>({
          id:msg.id,
          type:msg.role,
          text:msg.text,
          timestamp:new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setConversationLoading(false);
      }
    };
    fetchMessages();
  },[id])

  useEffect(() => {
    setTitleInput(resumeTitle);
  }, [resumeTitle]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() && !attachedFile) return;
    // if (attachedFile) {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       id: prev.length + 1,
    //       type: "user" as const,
    //       content: `Uploaded resume: ${attachedFile.name}`,
    //       timestamp: new Date(),
    //     },
    //   ]);
    //   setAttachedFile(null);
    // }

    let updatedMessages = [...messages];

    if (message.trim()) {
      setChatLoading(true);
      const newMessage = {
        id: messages.length + 1,
        type: "user" as const,
        text: message,
        timestamp: new Date(),
      };
      updatedMessages = [...updatedMessages, newMessage];
      setMessages(updatedMessages);
      setMessage("");
    }

    const resumeData = state?.resumeData;
    const resumeSettings = state?.resumeSettings;

    try {
      const response = await axiosInstance.post(`/resumegpt/`, {
        resumeData,
        resumeSettings,
        userPrompt: message,
        resumeId: id,
      });

      console.log(response.data.response)

      dispatch({type: 'UPDATE_RESUME_DATA', payload: response.data.response.resumeUpdates})
      dispatch({type: 'UPDATE_RESUME_SETTINGS', payload: response.data.response.settingsUpdates})

      const aiResponse = {
        id: updatedMessages.length + 1,
        type: "model" as const,
        text: response.data?.response?.message,
        timestamp: new Date(),
      };
      updatedMessages = [...updatedMessages, aiResponse];
      setMessages(updatedMessages);
      setChatLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
  };

  const removeAttachment = () => setAttachedFile(null);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header with shadow */}
      <div className="w-full bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 tracking-tight flex items-center gap-2">
            Resume Assistant
          </h2>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                className="text-sm text-gray-900 border border-blue-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 transition-shadow shadow-sm"
                value={titleInput}
                autoFocus
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={() => {
                  setEditingTitle(false);
                  if (titleInput !== resumeTitle)
                    dispatch({ type: "SET_RESUME_TITLE", payload: titleInput });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingTitle(false);
                    if (titleInput !== resumeTitle)
                      dispatch({
                        type: "SET_RESUME_TITLE",
                        payload: titleInput,
                      });
                  }
                }}
              />
            ) : (
              <>
                <span className="text-sm text-gray-700 font-medium max-w-[180px] truncate">
                  {resumeTitle}
                </span>
                <button
                  className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                  title="Edit title"
                  onClick={() => setEditingTitle(true)}
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {conversationLoading ? (
          <div className="flex flex-col items-center justify-center px-4 flex-1 animate-fade-in">
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="text-sm text-gray-600">Loading conversation...</div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center px-4 flex-none mt-5 animate-fade-in">
            <div className="mb-4">
              <Sparkles className="h-12 w-12 text-blue-200" />
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Transform Your Resume with AI
            </div>
            <div className="text-sm text-gray-600 text-center my-4 max-w-md">
              Ask for resume tips, section ideas, or upload your file for
              instant feedback. Try one of these to get started:
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-lg  p-4">
              <button
                className="rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:text-blue-700 border border-gray-200 shadow transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() =>
                  setMessage("Rewrite my work experience for impact")
                }
              >
                Rewrite work experience
              </button>
              <button
                className="rounded-full px-4 py-2 text-sm text-gray-700  bg-white shadow transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() => setMessage("Add a summary section")}
              >
                Add summary section
              </button>
              <button
                className="rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:text-blue-700 border border-gray-200 shadow transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() => setMessage("Make my resume ATS-friendly")}
              >
                Make ATS-friendly
              </button>
              <button
                className="rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:text-blue-700 border border-gray-200 shadow transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() =>
                  setMessage("Suggest skills for a software engineer")
                }
              >
                Suggest skills
              </button>
              <button
                className="rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:text-blue-700 border border-gray-200 shadow transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() => setMessage("Review my uploaded resume")}
              >
                Review my resume
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto px-6 mt-5 pb-5 light-scrollbar animate-fade-in"
            style={{
              WebkitOverflowScrolling: "touch",
              overflowAnchor: "none",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col mb-4 transform-gpu transition-all duration-300 animate-fade-in ${
                  msg.type === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed transition-all duration-300 ${
                    msg.type === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-white text-gray-800 border border-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            
            {/* Loading message from AI */}
            {chatLoading && (
              <div className="flex flex-col mb-4 transform-gpu transition-all duration-300 animate-fade-in items-start">
                <div className="max-w-[80%] whitespace-pre-wrap px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed transition-all duration-300 bg-white text-gray-800 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    {/* <span className="text-gray-600">Thinking...</span> */}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
        {/* Input Bar at Bottom */}
        <div className="px-4 pb-4 pt-2 bg-white mt-auto shadow-lg rounded-t-xl">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative bg-white border border-gray-300 rounded-xl flex items-center px-4 py-2 gap-2 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-sm">
              {/* Upload Button */}
              <label className="inline-flex items-center cursor-pointer group">
                <span className="p-1 rounded-full group-hover:bg-blue-50 transition">
                  <Paperclip className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 w-full resize-none border-0 outline-none bg-transparent px-2 py-2 text-sm min-h-[44px] max-h-32 pr-10 placeholder-gray-400"
              />
              {/* Send Button */}
              <Button
                type="submit"
                onClick={handleSendMessage}
                disabled={!message.trim() && !attachedFile}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                style={{ height: 40, width: 40 }}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {/* Show attached file name if present */}
            {attachedFile && (
              <div className="flex items-center mt-2 ml-2 text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 w-fit border border-gray-200 shadow-sm">
                <span className="mr-2 truncate max-w-xs">
                  {attachedFile.name}
                </span>
                <button
                  onClick={removeAttachment}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      {/* Custom scrollbar styles */}
      <style>{`
        .light-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .light-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 8px;
        }
        .light-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb #f8fafc;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default Chat;
