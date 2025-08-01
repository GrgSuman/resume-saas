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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Picture and Basic Info Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 md:p-6 bg-gray-50 rounded-lg border-2 border-gray-100">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold ${
                  user?.picture ? "hidden" : ""
                }`}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-black">
                  {user?.name}
                </h3>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm md:text-base">{user?.email}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#00E0C6] rounded-full">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {user?.credits || 0} Credits
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-center md:justify-start">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-black"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold border-b-2 border-black pb-2">
                Personal Information
              </h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="border-2 border-gray-300 focus:border-black text-sm md:text-base"
                    />
                  ) : (
                    <div className="p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[3rem] flex items-center">
                      <span className="text-gray-900 font-medium text-sm md:text-base">
                        {formData.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[3rem] flex items-center">
                    <span className="text-gray-900 font-medium text-sm md:text-base">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Credits Balance
                  </Label>
                  <div className="p-3 md:p-4 bg-[#00E0C6] rounded-lg border-2 border-[#00E0C6] min-h-[3rem] flex items-center">
                    <span className="text-black font-bold text-base md:text-lg">
                      {user?.credits || 0} Credits
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold border-b-2 border-black pb-2">
                About Me
              </h4>

              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-semibold text-gray-700"
                >
                  Bio
                </Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={user?.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-lg resize-none h-24 md:h-32 focus:outline-none focus:border-black transition-colors duration-200 text-sm md:text-base"
                  />
                ) : (
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[6rem] md:min-h-[8rem] flex items-start">
                    <span className="text-gray-900 leading-relaxed text-sm md:text-base">
                      {user?.bio || "I am awesome.."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h4 className="text-lg font-bold mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Account Type
                  </span>
                </div>
                <span className="text-gray-900 font-medium text-sm md:text-base">
                  Free Plan
                </span>
              </div>

              <div className="p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Member Since
                  </span>
                </div>
                <span className="text-gray-900 font-medium text-sm md:text-base">
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDetails;
