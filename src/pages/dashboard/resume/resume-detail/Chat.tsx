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
import './MarkdownStyle.css';

interface MessageItem {
  role: "model" | "user";
  text: string;
}

const Message = memo(({ msg }: { msg: MessageItem }) => (
  <div className={`flex leading-relaxed ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
    <div className={`rounded-xl text-sm ${msg.role === "model" ? " text-gray-800" : "bg-secondary p-3 px-4"}`}>
      <div className="markdown-body">
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      </div>
    </div>
  </div>
));

const Chat = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [message, setMessage] = useState("");
  const { state, dispatch } = useResume();
  const [jobDescription, setJobDescription] = useState(state.jobDescription || "");
  const [showJobModal, setShowJobModal] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [msgSending, setMsgSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axiosInstance.get(`/resumegpt/conversation/${id}`);
        const msgHistory = response.data.conversation.map(
          (message: { role: string; text: string }) => ({
            role: message.role as "model" | "user",
            text: message.text,
          })
        );
        setMessages(msgHistory);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.message, {
            position: "top-right",
          });
        }
      } finally {
        setChatLoading(false);
      }
    };
    if (id) {
      getConversation();
    }
  }, [id]);

  const handleSend = async () => {
    setMsgSending(true);
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");

    try {
      const response = await axiosInstance.post(`/resumegpt/conversation/${id}`,
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
          if (finalPayload[key] === null) {
            delete finalPayload[key];
          }
        }
        dispatch({
          type: "UPDATE_RESUME_DATA",
          payload: finalPayload,
        });
      }
      if (response.data?.response?.settingsChanges?.hasChanges) {
        dispatch({
          type: "UPDATE_RESUME_SETTINGS",
          payload: response.data.response.settingsUpdates,
        });
      }
    } catch (error) {
      // console.log("error", error)
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
          <div className="bg-background rounded-lg border max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {state.jobDescription !== "" &&
                    state.jobDescription !== null
                      ? "Edit Job Description"
                      : "Add Job Description"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {state.jobDescription !== "" &&
                    state.jobDescription !== null
                      ? "Update the job description content"
                      : "Paste the job description to get tailored resume advice"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJobModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-description" className="text-sm font-medium"> 
                    Job Description
                  </Label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here... Include requirements, responsibilities, and any specific skills mentioned."
                    className="h-[250px] overflow-y-auto resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    The AI will analyze this job description and provide
                    specific recommendations for your resume.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/50">
              <Button variant="outline" onClick={() => setShowJobModal(false)}>
                Cancel
              </Button>

              {state.jobDescription !== "" && state.jobDescription !== null ? (
                <Button
                  onClick={() => {
                    setShowJobModal(false);
                    if (jobDescription.trim() !== state.jobDescription) {
                      dispatch({
                        type: "SET_JOB_DESCRIPTION",
                        payload: jobDescription.trim(),
                      });
                    }
                  }}
                >
                  Update Job Description
                </Button>
              ) : (
                <Button onClick={handleAddJobDescription} disabled={!jobDescription.trim()}>
                  Add Job Description
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 border-l border-gray-200">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b bg-white/60 backdrop-blur-md">
          {/* Title */}
          <div className="flex items-center gap-2">
            <h2 className=" font-semibold text-gray-900">Resume Assistant</h2>
          </div>

          {/* JD button */}
          <Button
            onClick={() => setShowJobModal(true)}
            variant="ghost"
            size="sm"
            className={`
            flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md
            transition
            ${state.jobDescription ? "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200" : "text-gray-600 hover:bg-gray-100 border border-gray-200"}
          `}>
            <AtSign className="w-3 h-3" />
            {state.jobDescription ? "Edit Job Description" : "Add Job Description"}
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
          {chatLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{animationDelay: "0ms", animationDuration: "1.4s"}}
                    />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{animationDelay: "0.2s", animationDuration: "1.4s"}}
                    />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{animationDelay: "0.4s", animationDuration: "1.4s"}}
                    />
                  </div>
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  Loading conversation...
                </div>
                <div className="text-gray-400 text-xs">
                  Please wait a moment
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
                    <div className="w-20 h-20 rounded overflow-hidden mb-4">
                      <img src="/avatar.png" alt="AI Assistant" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How can I help with your resume?
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md">
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
                      <div className="flex justify-start mb-4 animate-fade-in">
                        <div className="rounded-xl px-5 py-3 text-gray-700 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{animationDelay: "0ms", animationDuration: "1.4s"}}
                              />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{animationDelay: "0.2s", animationDuration: "1.4s"}}
                              />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{animationDelay: "0.4s", animationDuration: "1.4s"}}
                              />
                            </div>
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
        <div className="p-4 backdrop-blur-sm flex flex-col gap-2 relative bg-white z-20">
            {/* 3. The Whitish Gradient Fade (This sits on top of the scroll area) */}
            <div className="xl:block hidden absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />

          <h3 className="text-sm font-medium text-gray-900 mb-2 xl:block hidden ">Suggestions:</h3>
          <div className="flex-wrap gap-2 mb-2 cursor-pointer xl:flex hidden">
            {["Improve grammar", "Add more details", "Add more education", "Add more experience"].map((suggestion) => (
              <div key={suggestion} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                <span className="text-gray-800">{suggestion}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className={`relative border rounded-xl bg-white focus-within:ring-1 focus-within:ring-gray-800`}>
              <div className="p-3 pb-14">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your resume..."
                  className="w-full text-[16px] resize-none focus:outline-none bg-transparent transition-all duration-200"
                  rows={2}
                  style={{ height: "40px" }}
                />
              </div>
              <button onClick={handleSend} disabled={!message.trim() || msgSending} className="absolute bottom-3 right-3 p-3 bg-black text-white rounded-full hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm">
                {msgSending ? (
                  <Loader2 className="w-4 h-4 animate-spin " />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
