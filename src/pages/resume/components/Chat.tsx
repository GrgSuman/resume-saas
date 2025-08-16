import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Send, X, Edit3, Bot } from "lucide-react";
import { useResume } from "../../../hooks/useResume";
import axiosInstance from "../../../api/axios";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

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
  const { id } = useParams();
  const { state, dispatch } = useResume();
  const resumeTitle = state?.resumeTitle || "";
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeTitle);
  const { deductCredits } = useAuth();
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversation history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setConversationLoading(true);
        const response = await axiosInstance.get(`/resumegpt/${id}`);
        setMessages(
          response.data.conversation.map(
            (msg: {
              id: number;
              role: string;
              text: string;
              timestamp: Date;
            }) => ({
              id: msg.id,
              type: msg.role as "user" | "model",
              text: msg.text,
              timestamp: new Date(msg.timestamp),
            })
          )
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to fetch conversation",
            {
              position: "top-right",
            }
          );
        }
      } finally {
        setConversationLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  // Sync title input with resume title
  useEffect(() => {
    setTitleInput(resumeTitle);
  }, [resumeTitle]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() && !attachedFile) return;

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

      dispatch({
        type: "UPDATE_RESUME_DATA",
        payload: response.data.response.resumeUpdates,
      });
      dispatch({
        type: "UPDATE_RESUME_SETTINGS",
        payload: response.data.response.settingsUpdates,
      });

      const aiResponse = {
        id: updatedMessages.length + 1,
        type: "model" as const,
        text: response.data?.response?.message,
        timestamp: new Date(),
      };
      updatedMessages = [...updatedMessages, aiResponse];
      setMessages(updatedMessages);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "Insufficient credits") {
          console.log("Insufficient credits");
          deductCredits();
        }
        toast.error(error.response?.data?.message || "Failed to send message", {
          position: "top-right",
        });
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeAttachment = () => setAttachedFile(null);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white px-6 py-4 border-b-2 border-gray-200 sticky top-0 z-10  flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            Resume Assistant
          </h2>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                className="text-sm text-gray-900 border border-[#00E0C6] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#00E0C6]"
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
                  className="text-gray-500 hover:text-[#00E0C6] p-1 rounded hover:bg-gray-100 transition"
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {conversationLoading ? (
          <div className="flex flex-col items-center justify-center px-4 flex-1">
            <div className="mb-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00E0C6] rounded-full animate-spin"></div>
            </div>
            <div className="text-sm text-gray-600">Loading conversation...</div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center px-6 flex-1">
            {/* Quick Actions */}
             <div className="w-full max-w-3xl mx-auto mb-8">
               <h2 className="text-lg font-semibold text-gray-800 mb-4">
                 Quick Actions
               </h2>
               <div className="grid grid-cols-2 gap-3">
                 {[
                   {
                     title: "Rewrite my work experience",
                     icon: "💼"
                   },
                   {
                     title: "Add a summary section",
                     icon: "📝"
                   },
                   {
                     title: "Make it ATS-friendly",
                     icon: "🎯"
                   },
                   {
                     title: "Suggest skills",
                     icon: "⚡"
                   },
                   {
                     title: "Review my resume",
                     icon: "🔍"
                   },
                   {
                     title: "Improve formatting",
                     icon: "🎨"
                   }
                 ].map((prompt) => (
                   <button
                     key={prompt.title}
                     className="group p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                     onClick={() => setMessage(prompt.title)}
                   >
                     <div className="flex items-start gap-2">
                       <span className="text-lg">{prompt.icon}</span>
                       <div>
                         <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                           {prompt.title}
                         </div>
                       </div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto light-scrollbar px-6 py-4">
            <div
              className="max-w-3xl mx-auto space-y-4"
              style={{
                WebkitOverflowScrolling: "touch",
                overflowAnchor: "none",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex transform-gpu ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      msg.type === "user"
                        ? "bg-gray-200 max-w-[80%]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* if it is not user then use bot icon */}
                      {msg.type !== "user" && (
                        <div className="flex-shrink-0 mt-0.5">
                          <Bot className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-wrap">
                          {msg.text}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex-shrink-0">
                        <Bot className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Always at bottom */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white border border-gray-300 rounded-lg flex items-center px-4 py-2 gap-2 hover:border-gray-400 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-shadow shadow-sm">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 w-full resize-none border-0 outline-none bg-transparent px-2 py-2 text-sm min-h-[44px] max-h-32 placeholder-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() && !attachedFile}
              size="icon"
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2 shadow transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {attachedFile && (
            <div className="flex items-center mt-2 text-xs text-gray-600 bg-gray-100 rounded-md px-3 py-1.5 w-fit border border-gray-200 shadow-sm">
              <span className="mr-2 truncate max-w-xs">
                {attachedFile.name}
              </span>
              <button
                onClick={removeAttachment}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
