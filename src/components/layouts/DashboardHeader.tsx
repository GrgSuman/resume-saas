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
import { manageLocalStorage } from "../../lib/localstorage";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setUser, setAuthStates, user } = useAuth();

  const handleLogout = () => {
    manageLocalStorage.remove('token');
    setUser(null);
    setAuthStates({
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
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
          <a
            href="/dashboard"
            className="font-black text-xl text-black uppercase tracking-tighter px-1 py-1 border-2 border-transparent"
          >
            CLONE
            <span className="bg-[#00E0C6] text-black px-2 inline-block transform -skew-x-12 ml-1">CV</span>
          </a>
        </div>

        <div className="flex justify-end gap-3 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestFeature}
            className="hidden md:flex gap-2 border-black text-black font-bold hover:bg-black hover:text-white transition-all duration-200 bg-transparent h-9"
          >
            <Lightbulb className="h-4 w-4" />
            SUGGEST FEATURE
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-2 border-1 border-black bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer focus:outline-none h-9 px-3 rounded-md">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center overflow-hidden">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="user profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${user?.picture ? 'hidden' : ''}`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <span className="text-sm font-bold uppercase text-black">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="h-3 w-3 text-black" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 border-2 border-black bg-white" align="end">
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center overflow-hidden">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="user profile"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${user?.picture ? 'hidden' : ''}`}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase text-black">{user?.name}</p>
                      <span className="px-2 py-0.5 bg-[#00E0C6] text-black text-xs font-bold uppercase">
                        {user?.isPaidUser ? "PRO" : "FREE"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  PROFILE
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/credits"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  UPGRADE & BILLING
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  SETTINGS
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-black hover:text-white font-bold transition-colors cursor-pointer"
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
          <div className="px-4 py-3 bg-[white] border-2 flex justify-between items-center border-black mx-4 my-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="user profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${user?.picture ? 'hidden' : ''}`}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-black">{user?.name}</p>
                <p className="text-xs text-gray-700">{user?.email}</p>
              </div>
            </div>
            <div className="px-2 py-1 bg-[#00E0C6]  text-xs font-bold uppercase">
              {user?.isPaidUser ? "PRO" : "FREE"}
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
