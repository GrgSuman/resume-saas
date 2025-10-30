import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

const DashboardNew = () => {

  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/resume");
  }, [navigate]); 

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-1">
          {/* Create professional resumes and cover letters quickly */}
          A short guide to create your first resume in minutes.
        </p>
      </div>

      {/* Video Tutorial */}
      <div className="mb-10">
        <div className="max-w-5xl">
          <div className="relative rounded-xl border bg-white/60 dark:bg-background overflow-hidden shadow-sm">
            <div className="aspect-video w-full bg-muted/20">
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/hero.png"
                src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardNew;
