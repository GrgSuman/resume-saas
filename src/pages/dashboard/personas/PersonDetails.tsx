import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import { ArrowLeft, Save, ChevronDown, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/* ---------------- SECTION CONFIG ---------------- */

const SECTIONS = [
  {
    key: "personal",
    title: "Personal Snapshot",
    placeholder: "Who you are, where you're based, and your current or target role...",
  },
  {
    key: "skills",
    title: "Skills & Expertise",
    placeholder: "List your key skills, tools, technologies, and areas of expertise...",
  },
  {
    key: "experience",
    title: "Career History & Projects",
    placeholder: "Describe your work experience, roles, and notable projects you've worked on...",
  },
  {
    key: "education",
    title: "Education & Certifications",
    placeholder: "Your degrees, courses, bootcamps, and professional certifications...",
  },
  {
    key: "goals",
    title: "Career Goals & Target Roles",
    placeholder: "What roles are you targeting? What kind of companies interest you?",
  },
  {
    key: "strengths",
    title: "Strengths & Achievements",
    placeholder: "What sets you apart? Key accomplishments and things you're proud of...",
  },
  {
    key: "preferences",
    title: "Work Preferences & Values",
    placeholder: "What do you value in a role or company culture?",
  },
  {
    key: "motivation",
    title: "Why This Career Path",
    placeholder: "Your motivation, what drives you, and why you chose this field...",
  },
  {
    key: "links",
    title: "Links & Portfolio",
    placeholder: "LinkedIn, GitHub, personal website, portfolio, or any relevant links...",
  },
  {
    key: "languages",
    title: "Languages & Availability",
    placeholder: "Languages you speak, work availability, timezone, notice period...",
  },
  {
    key: "salary",
    title: "Salary & Location Preferences",
    placeholder: "Salary expectations, remote/hybrid/onsite preference, open to relocation...",
  },
];

const GUIDANCE_TIPS = [
  { title: "Personal Snapshot", tip: "Include your name, location, years of experience, and what you currently do or want to do." },
  { title: "Skills & Expertise", tip: "Be specific about technologies, tools, and soft skills. Mention proficiency levels if relevant." },
  { title: "Career History", tip: "Focus on impact — what you built, problems you solved, and results you achieved." },
  { title: "Education", tip: "Include formal degrees, relevant courses, bootcamps, and certifications." },
  { title: "Goals", tip: "Be clear about the type of role, industry, and company size you're targeting." },
  { title: "Strengths", tip: "Highlight what makes you unique and any measurable achievements." },
  { title: "Preferences", tip: "Mention work style, team dynamics, and cultural values that matter to you." },
  { title: "Motivation", tip: "Share your story — this helps create compelling cover letters." },
  { title: "Links", tip: "Add your professional profiles and any work samples." },
  { title: "Languages", tip: "Include spoken languages and your availability for starting a new role." },
  { title: "Salary & Location", tip: "Be honest about expectations to help match you with the right opportunities." },
];

/* ---------------- SECTION EDITOR ---------------- */

const SectionEditor = ({
  section,
  isFirst,
}: {
  section: (typeof SECTIONS)[number];
  isFirst?: boolean;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[100px] text-foreground leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (isFirst && editor) {
      setTimeout(() => {
        editor.commands.focus();
      }, 200);
    }
  }, [editor, isFirst]);

  if (!editor) return null;

  const isEmpty = editor.isEmpty;

  return (
    <div className="relative">
      <h3 className="text-base font-medium text-foreground mb-3">
        {section.title}
      </h3>
      <div className="relative">
        <EditorContent editor={editor} />
        {isEmpty && (
          <div className="absolute top-0 left-0 text-muted-foreground pointer-events-none">
            {section.placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- GUIDANCE PANEL ---------------- */

const GuidancePanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center gap-3 py-3 text-left group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            How to fill this out
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-6 pt-2">
          <p className="text-sm text-muted-foreground mb-4">
            Write naturally in your own words. Don't worry about formatting — AI will structure 
            everything when generating resumes and cover letters. The more detail you provide, 
            the better the results.
          </p>
          <div className="grid gap-2">
            {GUIDANCE_TIPS.map((item) => (
              <div key={item.title} className="flex gap-2 text-sm">
                <span className="font-medium text-foreground min-w-[140px]">
                  {item.title}:
                </span>
                <span className="text-muted-foreground">{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const PersonDetails = () => {
  const navigate = useNavigate();

  const handleSave = useCallback(() => {
    console.log("Save persona");
  }, []);

  return (
    <Dialog
      open={true}
      onOpenChange={(o) => !o && navigate("/dashboard/personas")}
    >
      <DialogContent
        className="max-w-4xl min-w-[90vw] sm:min-w-[80vw] lg:min-w-[60vw] max-h-[95vh] p-0 flex flex-col"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate("/dashboard/personas")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Career Persona
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Build your professional profile
              </p>
            </div>
          </div>
          <Button onClick={handleSave} size="sm" className="h-9">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Guidance Panel */}
            <GuidancePanel />
            
            {/* Divider after guidance */}
            <div className="border-t border-border mb-10" />

            {/* Sections */}
            <div className="space-y-12">
              {SECTIONS.map((section, index) => (
                <SectionEditor
                  key={section.key}
                  section={section}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonDetails;
