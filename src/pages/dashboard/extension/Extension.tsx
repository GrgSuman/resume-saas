import { Button } from "../../../components/ui/button";
import {
  Download,
  FileText,
  PenSquare,
  MousePointerClick,
  ArrowRight,
  ExternalLink,
  Check,
} from "lucide-react";

const Extension = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Chrome Extension
        </h1>
        <p className="text-base text-slate-600 max-w-2xl">
          Apply smarter, not harder. Tailor your resume and cover letter for
          each job, auto-fill forms, and submit applications with one click—all
          directly from any job posting page.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Tailor Your Resume
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Customize your resume for each position directly from the job
                posting page. Highlight relevant skills and experience that match
                the job requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <PenSquare className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Personalize Cover Letters
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create targeted cover letters that speak directly to each
                employer. No more generic templates—every application is
                personalized.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <MousePointerClick className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                One-Click Apply
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Auto-fill application forms using your profile data, then submit
                with a single click. All applications are automatically saved to
                your Job Space.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Track Everything
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every application is automatically saved to your Job Space with
                all details. Track your progress, follow up, and never lose
                track of where you've applied.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Get Started in 3 Steps
            </h2>
            <p className="text-sm text-slate-600">
              Install the extension and start applying to jobs more effectively.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Install from Chrome Web Store
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Click the button below to visit the Chrome Web Store and add
                  the extension to your browser.
                </p>
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  asChild
                >
                  <a
                    href="https://chrome.google.com/webstore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install Extension
                    <ExternalLink className="h-3.5 w-3.5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Add to Chrome
                </h3>
                <p className="text-sm text-slate-600">
                  Click "Add to Chrome" in the Chrome Web Store and confirm the
                  installation when prompted.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Sign In to Your Account
                </h3>
                <p className="text-sm text-slate-600">
                  Open the extension and sign in with your CloneCV account to
                  start tailoring applications and applying to jobs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              How It Works
            </h2>
            <p className="text-sm text-slate-600">
              Apply to jobs faster and more effectively with our streamlined
              process.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-slate-700" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Visit any job posting
                </h3>
                <p className="text-sm text-slate-600">
                  Navigate to job postings on LinkedIn, Indeed, Glassdoor, or
                  any company career page.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-slate-700" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Open the extension
                </h3>
                <p className="text-sm text-slate-600">
                  Click the CloneCV icon in your Chrome toolbar. The extension
                  extracts job details and prepares your tailored application.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-slate-700" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Tailor your application
                </h3>
                <p className="text-sm text-slate-600">
                  Select or customize your resume and cover letter to match the
                  job requirements. The extension auto-fills forms with your
                  profile data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-slate-700" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Apply with one click
                </h3>
                <p className="text-sm text-slate-600">
                  Review and submit your application. Everything is
                  automatically saved to your Job Space for tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">
              Stop applying randomly. Start applying strategically.
            </h3>
            <p className="text-sm text-slate-600">
              Install the Chrome Extension and transform how you apply to jobs.
              Tailor each application, save time with auto-fill, and track
              everything in one place.
            </p>
          </div>
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white"
            size="lg"
            asChild
          >
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4 mr-2" />
              Install Chrome Extension
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Extension;