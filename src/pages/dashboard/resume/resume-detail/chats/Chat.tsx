import React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowUp, FileText, Target, PenTool, Star, Loader2, Sparkles, Check, MoreVertical, Pencil } from "lucide-react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Button } from "../../../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../components/ui/dropdown-menu";
import { useResume } from "../../../../../hooks/useResume";
import EditTitleModal from "../../components/EditTitleModal";
import { Link, useNavigate, useParams } from "react-router";
import axiosInstance from "../../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { manageLocalStorage } from "../../../../../lib/localstorage";
import JobDescriptionDialog from "../features/JobDescriptionDialog";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "./MarkdownMessage";
import MarkdownMessage from "./MarkdownMessage";


const Chat = () => {
  const [message, setMessage] = useState("");
  const { state, dispatch } = useResume();
  const [messages, setMessages] = useState<Message[]>(state.messages);
  const [showJobDescDialog, setShowJobDescDialog] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [msgSending, setMsgSending] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const [toolMessage, setToolMessage] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const navigate = useNavigate();

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
  const queryClient = useQueryClient();

  // Handle Rename Resume
  const handleRenameResume = async (newTitle: string) => {
    try {
      await axiosInstance.patch(`/resume/${id}`, { title: newTitle });
      dispatch({ type: "SET_RESUME_TITLE", payload: newTitle });
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setShowRenameModal(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "Failed to update resume title",
          {
            position: "top-right",
          }
        );
      }
    }
  };

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
              navigate("/dashboard/pricing");
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
          navigate("/dashboard/pricing");
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
  };

  // Handle Key Press enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !msgSending) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Job Description Dialog */}
      <JobDescriptionDialog
        open={showJobDescDialog}
        onOpenChange={setShowJobDescDialog}
      />

      {/* Rename Resume Modal */}
      <EditTitleModal
        open={showRenameModal}
        onOpenChange={setShowRenameModal}
        onSubmit={handleRenameResume}
        currentTitle={state.resumeTitle || ""}
      />

      {/* Chat Container */}
      <div className="flex flex-col h-full border-l lg:border-gray-200">
        {/* Header - Transparent with Blur */}
        <div className="sticky hidden lg:block top-0 z-30 w-full border-b border-gray-200 bg-white backdrop-blur-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Minimalist Title */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Resume Assistant
                </h2>
              </div>

              {/* Action Buttons */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="p-1 w-64 border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl"
                >
                  {state.resumeTitle && (
                    <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100 mb-1">
                      <span className="truncate block font-medium text-slate-900">
                        {state.resumeTitle}
                      </span>
                    </div>
                  )}
                  <DropdownMenuItem
                    onClick={() => setShowRenameModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit name
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
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
                  {messages.map((message, idx) => (
                    <MarkdownMessage key={idx} message={message} />
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
                {state.isTailoredResume ? (
                  <Link
                    to={`/dashboard/jobs/${state.jobId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View job used to tailor this resume"
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors flex items-center gap-1"
                  >
                    <Target className="h-3 w-3" />
                    <span>Job Context</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowJobDescDialog(true)}
                    disabled={msgSending}
                    title={
                      hasJobDescription
                        ? "Response will be tailored to job"
                        : "Add Job Description for tailored results"
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${hasJobDescription
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 border-gray-200/50"
                      }`}
                  >
                    {hasJobDescription ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Job Added</span>
                      </>
                    ) : (
                      <>
                        <span> @ </span>
                        <span>Tailor to Job</span>
                      </>
                    )}
                  </button>
                )}
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!message.trim() || msgSending}
                  className={`rounded-full transition-all ${hasJobDescription
                    ? "bg-gray-700 hover:bg-gray-600 text-white shadow-sm"
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
