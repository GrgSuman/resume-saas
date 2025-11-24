import { useState } from "react";
import { User, Edit, Save, X, Mail, Calendar, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface UserDetails {
  name: string;
  email: string;
  createdAt: string;
  bio?: string;
  picture?: string;
  credits: number;
}

const MyDetails = ({ user }: { user: UserDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "Software developer passionate about creating innovative solutions.",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // TODO: Implement save functionality with your API
    console.log("Saving user data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#7060fc] to-[#6050e5] rounded-full flex items-center justify-center overflow-hidden">
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
              className={`w-full h-full rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold ${
                user?.picture ? "hidden" : ""
              }`}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-slate-600 flex items-center justify-center lg:justify-start gap-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#7060fc] text-white rounded-full text-sm">
                <CreditCard className="h-4 w-4" />
                Free Plan
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}</span>
              </div>
            </div>
          </div>

          {/* Edit Button - Right Side */}
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center gap-2 border-slate-300 text-slate-700 hover:border-[#7060fc] hover:text-[#7060fc]"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#7060fc] text-white hover:bg-[#6050e5]"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2 border-slate-300 text-slate-700"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-[#7060fc]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="border-slate-300 focus:border-[#7060fc] focus:ring-[#7060fc]/20"
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-900 font-medium">
                    {formData.name}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Email Address
              </Label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-900 font-medium">
                  {user?.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-slate-700">
                Bio
              </Label>
              {isEditing ? (
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-slate-300 rounded-lg resize-none h-32 focus:outline-none focus:border-[#7060fc] focus:ring-[#7060fc]/20 transition-colors duration-200"
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[8rem]">
                  <span className="text-slate-900 leading-relaxed">
                    {formData.bio || "I am awesome.."}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-[#7060fc]" />
                <span className="text-sm font-semibold text-slate-700">
                  Account Type
                </span>
              </div>
              <span className="text-slate-900 font-medium">
                Free Plan
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-[#7060fc]" />
                <span className="text-sm font-semibold text-slate-700">
                  Member Since
                </span>
              </div>
              <span className="text-slate-900 font-medium">
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDetails;
