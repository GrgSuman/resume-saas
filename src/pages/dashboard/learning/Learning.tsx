import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { cn } from "../../../lib/utils";

interface Roadmap {
  id: string;
  title: string;
  currentRole: string;
  targetRole: string;
  progress: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  createdAt: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Learning = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock roadmaps data
  const [roadmaps] = useState<Roadmap[]>([
    {
      id: "1",
      title: "Frontend to Full-Stack Developer",
      currentRole: "Frontend Developer",
      targetRole: "Full-Stack Developer",
      progress: 45,
      milestones: [
        { id: "1", title: "Learn Backend Fundamentals", completed: true },
        { id: "2", title: "Master Node.js & Express", completed: true },
        { id: "3", title: "Database Design & SQL", completed: false },
        { id: "4", title: "API Development", completed: false },
        { id: "5", title: "Deployment & DevOps", completed: false },
      ],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Junior to Senior Engineer",
      currentRole: "Junior Software Engineer",
      targetRole: "Senior Software Engineer",
      progress: 20,
      milestones: [
        { id: "1", title: "System Design Basics", completed: true },
        { id: "2", title: "Advanced Algorithms", completed: false },
        { id: "3", title: "Leadership Skills", completed: false },
        { id: "4", title: "Mentoring Experience", completed: false },
      ],
      createdAt: "2024-02-01",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand you're looking to advance your career. Let me help you create a personalized roadmap based on your current skills and goals. What specific role or skill are you aiming for?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewRoadmap = () => {
    // This would open a dialog to create a new roadmap
    console.log("Create new roadmap");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Career Helper
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Get personalized career roadmaps and guidance from AI
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* LEFT: Roadmaps */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Your Roadmaps
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={createNewRoadmap}
                className="h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-3">
                {/* Create New Roadmap Card */}
                <div
                  onClick={createNewRoadmap}
                  className="group cursor-pointer rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Plus className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900">
                        Create New Roadmap
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Start your career journey
                      </p>
                    </div>
                  </div>
                </div>

                {/* Roadmap Cards */}
                {roadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    onClick={() => setSelectedRoadmap(roadmap)}
                    className={cn(
                      "cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-sm",
                      selectedRoadmap?.id === roadmap.id
                        ? "border-slate-900 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {roadmap.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                          <span>{roadmap.currentRole}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{roadmap.targetRole}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">
                            {roadmap.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 rounded-full transition-all"
                            style={{ width: `${roadmap.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Milestones Preview */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        {roadmap.milestones.slice(0, 2).map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                            )}
                            <span
                              className={cn(
                                "truncate",
                                milestone.completed
                                  ? "text-slate-500 line-through"
                                  : "text-slate-700"
                              )}
                            >
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                        {roadmap.milestones.length > 2 && (
                          <p className="text-xs text-slate-500 pl-5.5">
                            +{roadmap.milestones.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT: AI Chat Assistant */}
          <div className="lg:col-span-2 flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-slate-200 px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    AI Career Assistant
                  </h3>
                  <p className="text-xs text-slate-500">
                    Discuss your career goals and get personalized guidance
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Start a conversation
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Ask me about your career goals, skills to learn, or get
                      help creating a personalized roadmap.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-md">
                    {[
                      "Where should I start?",
                      "Create a roadmap",
                      "Skills I need",
                      "Career advice",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="text-xs text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2.5 max-w-[80%]",
                          message.role === "user"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-900"
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2.5 bg-slate-50">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex items-end gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your career goals..."
                  className="flex-1 min-h-[40px] bg-white border-slate-200 focus:border-slate-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="h-10 w-10 p-0 bg-slate-900 hover:bg-slate-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
