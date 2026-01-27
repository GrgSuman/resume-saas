import { formatRelativeTime } from '../../../lib/utils';
import type { Job } from '../types/jobs';
import { MoreVertical, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { useState } from 'react';

const getFaviconUrl = (companyUrl?: string): string | null => {
  if (!companyUrl) return null;
  const cleanDomain = companyUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Saved: "#f1f5f9",      // slate-100
    Applied: "#dbeafe",     // blue-100
    Interviewing: "#fef3c7", // amber-100
    Offer: "#dcfce7",       // green-100
    Rejected: "#f1f5f9",    // slate-100
    Archived: "#f1f5f9",    // slate-100
  };
  return colors[status] || colors.Saved;
};

const getStatusEmoji = (status: string): string => {
  const emojis: Record<string, string> = {
    Saved: "📌",
    Applied: "✉️",
    Interviewing: "💬",
    Offer: "🎉",
    Rejected: "❌",
    Archived: "📦",
  };
  return emojis[status] || "📌";
};

const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    Saved: "bg-slate-100 text-slate-700",
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-amber-100 text-amber-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Archived: "bg-slate-100 text-slate-700",
  };
  return colors[status] || colors.Saved;
};

const JobListCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  const bgColor = getStatusColor(job.status);
  const emoji = getStatusEmoji(job.status);
  const faviconUrl = getFaviconUrl(job.companyUrl);
  const [faviconError, setFaviconError] = useState(false);

  const handleCardClick = () => {
    navigate(`/dashboard/jobs/${job.id}`);
  };

  return (
    <div 
      className="group relative cursor-pointer rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 p-6 flex flex-col h-[200px]"
      style={{ backgroundColor: bgColor }}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        {faviconUrl && !faviconError ? (
          <img
            src={faviconUrl}
            alt={job.companyName}
            className="h-10 w-10 rounded-lg object-cover"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <span className="text-4xl">{emoji}</span>
        )}
        
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/40 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200"
              aria-label="More"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-44 p-1 border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/jobs/${job.id}`);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
            {job.title}
          </h3>
        </div>

        {/* Date Info and Status */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-sm text-slate-600 font-medium">
            {formatRelativeTime(job.createdAt)}
          </p>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobListCard