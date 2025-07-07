import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Paperclip, Send, X, Edit3 } from "lucide-react";
import { useResume } from "../../../hooks/useResume";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      type: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, dispatch } = useResume();
  const resumeTitle = state?.resumeTitle || "Untitled Resume";
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeTitle);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (attachedFile) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "user" as const,
          content: `Uploaded resume: ${attachedFile.name}`,
          timestamp: new Date(),
        },
      ]);
      setAttachedFile(null);
    }
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      const aiResponseMsg =
        "Hello! I'm your resume assistant. I can help you improve your resume, suggest better wording, or answer any questions about resume writing.\n\nYou can also upload your resume for feedback.";
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant" as const,
        content: aiResponseMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
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
    <div className="flex flex-col h-full bg-white">
      {/* Header matching the editor style */}
      <div className="w-full border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resume Assistant</h2>
          
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                className="text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                <span className="text-sm text-gray-700 font-medium">{resumeTitle}</span>
                <button
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
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
        {isEmpty ? (
          <div className="flex flex-col items-center px-4 flex-none mt-12">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              How can I help you get noticed?
            </div>
            <div className="text-sm text-gray-600 text-center my-4 max-w-md">
              Ask for resume tips, section ideas, or upload your file for
              instant feedback. Try one of these to get started:
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-lg">
              <button
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition border border-gray-200"
                onClick={() =>
                  setMessage("Rewrite my work experience for impact")
                }
              >
                Rewrite work experience
              </button>
              <button
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition border border-gray-200"
                onClick={() => setMessage("Add a summary section")}
              >
                Add summary section
              </button>
              <button
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition border border-gray-200"
                onClick={() => setMessage("Make my resume ATS-friendly")}
              >
                Make ATS-friendly
              </button>
              <button
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition border border-gray-200"
                onClick={() =>
                  setMessage("Suggest skills for a software engineer")
                }
              >
                Suggest skills
              </button>
              <button
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition border border-gray-200"
                onClick={() => setMessage("Review my uploaded resume")}
              >
                Review my resume
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto px-6 mt-5 pb-5 light-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
              overflowAnchor: "none",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col mb-4 transform-gpu ${
                  msg.type === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap px-4 py-3 rounded-xl shadow-sm text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* Input Bar at Bottom */}
        <div className="px-4 pb-4 pt-2 bg-white mt-auto border-t border-gray-200">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative bg-white border border-gray-300 rounded-xl flex items-center px-4 py-2 gap-2 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
              {/* Upload Button */}
              <label className="inline-flex items-center cursor-pointer">
                <Paperclip className="h-5 w-5 text-gray-500 hover:text-blue-600" />
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
                disabled={false}
              />
              {/* Send Button */}
              <Button
                type="submit"
                onClick={handleSendMessage}
                disabled={!message.trim() && !attachedFile}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-sm transition-all disabled:opacity-50 disabled:bg-gray-300"
                style={{ height: 36, width: 36 }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {/* Show attached file name if present */}
            {attachedFile && (
              <div className="flex items-center mt-2 ml-2 text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 w-fit border border-gray-200">
                <span className="mr-2 truncate max-w-xs">{attachedFile.name}</span>
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
    </div>
  );
};

export default Chat;