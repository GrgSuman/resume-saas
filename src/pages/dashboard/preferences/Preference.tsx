import { Info } from "lucide-react";

const Preference = () => {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto">
        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-blue-100 p-3">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Welcome to Our Preferences Page
              </h2>
              <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  You are welcomed to our page. Thanks for coming, though this feature is not yet available in the dashboard.
                </p>
                <p className="font-medium text-slate-900">
                  We are constantly working on giving you a better experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preference;
