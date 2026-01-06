import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  FileText,
  PenSquare,
  Plus,
} from "lucide-react";

type Status = "applied" | "interviewing" | "archived";

const STATUS_LABELS = {
  applied: "Applied",
  interviewing: "Interviewing",
  archived: "Archived",
};

// Header background + border tint
const STATUS_STYLES: Record<Status, string> = {
  applied: "bg-blue-50 border-blue-200",
  interviewing: "bg-amber-50 border-amber-200",
  archived: "bg-slate-50 border-slate-200",
};

// Optional page background wash (subtle)
const PAGE_BG: Record<Status, string> = {
  applied: "bg-blue-25",
  interviewing: "bg-amber-25",
  archived: "bg-slate-25",
};

const SpaceDetails = () => {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "Frontend Engineer",
    company: "Atlassian",
    location: "Sydney, AU",
    jobUrl: "#",
    status: "applied" as Status,
    description: `We're looking for a Frontend Engineer...`,

    documents: [
      {
        id: "1",
        type: "resume",
        title: "Tailored Resume — Frontend Engineer",
        icon: FileText,
        updatedAt: "Updated 2 days ago",
      },
      {
        id: "",
        type: "coverLetter",
        title: "",
        icon: PenSquare,
        updatedAt: "",
      },
    ],

    notes: [{ id: "n1", text: "Prepare STAR stories for frontend projects" }],
  });

  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    setJob((prev) => ({
      ...prev,
      notes: [{ id: `n${Date.now()}`, text: newNote }, ...prev.notes],
    }));
    setNewNote("");
  };

  const removeNote = (id: string) =>
    setJob((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));

  const updateStatus = (status: Status) =>
    setJob((prev) => ({ ...prev, status }));

  return (
    <div className={`min-h-screen ${PAGE_BG[job.status] || ""}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Breadcrumb */}
        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Job Space
        </Link>

        {/* HEADER — status-tinted */}
        <header
          className={`space-y-4 rounded-xl border p-6 transition-colors
          ${STATUS_STYLES[job.status]}
        `}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              {job.title}
              <span className="text-slate-600 font-normal">
                {" "}
                @ {job.company}
              </span>
            </h1>

            <Select value={job.status} onValueChange={updateStatus}>
              <SelectTrigger className="h-9 w-[140px] text-xs bg-white border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 rounded-md border border-slate-200">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>

            {job.jobUrl && (
              <button
                onClick={() => window.open(job.jobUrl, "_blank")}
                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800"
              >
                View posting
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </header>

        {/* ATTACHMENTS */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Attachments
          </h3>

          <div className="space-y-2">
            {job.documents.map((doc, index) => {
              const Icon = doc.icon;
              const docId = doc.id;
              const exists = docId && doc.title;
              const isResume = doc.type === "resume";
              
              const handleAction = () => {
                if (exists) {
                  if (isResume) {
                    navigate(`/dashboard/resume/${docId}`);
                  } else {
                    navigate(`/dashboard/cover-letter/${docId}`);
                  }
                } else {
                  // TODO: Handle create action
                  if (isResume) {
                    navigate("/dashboard/resume/new");
                  } else {
                    navigate("/dashboard/cover-letter/new");
                  }
                }
              };

              if (!exists) {
                // Placeholder card (dashed border)
                return (
                  <div
                    key={`${doc.type}-${index}`}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {isResume ? "No tailored resume yet" : "No cover letter yet"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {isResume 
                            ? "Create one specifically for this job" 
                            : "Generate one specifically for this job"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 px-4 text-xs bg-slate-900 hover:bg-slate-800 text-white"
                      onClick={handleAction}
                    >
                      {isResume ? "Create Tailored Resume" : "Create Cover Letter"}
                    </Button>
                  </div>
                );
              }

              // Existing document card
              return (
                <div
                  key={`${doc.type}-${docId}`}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {doc.title}
                      </p>
                      {doc.updatedAt && (
                        <p className="text-xs text-slate-500 mt-0.5">{doc.updatedAt}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 text-xs border-slate-200 hover:bg-slate-100"
                    onClick={handleAction}
                  >
                    {isResume ? "Edit" : "Open"}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* NOTES */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Notes
          </h3>

          <div className="flex gap-2">
            <Input
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              className="h-9"
            />
            <Button className="h-9 px-4" onClick={addNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {job.notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm leading-relaxed"
              >
                {note.text}

                <button
                  className="block text-xs text-slate-500 mt-2 hover:text-red-600"
                  onClick={() => removeNote(note.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* JOB DESCRIPTION */}
        <section className="space-y-2 pb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Job Description
          </h3>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SpaceDetails;
