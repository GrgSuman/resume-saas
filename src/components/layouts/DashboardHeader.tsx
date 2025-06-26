import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, Lightbulb, CreditCard, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import logo from "../../assets/resume_logo.png";

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user data - replace with your auth context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    credits: 5,
    initials: "JD"
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/");
  };

  const handleSuggestFeature = () => {
    // Add your suggest feature logic here
    console.log("Suggest feature clicked");
  };

  return (
    <nav className="sticky bg-white/80 backdrop-blur-md top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center">
          <a
            href="/dashboard"
            className="flex items-center"
            style={{ textDecoration: "none" }}
          >
            <img
              src={logo}
              alt="SmartResume"
              className="object-contain w-[40px] h-[48px]"
            />
            <span className="font-medium block ml-2 text-2xl text-gray-900 tracking-tight flex items-center" style={{lineHeight: 1}}>
              CVFAST
            </span>
          </a>
        </div>

        {/* Right side - Suggest Feature and User Profile */}
        <div className="flex justify-end gap-3 items-center">
          {/* Suggest Feature Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestFeature}
            className="hidden md:flex gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <Lightbulb className="h-4 w-4" />
            Suggest Feature
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild>
                <a href="/dashboard/profile" className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <User className="h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/credits" className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <CreditCard className="h-4 w-4" />
                  Buy Credits
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings" className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Suggest Feature */}
            <Button
              variant="outline"
              onClick={handleSuggestFeature}
              className="flex items-center gap-2 w-full justify-start border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-lg"
            >
              <Lightbulb className="h-4 w-4" />
              Suggest Feature
            </Button>

            {/* Mobile User Section */}
            <div className="border-t border-gray-100 pt-4">
              {/* Mobile User Header */}
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Mobile Credits */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Available Credits</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900">{user.credits}</span>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-1">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Profile</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </a>
                
                <a
                  href="/dashboard/credits"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Buy Credits</p>
                    <p className="text-xs text-gray-500">Upgrade your plan</p>
                  </div>
                </a>
                
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-gray-500">Preferences & privacy</p>
                  </div>
                </a>
                
                <div className="border-t border-gray-100 my-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-xs text-red-500">End your session</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}