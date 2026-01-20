import React from "react";
import { useState, useEffect, useRef, memo } from "react";
import {
  ArrowUp,
  FileText,
  Target,
  PenTool,
  Star,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Button } from "../../../../components/ui/button";
import { useResume } from "../../../../hooks/useResume";
import { useParams } from "react-router";
import axiosInstance from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "./MarkdownStyle.css";
import Analyzer from "./features/Analyzer";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { manageLocalStorage } from "../../../../lib/localstorage";

interface MessageItem {
  role: "assistant" | "user";
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
        msg.role === "assistant"
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
  const [showAnalyzerDialog, setShowAnalyzerDialog] = useState(false);
  const [showJobDescDialog, setShowJobDescDialog] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [msgSending, setMsgSending] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const [toolMessage, setToolMessage] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    const updateTextareaHeight = () => {
      if (textareaRef.current) {
        const isXL = window.innerWidth >= 1280;
        textareaRef.current.style.height = isXL ? "48px" : "42px";
      }
    };
    updateTextareaHeight();
    window.addEventListener("resize", updateTextareaHeight);
    return () => window.removeEventListener("resize", updateTextareaHeight);
  }, []);

  const { id } = useParams<{ id: string }>();
  const hasJobDescription = state.jobDescription?.trim().length > 0;

  // Get conversation history
  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axiosInstance.get(`/resume/${id}/conversation`);
        const msgHistory = response.data.conversation?.map(
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

  // Handle Send Message
  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");
    if (textareaRef.current) {
      const isXL = window.innerWidth >= 1280;
      textareaRef.current.style.height = isXL ? "48px" : "42px";
    }
    setMsgSending(true);
    setStreamStarted(false);
    setToolMessage(null);
    const baseURL = axiosInstance.defaults.baseURL || "";
    const url = `${baseURL}/resume/${id}/stream-agent-response`;

    const token = manageLocalStorage.get("token");

    try {
      await fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeData: state.resumeData,
          resumeSectionSettings: state.resumeSettings?.sections,
          jobDescription: state.jobDescription || "No job description provided",
          messages: messages,
          userPrompt: message,
        }),

        onmessage(ev) {
          if (ev.event === "content") {
            const chunk = JSON.parse(ev.data) as string;
            if (!chunk) return;
            if (!streamStarted) setStreamStarted(true);
            setToolMessage(null);

            setMessages((prev) => {
              if (
                prev.length === 0 ||
                prev[prev.length - 1].role !== "assistant"
              ) {
                return [...prev, { role: "assistant", text: chunk }];
              }

              const last = prev[prev.length - 1];
              const updatedLast = { ...last, text: last.text + chunk };
              return [...prev.slice(0, -1), updatedLast];
            });
          }
          if (ev.event === "tool_calls") {
            setToolMessage("Updating resume...");
          }
          if (ev.event === "tool_result") {
            try {
              let parsed = JSON.parse(ev.data);
              // If it's still a string, parse again (double-encoded JSON)
              if (typeof parsed === "string") {
                parsed = JSON.parse(parsed);
              }

              if (parsed?.section && parsed?.data) {
                if (parsed.section === "sectionSettings" && parsed.data) {
                  dispatch({
                    type: "UPDATE_RESUME_SETTINGS",
                    payload: { sections: parsed.data },
                  });
                } else {
                  dispatch({
                    type: "UPDATE_RESUME_DATA",
                    payload: { [parsed.section]: parsed.data },
                  });
                }
              }
            } catch (error) {
              console.error("Error parsing tool_result:", error);
            }
          }
        },

        // Handle non-200 responses (like 429, 400, etc.)
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get("content-type")?.includes("text/event-stream")
          ) {
            // SSE connection established successfully
            return;
          }

          // Response is not SSE - likely an error JSON response
          if (response.status === 429 || response.status === 400) {
            const errorData = await response.json();

            if (errorData?.message?.includes("Monthly limit reached")) {
              toast.error(errorData.message, {
                position: "top-right",
              });
            } else {
              toast.error(
                errorData?.message || "Something went wrong. Please try again.",
                {
                  position: "top-right",
                }
              );
            }
            throw new Error("Non-SSE response received");
          } else if (!response.ok) {
            // Other non-OK responses
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        },

        onerror(err) {
          console.error("SSE error", err);
          throw new Error("SSE error");
        },
        onclose() {
          setMsgSending(false);
          setStreamStarted(false);
          setToolMessage(null);
        },
        openWhenHidden: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message.includes("Monthly limit reached")) {
          toast.error(error?.response?.data?.message, {
            position: "top-right",
          });
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
          });
        }
      }
    } finally {
      setMsgSending(false);
      setStreamStarted(false);
      setToolMessage(null);
    }

    // try {
    //   const response = await axiosInstance.post(`/resume/${id}/stream-agent-response`, {
    //     userPrompt: message,
    //     resumeId: id,
    //     jobDescription: state.jobDescription || "",
    //     resumeData: state.resumeData,
    //     resumeSectionSettings: state.resumeSettings?.sections,
    //   });

    //   // Add LLM message to chat
    //   setMessages((prev) => [
    //     ...prev,
    //     { role: "model", text: response.data.response.message },
    //   ]);

    //   // Apply resume data changes if shouldApplyChanges is true
    //   if (response.data?.response?.shouldApplyChanges) {
    //     if(response.data?.response?.data) {
    //       const payload = response.data.response.data;
    //       dispatch({ type: "UPDATE_RESUME_DATA", payload: payload });
    //     }
    //     if(response.data?.response?.resumeSectionSettings) {
    //       const payload = { sections: response.data.response.resumeSectionSettings };
    //       dispatch({ type: "UPDATE_RESUME_SETTINGS", payload: payload });
    //     }
    //   }
    // } catch (error) {

    //   if (axios.isAxiosError(error)) {
    //     if(error?.response?.data?.message.includes("Monthly limit reached")){
    //       toast.error(error?.response?.data?.message, {
    //         position: "top-right",
    //       });
    //     } else {
    //       toast.error("Something went wrong. Please try again.", {
    //         position: "top-right",
    //       });
    //     }
    //   }
    // } finally {
    //   setMsgSending(false);
    // }
  };

  // Handle Key Press enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !msgSending) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle Analyze Resume - opens dialog
  const handleAnalyzeResume = () => {
    if (msgSending) return;
    setShowAnalyzerDialog(true);
  };

  return (
    <>
      {/* Analyzer Dialog */}
      <Analyzer
        open={showAnalyzerDialog}
        onOpenChange={setShowAnalyzerDialog}
        openJobDescDialog={showJobDescDialog}
        onJobDescDialogChange={setShowJobDescDialog}
      />

      {/* Chat Container */}
      <div className="flex flex-col h-full border-l lg:border-gray-200">
        {/* Header - Transparent with Blur */}
        <div className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white backdrop-blur-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Minimalist Title */}
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Resume Assistant
              </h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAnalyzeResume}
                  disabled={msgSending}
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 px-2 text-xs font-medium"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Analyze Resume</span>
                </Button>
              </div>
            </div>
          </div>
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
                  <div className="flex flex-col h-full items-center justify-center">
                    <div className="w-full max-w-2xl space-y-10">
                      {/* Capabilities Section */}
                      <div className="space-y-4 mt-10">
                        <p className="text-base font-medium text-slate-600 uppercase tracking-wide">
                          What I Can Help With
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            {
                              icon: Sparkles,
                              title: "Resume Feedback",
                              desc: "Get comprehensive AI feedback to identify what's missing and what needs improvement.",
                            },
                            {
                              icon: Target,
                              title: "Job Matching",
                              desc: "Align your resume to job requirements.",
                            },
                            {
                              icon: FileText,
                              title: "Content Improvement",
                              desc: "Enhance clarity, grammar, and tone.",
                            },
                            {
                              icon: ArrowUp,
                              title: "Best Practices",
                              desc: "ATS keywords and formatting tips.",
                            },
                            {
                              icon: PenTool,
                              title: "Writing Enhancement",
                              desc: "Improve professional language and impact.",
                            },
                            {
                              icon: Star,
                              title: "Achievement Highlighting",
                              desc: "Make your accomplishments stand out.",
                            },
                          ].map(({ icon: Icon, title, desc }) => (
                            <div
                              key={title}
                              className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50/50 transition-colors"
                            >
                              <Icon className="h-3.5 w-3.5 text-slate-500 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-slate-900 leading-none">
                                  {title}
                                </p>
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                  {desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <Message key={idx} msg={msg} />
                    ))}
                    {msgSending && !streamStarted && (
                      <div className="flex justify-start mb-2 lg:mb-4">
                        <div className="rounded-xl text-gray-800 p-2 lg:p-3">
                          {toolMessage ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {toolMessage}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              />
                              <span
                                className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              />
                              <span
                                className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              />
                            </div>
                          )}
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
        <div className="pt-4 pb-2 lg:pt-6 lg:pb-4 px-2 lg:px-4 backdrop-blur-sm flex flex-col gap-1 lg:gap-2 relative bg-white z-20">
          <div className="block absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <div className="flex-wrap gap-1.5 mb-1 hidden lg:flex">
            {[
              "Fix my grammar",
              "Improve my skills",
              "Review my resume",
              "Optimize for job descriptions",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setMessage(s)}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border border-gray-200/50"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="border border-gray-300 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-gray-900/30 transition-all overflow-hidden">
              {/* Textarea Section */}
              <div className="p-2 sm:p-2.5 lg:p-3 pb-0">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (textareaRef.current) {
                      const isXL = window.innerWidth >= 1280;
                      const minHeight = isXL ? 48 : 42;
                      textareaRef.current.style.height = "auto";
                      textareaRef.current.style.height = `${Math.max(
                        minHeight,
                        Math.min(textareaRef.current.scrollHeight, 140)
                      )}px`;
                    }
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your resume..."
                  className="w-full text-[16px] resize-none focus:outline-none bg-transparent placeholder:text-gray-400 leading-relaxed min-h-[42px] xl:min-h-[48px]"
                  rows={1}
                  style={{
                    maxHeight: "140px",
                  }}
                />
              </div>
              {/* Buttons Section */}
              <div className="flex items-center justify-between px-2 pb-2 sm:px-2.5 sm:pb-2.5 lg:px-3 lg:pb-3 pt-0">
                <button
                  onClick={() => setShowJobDescDialog(true)}
                  disabled={msgSending}
                  title={
                    hasJobDescription
                      ? "Response will be tailored to job"
                      : "Add Job Description for tailored results"
                  }
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${"bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 border-gray-200/50"}`}
                >
                  @{" "}
                  {hasJobDescription
                    ? "Edit Job Description"
                    : "Paste Job Description"}
                </button>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!message.trim() || msgSending}
                  className={`rounded-full ${
                    hasJobDescription
                      ? "bg-black hover:bg-gray-900 text-white"
                      : ""
                  }`}
                >
                  {msgSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
