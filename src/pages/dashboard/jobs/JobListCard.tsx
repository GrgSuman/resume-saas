import { cn, formatRelativeTime } from '../../../lib/utils';
import type { Job } from '../types/jobs';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router';


const getFaviconUrl = (companyUrl?: string): string | null => {
    if (!companyUrl) return null;
    const cleanDomain = companyUrl
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
    return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
};

const StatusDot = ({ status }: { status: string }) => {
    const styles: Record<string, { dot: string; text: string }> = {
      Saved: { dot: "bg-slate-300", text: "text-slate-600" },
      Applied: { dot: "bg-blue-500", text: "text-blue-700" },
      Interviewing: { dot: "bg-amber-500", text: "text-amber-700" },
      Offer: { dot: "bg-green-500", text: "text-green-700" },
      Rejected: { dot: "bg-slate-200", text: "text-slate-400" },
      Archived: { dot: "bg-slate-200", text: "text-slate-400" },
    };
  
    const style = styles[status] || styles.Saved;
    const isRejected = status === "Rejected";
  
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-xs font-medium",
          style.text,
          isRejected && "line-through"
        )}
      >
        <div className={cn("h-2 w-2 rounded-full", style.dot)} />
        {status}
      </div>
    );
};

const JobListCard = ({ job }: { job: Job }) => {
  const faviconUrl = getFaviconUrl(job.companyUrl);
  return (
    <Link to={`/dashboard/jobs/${job.id}`} className="group flex items-center gap-4 p-4 my-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition-all">
    <div className="flex-shrink-0">
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt={job.companyName}
          className="h-10 w-10 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-slate-700" />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-slate-950 truncate">
        {job.title}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-slate-600 text-xs truncate">{job.companyName}</p>
        <span className="text-slate-400">•</span>
        <p className="text-slate-500 text-xs truncate">{job.location}</p>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <p className="text-slate-500 text-xs hidden sm:inline">
          {job.jobType}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 flex-shrink-0">
      <div className="hidden sm:block">
        <StatusDot status={job.status} />
      </div>
      <span className="text-xs text-slate-500 font-medium">
        {formatRelativeTime(job.createdAt)}
      </span>
      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100" />
    </div>
  </Link>
  )
}

export default JobListCard