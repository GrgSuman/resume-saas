import React from "react";
import { X } from "lucide-react";
import { manageLocalStorage } from "../../lib/localstorage";

const STORAGE_KEY = "noticeBannerDismissed";

const NotificationBanner = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const dismissed = manageLocalStorage.get(STORAGE_KEY);
    setVisible(dismissed !== "true");
  }, []);

  const handleClose = () => {
    setVisible(false);
    manageLocalStorage.set(STORAGE_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-[90%] mx-auto p-8 text-center relative">
        {/* Close Button */}
        <button
          aria-label="Dismiss notice"
          onClick={handleClose}
          className="absolute top-5 right-5 inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          🎉 Special Offer: Premium for Everyone!
        </h2>

        {/* Body */}
        <p className="text-lg text-gray-700">
          Hey there! We’re giving <strong>FREE access to all premium features</strong> for a limited time. <br />
          Enjoy an easier and faster workflow, boost your productivity, and have fun exploring!
        </p>

        {/* Optional CTA */}
        <p className="mt-4 text-gray-500 text-sm">
        Make the most of it while it lasts!
        </p>
      </div>
    </div>
  );
};

export default NotificationBanner;
