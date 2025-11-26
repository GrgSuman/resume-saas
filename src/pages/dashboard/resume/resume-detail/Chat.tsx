import React from "react";
import { useState, useEffect, useRef, memo } from "react";
import { ArrowUp, AtSign, X, FileText, Loader2 } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { useResume } from "../../../../hooks/useResume";
import { useParams } from "react-router";
import axiosInstance from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "./MarkdownStyle.css";

interface MessageItem {
  role: "model" | "user";
  text: string;
}

const Message = memo(({ msg }: { msg: MessageItem }) => (
  <div
    className={`flex leading-relaxed ${
      msg.role === "user" ? "justify-end" : "justify-start"
    } mb-2 lg:mb-4`}
  >
    <div
      className={`rounded-xl text-sm ${
        msg.role === "model"
          ? "text-gray-800 p-2 lg:p-3"
          : "bg-secondary p-2 px-3 lg:p-3 lg:px-4"
      }`}
    >
      <div className="markdown-body text-[14px] lg:text-[16px]">
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      </div>
    </div>
  </div>
));

const Chat = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [message, setMessage] = useState("");
  const { state, dispatch } = useResume();
  const [jobDescription, setJobDescription] = useState(
    state.jobDescription || ""
  );
  const [showJobModal, setShowJobModal] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [msgSending, setMsgSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    const updateTextareaHeight = () => {
      if (textareaRef.current) {
        const isXL = window.innerWidth >= 1280;
        textareaRef.current.style.height = isXL ? "50px" : "45px";
      }
    };
    updateTextareaHeight();
    window.addEventListener("resize", updateTextareaHeight);
    return () => window.removeEventListener("resize", updateTextareaHeight);
  }, []);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axiosInstance.get(
          `/resumegpt/conversation/${id}`
        );
        const msgHistory = response.data.conversation.map(
          (message: { role: string; text: string }) => ({
            role: message.role as "model" | "user",
            text: message.text,
          })
        );
        setMessages(msgHistory);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error?.response?.data?.message || "Error loading conversation",
            {
              position: "top-right",
            }
          );
        }
      } finally {
        setChatLoading(false);
      }
    };
    if (id) getConversation();
  }, [id]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");
    if (textareaRef.current) {
      const isXL = window.innerWidth >= 1280;
      textareaRef.current.style.height = isXL ? "50px" : "45px";
    }
    setMsgSending(true);

    try {
      const response = await axiosInstance.post(
        `/resumegpt/conversation/${id}`,
        {
          userPrompt: message,
          resumeId: id,
          jobDescription: state.jobDescription,
          resumeData: state.resumeData,
          resumeSettings: state.resumeSettings,
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.data.response.message },
      ]);

      if (response.data?.response?.resumeChanges?.hasChanges) {
        const finalPayload = response.data.response.resumeUpdates;
        for (const key in finalPayload) {
          if (finalPayload[key] === null) delete finalPayload[key];
        }
        dispatch({ type: "UPDATE_RESUME_DATA", payload: finalPayload });
      }

      if (response.data?.response?.settingsChanges?.hasChanges) {
        dispatch({
          type: "UPDATE_RESUME_SETTINGS",
          payload: response.data.response.settingsUpdates,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setMsgSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !msgSending) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddJobDescription = () => {
    if (!jobDescription.trim()) return;
    dispatch({ type: "SET_JOB_DESCRIPTION", payload: jobDescription.trim() });
    setShowJobModal(false);
  };

  return (
    <>
      {/* Job Description Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-background rounded-lg border max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/10 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-md font-semibold">
                    {state.jobDescription
                      ? "Edit Job Description"
                      : "Add Job Description"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {state.jobDescription
                      ? "Update the job description content"
                      : "Paste the job description to get tailored resume advice"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJobModal(false)}
                className="h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 lg:p-6 overflow-y-auto">
              <Label htmlFor="job-description" className="text-sm font-medium">
                Job Description
              </Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="h-[180px] lg:h-[250px] overflow-y-auto resize-none text-sm lg:text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The AI will analyze this job description and provide specific
                recommendations for your resume.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-3 lg:p-6 border-t bg-muted/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJobModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  state.jobDescription
                    ? () => {
                        setShowJobModal(false);
                        if (jobDescription.trim() !== state.jobDescription)
                          dispatch({
                            type: "SET_JOB_DESCRIPTION",
                            payload: jobDescription.trim(),
                          });
                      }
                    : handleAddJobDescription
                }
                disabled={!jobDescription.trim()}
              >
                {state.jobDescription
                  ? "Update Job Description"
                  : "Add Job Description"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 border-l lg:border-gray-200">
        {/* Header */}
        <div className="h-12 lg:h-14 flex items-center justify-between px-3 lg:px-4 border-b bg-white/80 backdrop-blur-md">
          <h2 className="text-sm lg:text-lg font-semibold text-gray-900">
            Resume Assistant
          </h2>
          <Button
            onClick={() => setShowJobModal(true)}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 text-[11px] lg:text-xs px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-md transition ${
              state.jobDescription
                ? "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                : "text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <AtSign className="w-3 h-3" />
            {state.jobDescription
              ? "Edit Job Description"
              : "Add Job Description"}
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
          {chatLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  Loading conversation...
                </p>
                <p className="text-gray-400 text-xs">Please wait a moment</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-3 lg:p-6 space-y-2 lg:space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
                    <div className="w-16 h-16 rounded overflow-hidden mb-2 lg:mb-4">
                      <img
                        src="/avatar.png"
                        alt="AI Assistant"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">
                      How can I help with your resume?
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 max-w-md">
                      Get feedback on your resume, optimize for job
                      descriptions, or improve your content.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <Message key={idx} msg={msg} />
                    ))}
                    {msgSending && (
                      <div className="flex justify-start mb-2 lg:mb-4 animate-fade-in">
                        <div className="rounded-xl px-4 py-2 text-gray-700 transition-all">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Input Area */}
        <div className="p-2 lg:p-4 backdrop-blur-sm flex flex-col gap-1 lg:gap-2 relative bg-white z-20">
          <div className="block absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <div className="flex-wrap gap-1.5 mb-1 hidden lg:flex">
            {[
              "Improve grammar",
              "Add more details",
              "Add more education",
              "Add more experience",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setMessage(s)}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 px-2 py-0.5 rounded-md text-xs transition-colors border border-gray-200/50"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="relative border rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:border-gray-300 transition-all">
              <div className="p-2.5 sm:p-3 lg:p-4 xl:p-5">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (textareaRef.current) {
                      const isXL = window.innerWidth >= 1280;
                      const minHeight = isXL ? 70 : 45;
                      textareaRef.current.style.height = "auto";
                      textareaRef.current.style.height = `${Math.max(
                        minHeight,
                        Math.min(textareaRef.current.scrollHeight, 140)
                      )}px`;
                    }
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your resume..."
                  className="w-full text-[16px] resize-none focus:outline-none bg-transparent placeholder:text-gray-400 leading-relaxed min-h-[45px] xl:min-h-[60px]"
                  rows={1}
                  style={{
                    maxHeight: "140px",
                  }}
                />
              </div>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!message.trim() || msgSending}
                className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 lg:bottom-4 lg:right-4 xl:bottom-5 xl:right-5 rounded-full"
              >
                {msgSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <ArrowUp className="w-4 h-4"/>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
