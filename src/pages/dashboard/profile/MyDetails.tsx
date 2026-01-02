import { useState } from "react";
import { User, Edit, Save, X, Mail, Calendar, CreditCard, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface UserDetails {
  name: string;
  email: string;
  createdAt: string;
  picture?: string;
}

const MyDetails = ({ user }: { user: UserDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    console.log("Saving user data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement delete account functionality with your API
    console.log("Deleting account...");
    // Example: await axiosInstance.delete("/auth/user");
    // Then redirect to home or login page
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#7060fc] to-[#6050e5] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold ${
                user?.picture ? "hidden" : ""
              }`}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1 truncate">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-600 flex items-center gap-2 truncate">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] sm:text-xs font-medium text-emerald-700 border border-emerald-100">
                <CreditCard className="h-3 w-3 mr-1" />
                Free Plan
              </span>
              <span className="text-xs text-slate-500">
                Member since {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#7060fc]" />
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-slate-700">
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                autoFocus
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="p-3 h-auto border-slate-300 focus:border-[#7060fc] focus:ring-[#7060fc]/20 bg-white"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-900 font-medium">
                  {formData.name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm text-slate-900 font-medium">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-[#7060fc]" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Account Type
              </span>
            </div>
            <span className="text-sm text-slate-900 font-medium">
              Free Plan
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-[#7060fc]" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Member Since
              </span>
            </div>
            <span className="text-sm text-slate-900 font-medium">
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">Danger Zone</h3>
            <p className="text-xs sm:text-sm text-red-700">
              Once you delete your account, all your data will be permanently deleted after 30 days. Please be certain.
            </p>
          </div>
        </div>
        
        {!showDeleteConfirm ? (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-900">
              Are you sure you want to delete your account? All your data will be permanently deleted after 30 days. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteAccount}
                size="sm"
                className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Yes, Delete My Account
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDetails;
