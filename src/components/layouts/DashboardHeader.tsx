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
import img from '../../assets/logo.png'

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoVariation] = useState(15);
  const navigate = useNavigate();

  // Mock user data - replace with your auth context
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

  // Logo variations
  const logoVariations = {
    1: {
      // Premium Document with subtitle
      icon: (
        <svg viewBox="0 0 24 24" className="w-9 h-9 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="white" stroke="#1f2937" strokeWidth="1.5" className="drop-shadow-sm" />
          <rect x="6" y="6" width="9" height="0.8" fill="#1f2937" rx="0.4" />
          <rect x="6" y="8.5" width="7" height="0.8" fill="#1f2937" rx="0.4" />
          <rect x="6" y="11" width="8" height="0.8" fill="#1f2937" rx="0.4" />
          <rect x="6" y="13.5" width="6" height="0.8" fill="#1f2937" rx="0.4" />
          <rect x="6" y="16" width="7" height="0.8" fill="#1f2937" rx="0.4" />
          <path d="M16 7 L19 4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="drop-shadow-sm" />
          <rect x="4" y="4" width="16" height="1" fill="#f59e0b" opacity="0.3" />
        </svg>
      ),
      text: (
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">CVFAST</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">RESUME BUILDER</span>
        </div>
      )
    },
    2: {
      // Minimalist with gradient
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="2" width="18" height="22" rx="1" fill="url(#gradient1)" />
          <rect x="5" y="5" width="10" height="1" fill="white" />
          <rect x="5" y="8" width="8" height="1" fill="white" />
          <rect x="5" y="11" width="9" height="1" fill="white" />
          <rect x="5" y="14" width="7" height="1" fill="white" />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    3: {
      // Geometric with triangles
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="3" width="16" height="18" fill="#1f2937" />
          <polygon points="20,3 24,3 20,7" fill="#f59e0b" />
          <rect x="6" y="7" width="8" height="1" fill="white" />
          <rect x="6" y="10" width="6" height="1" fill="white" />
          <rect x="6" y="13" width="7" height="1" fill="white" />
          <rect x="6" y="16" width="5" height="1" fill="white" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    4: {
      // Circular with document
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#6366f1" />
          <rect x="8" y="6" width="8" height="12" rx="1" fill="white" />
          <rect x="9" y="8" width="6" height="0.5" fill="#6366f1" />
          <rect x="9" y="10" width="4" height="0.5" fill="#6366f1" />
          <rect x="9" y="12" width="5" height="0.5" fill="#6366f1" />
          <rect x="9" y="14" width="3" height="0.5" fill="#6366f1" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-indigo-600">CVFAST</span>
    },
    5: {
      // Speed lines design
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="#1f2937" />
          <path d="M6 8 L10 4 M6 12 L12 8 M6 16 L11 12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="6" width="8" height="1" fill="white" />
          <rect x="8" y="9" width="6" height="1" fill="white" />
          <rect x="8" y="12" width="7" height="1" fill="white" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    6: {
      // Hexagonal design
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 20,6 20,16 12,20 4,16 4,6" fill="url(#gradient2)" />
          <rect x="8" y="8" width="8" height="1" fill="white" />
          <rect x="8" y="11" width="6" height="1" fill="white" />
          <rect x="8" y="14" width="7" height="1" fill="white" />
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    7: {
      // Minimalist outline
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="16" height="20" rx="1" fill="none" stroke="#1f2937" strokeWidth="2" />
          <line x1="6" y1="6" x2="14" y2="6" stroke="#1f2937" strokeWidth="1" />
          <line x1="6" y1="9" x2="12" y2="9" stroke="#1f2937" strokeWidth="1" />
          <line x1="6" y1="12" x2="13" y2="12" stroke="#1f2937" strokeWidth="1" />
          <line x1="6" y1="15" x2="11" y2="15" stroke="#1f2937" strokeWidth="1" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    8: {
      // Bold geometric
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" fill="#1f2937" />
          <rect x="4" y="4" width="16" height="16" fill="white" />
          <rect x="6" y="7" width="10" height="2" fill="#1f2937" />
          <rect x="6" y="11" width="8" height="2" fill="#1f2937" />
          <rect x="6" y="15" width="9" height="2" fill="#1f2937" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    9: {
      // Gradient circles
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="url(#gradient3)" />
          <rect x="8" y="8" width="8" height="8" rx="1" fill="white" />
          <circle cx="10" cy="10" r="1" fill="#6366f1" />
          <circle cx="14" cy="10" r="1" fill="#8b5cf6" />
          <circle cx="10" cy="14" r="1" fill="#ec4899" />
          <circle cx="14" cy="14" r="1" fill="#f59e0b" />
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    10: {
      // Speedometer style
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#1f2937" strokeWidth="2" />
          <path d="M12 12 L16 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="14" width="8" height="1" fill="#1f2937" />
          <rect x="8" y="16" width="6" height="1" fill="#1f2937" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    11: {
      // Abstract lines
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8 L20 8" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          <path d="M4 12 L18 12" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
          <path d="M4 16 L16 16" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="8" r="2" fill="#6366f1" />
          <circle cx="18" cy="12" r="2" fill="#8b5cf6" />
          <circle cx="16" cy="16" r="2" fill="#ec4899" />
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    12: {
      // Minimalist dots
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="#1f2937" strokeWidth="2" />
          <circle cx="8" cy="8" r="1" fill="#1f2937" />
          <circle cx="12" cy="8" r="1" fill="#1f2937" />
          <circle cx="16" cy="8" r="1" fill="#1f2937" />
          <circle cx="8" cy="12" r="1" fill="#1f2937" />
          <circle cx="12" cy="12" r="1" fill="#1f2937" />
          <circle cx="8" cy="16" r="1" fill="#1f2937" />
          <circle cx="12" cy="16" r="1" fill="#1f2937" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    13: {
      // Lightning bolt
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="#1f2937" />
          <path d="M12 6 L8 12 L12 12 L10 18 L16 12 L12 12 Z" fill="#f59e0b" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    14: {
      // Gradient squares
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="6" height="6" fill="#6366f1" />
          <rect x="12" y="4" width="6" height="6" fill="#8b5cf6" />
          <rect x="4" y="12" width="6" height="6" fill="#ec4899" />
          <rect x="12" y="12" width="6" height="6" fill="#f59e0b" />
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    15: {
      // Arrow design
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12 L20 12 M16 8 L20 12 L16 16" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="6" width="8" height="1" fill="#1f2937" />
          <rect x="4" y="9" width="6" height="1" fill="#1f2937" />
          <rect x="4" y="15" width="8" height="1" fill="#1f2937" />
          <rect x="4" y="18" width="6" height="1" fill="#1f2937" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    16: {
      // Diamond design
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 20,12 12,22 4,12" fill="url(#gradient4)" />
          <rect x="8" y="8" width="8" height="1" fill="white" />
          <rect x="8" y="11" width="6" height="1" fill="white" />
          <rect x="8" y="14" width="7" height="1" fill="white" />
          <defs>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    17: {
      // Minimalist checkmark
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="#1f2937" strokeWidth="2" />
          <path d="M8 12 L11 15 L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    },
    18: {
      // Gradient triangles
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 22,20 2,20" fill="url(#gradient5)" />
          <rect x="6" y="8" width="8" height="1" fill="white" />
          <rect x="6" y="11" width="6" height="1" fill="white" />
          <rect x="6" y="14" width="7" height="1" fill="white" />
          <defs>
            <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    19: {
      // Abstract waves
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8 Q8 4 12 8 Q16 12 20 8" stroke="#6366f1" strokeWidth="2" fill="none" />
          <path d="M4 12 Q8 8 12 12 Q16 16 20 12" stroke="#8b5cf6" strokeWidth="2" fill="none" />
          <path d="M4 16 Q8 12 12 16 Q16 20 20 16" stroke="#ec4899" strokeWidth="2" fill="none" />
        </svg>
      ),
      text: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CVFAST</span>
    },
    20: {
      // Minimalist grid
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="#1f2937" strokeWidth="2" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="#1f2937" strokeWidth="1" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#1f2937" strokeWidth="1" />
          <circle cx="8" cy="8" r="1" fill="#6366f1" />
          <circle cx="16" cy="8" r="1" fill="#8b5cf6" />
          <circle cx="8" cy="16" r="1" fill="#ec4899" />
          <circle cx="16" cy="16" r="1" fill="#f59e0b" />
        </svg>
      ),
      text: <span className="text-2xl font-bold text-gray-900">CVFAST</span>
    }
  };

  const currentLogo = logoVariations[logoVariation as keyof typeof logoVariations];

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
            <div className="flex items-center gap-1">
              {/* Logo Icon */}
              <div className="relative">
                {currentLogo.icon}
                {/* <img src={img} alt="logo" className="w-10 h-10" /> */}
              </div>
              {/* Logo Text */}
              {currentLogo.text}
            </div>
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
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/credits"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Buy Credits
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
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
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Credits */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Available Credits
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900">
                    {user.credits}
                  </span>
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
                    <p className="text-xs text-gray-500">
                      Preferences & privacy
                    </p>
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
