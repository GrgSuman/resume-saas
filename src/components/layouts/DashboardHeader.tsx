import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Lightbulb,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function BrutalistDashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = {
    name: "John Doe",
    email: "john@example.com",
    credits: 5,
    initials: "JD",
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
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/dashboard"
            className="font-black text-xl text-black uppercase tracking-tighter px-1 py-1 border-2 border-transparent"
          >
            CLONE
            <span className="bg-[#00E0C6] text-black px-2 inline-block transform -skew-x-12 ml-1">
              CV
            </span>
          </a>
        </div>

        <div className="flex justify-end gap-3 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestFeature}
            className="hidden md:flex gap-2 border-black text-black font-black hover:bg-black hover:text-white transition-all duration-200"
          >
            <Lightbulb className="h-4 w-4" />
            SUGGEST FEATURE
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="hidden md:flex items-center gap-2 bg-black text-white font-black uppercase tracking-wider border-2 border-black hover:bg-[#00E0C6] hover:text-black transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 border-2 border-black"
              align="end"
            >
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors"
                >
                  <User className="h-4 w-4" />
                  PROFILE
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/credits"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  BUY CREDITS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  SETTINGS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors"
              >
                <LogOut className="h-4 w-4" />
                SIGN OUT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
        <div className="py-2 space-y-1 bg-white border-t-2 border-black">
          {/* Mobile User Info */}
          <div className="px-4 py-3 bg-[#00E0C6] border-2 border-black mx-4 my-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user.initials}</span>
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-black">{user.name}</p>
                <p className="text-xs text-gray-700">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black">
              <span className="text-xs font-bold uppercase text-black">CREDITS</span>
              <span className="text-sm font-bold text-black">{user.credits}</span>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <a
            href="/dashboard/profile"
            className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              PROFILE
            </div>
          </a>

          <a
            href="/dashboard/credits"
            className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              BUY CREDITS
            </div>
          </a>

          <a
            href="/dashboard/settings"
            className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              SETTINGS
            </div>
          </a>

          <button
            onClick={handleSuggestFeature}
            className="block w-full px-4 py-2 text-left text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              SUGGEST FEATURE
            </div>
          </button>

          <div className="pt-2 px-4">
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              <div className="flex items-center gap-2 justify-center">
                <LogOut className="h-4 w-4" />
                SIGN OUT
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
