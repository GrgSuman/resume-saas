import { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  AlignLeft,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

const quickActions = [
  {
    id: "regenerate",
    icon: RefreshCw,
    label: "Regenerate",
    helper: "Try a new version",
  },
  {
    id: "shorter",
    icon: AlignLeft,
    label: "Shorter Version",
    helper: "Make it concise",
  },
];

const versions = [
  {
    id: "v1",
    label: "V1",
    content: `Dear Hiring Manager,

**About Me:**
Over the past three years, I've built scalable React systems that marry delightful frontend experiences with production-grade rigor. I would love to bring that focus to the Junior React Developer role.

**Key Achievements:**
- Improved page speed by 38% on legacy portals
- Shortened build times by 2x
- Led a small team of developers to implement component libraries

**Why Aurora Labs:**
Your mentorship culture and rapid release cycles excite me. The recent "Horizon" release demonstrates your team's ability to turn user feedback into product magic. I thrive when I can partner closely with design, sweat the micro-interactions, and see ideas land in production.

💡 Tip: Use numbers to show measurable impact in your achievements.

Thank you for your time. I’d love to share how I can help Aurora launch frontends that feel effortless and intuitive.

Sincerely,
Amelia Carter`,
  },
  {
    id: "v2",
    label: "V2",
    content: `Dear Hiring Manager,

I’m excited about Aurora Labs’ mission to blend AI with thoughtful commerce experiences. In my current role at Northwind, I led a cross-functional team that built a shared React component library, reducing duplicate work by 45% and cutting design QA cycles in half.

A favorite win: we shipped a site performance initiative that trimmed average load time from 3.2s to 1.8s, which contributed to a 9% lift in conversions for our enterprise storefront. Beyond the metrics, it reinforced how much I love pairing with design and focusing on those micro-interactions that make products feel premium.

Aurora’s “Horizon” release resonated with me because it shows how quickly your team transforms customer feedback into product changes. I’d love to bring my mix of frontend craft and collaboration to keep that momentum going.

Thank you for considering my application. I’d value the chance to share more and learn how I could support Aurora’s next chapter.`,
  },
];

const CoverDetail = () => {
  const [selectedVersionId, setSelectedVersionId] = useState(versions[0].id);
  const [content, setContent] = useState(versions[0].content);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [personalizeForm, setPersonalizeForm] = useState({
    roleFocus: "",
    standoutMoment: "",
    tone: "professional",
  });
  // Tracks whether personalization data already exists (e.g., supplied during initial creation)
  const [hasExistingPersonalization, setHasExistingPersonalization] = useState(false);

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
    }
  };

  const wordCount = content.trim().split(/\s+/).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
            </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
        {/* Left column - Editable Document */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
              <h1 className="text-2xl font-medium">
                Junior React Developer Cover Letter
              </h1>
              <p className="text-slate-500">{wordCount} words</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Version
              </label>
              <Select
                value={selectedVersionId}
                onValueChange={(value) => {
                  const nextVersion = versions.find((v) => v.id === value);
                  if (!nextVersion) return;
                  setSelectedVersionId(nextVersion.id);
                  setContent(nextVersion.content);
                }}
              >
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder="Choose version" />
                </SelectTrigger>
                <SelectContent align="end">
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
            </div>

          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setContent(e.currentTarget.innerText)}
            className="min-h-[500px] whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-8 leading-relaxed text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none"
          >
            {content}
          </div>
        </section>

        {/* Right column - Sidebar */}
        <aside className="space-y-6">
          {/* Personalize CTA */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
            <h2 className="text-base font-semibold text-slate-800">
              {hasExistingPersonalization ? "Personalization saved" : "Want it more personal?"}
            </h2>
            <p className="text-sm text-slate-600">
              {hasExistingPersonalization
                ? "You already supplied extra context when creating this letter. Update it here if you’d like the regeneration to reflect new details."
                : "Answer a few prompts so we can weave in extra context and tailor the tone before regenerating."}
            </p>
            <Button className="w-full gap-2" onClick={() => setIsPersonalizeOpen(true)}>
              <Sparkles className="h-4 w-4" />
              {hasExistingPersonalization ? "Edit personalization" : "Personalize & Regenerate"}
            </Button>
          </div>

          {/* Quick refinements */}
          <div className="space-y-2">
            <p className="text-sm text-slate-600 font-medium">
              Quick refinements
            </p>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => alert("Coming soon")}
                  className="flex w-full flex-col items-start gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </div>
                  <p className="text-xs text-slate-500">{action.helper}</p>
                </button>
              );
            })}
          </div>

          {/* Writing Tips */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
            <h2 className="text-base font-semibold text-slate-800">
              Standout in 3 short moves
            </h2>
            <ul className="text-sm text-slate-700 space-y-1.5">
              <li><span className="font-medium">Hook:</span> one line on why this company or mission matters to you.</li>
              <li><span className="font-medium">Proof:</span> one quantified win that mirrors what they’re hiring for.</li>
              <li><span className="font-medium">Close:</span> a confident ask to keep the conversation going.</li>
            </ul>
            <p className="text-xs text-slate-500">
              Everything else? Keep it tight, mirror their tone, and tie your work to their goals.
            </p>
          </div>
        </aside>
      </div>

      <Dialog open={isPersonalizeOpen} onOpenChange={setIsPersonalizeOpen}>
        <DialogContent className="max-w-4xl sm:max-w-4xl w-full p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Personalize your Cover Letter
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Handle generation
              setIsPersonalizeOpen(false);
            }}
          >
            {/* QUESTION 1: THE HOOK */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label
                  htmlFor="roleFocus"
                  className="text-sm font-medium text-slate-900"
                >
                  In one sentence, what genuinely excites you most about this
                  specific role?
                </label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This helps us find the "hook" for your opening paragraph so it
                  doesn't sound generic.
                </p>
                  </div>
              <Textarea
                id="roleFocus"
                rows={4}
                className="resize-none bg-slate-50 focus:bg-white transition-colors min-h-20 max-h-20"
                placeholder="e.g. I've been following your sustainability initiative for years and want to contribute..."
                value={personalizeForm.roleFocus}
                onChange={(e) =>
                  setPersonalizeForm((prev) => ({
                    ...prev,
                    roleFocus: e.target.value,
                  }))
                }
              />
            </div>

            {/* QUESTION 2: THE PROOF */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label
                  htmlFor="standoutMoment"
                  className="text-sm font-medium text-slate-900"
                >
                  Which specific achievement creates the best proof you can
                  handle this job?
                </label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Give us the "Director's Cut." Mention the context or struggle
                  that isn't visible on your resume.
                </p>
               </div>
              <Textarea
                id="standoutMoment"
                rows={4}
                className="resize-none bg-slate-50 focus:bg-white transition-colors min-h-20 max-h-20"
                placeholder="e.g. The resume says I increased sales by 20%, but I did it during a hiring freeze..."
                value={personalizeForm.standoutMoment}
                onChange={(e) =>
                  setPersonalizeForm((prev) => ({
                    ...prev,
                    standoutMoment: e.target.value,
                  }))
                }
              />
        </div>

            {/* QUESTION 3: THE VIBE */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label
                  htmlFor="tone"
                  className="text-sm font-medium text-slate-900"
                >
                  Select the tone that matches your personality
                </label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This controls the sentence structure and vocabulary of the
                  final letter.
                </p>
              </div>
              <Select
                value={personalizeForm.tone}
                onValueChange={(value) =>
                  setPersonalizeForm((prev) => ({
                    ...prev,
                    tone: value,
                  }))
                }
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Choose tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    Professional & Polished (Safe & Standard)
                  </SelectItem>
                  <SelectItem value="raw">
                    Raw & Authentic (Human, Minimal Fluff)
                  </SelectItem>
                  <SelectItem value="bold">
                    Bold & Confident (Direct, Leadership-Focused)
                  </SelectItem>
                  <SelectItem value="enthusiastic">
                    High Energy (Passionate, Startup-Ready)
                  </SelectItem>
                  <SelectItem value="analytical">
                    Analytical & Precise (Data-Driven, Technical)
                  </SelectItem>
                </SelectContent>
              </Select>
        </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPersonalizeOpen(false)}
                className="text-slate-500 hover:text-slate-900 mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => setHasExistingPersonalization(true)}
                className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              >
                Regenerate Cover Letter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverDetail;
