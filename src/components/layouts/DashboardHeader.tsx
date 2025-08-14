import { useState } from "react";
import { Button } from "../ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "../ui/dropdown-menu";
import {Menu,X,User,LogOut,Lightbulb,CreditCard,ChevronDown} from "lucide-react";
import { Link, useNavigate } from "react-router";
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
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSd6ouB_E5PfZ2EXsr2_Okm4PtrpgwrxtUnmPejX29_ADQBsuQ/viewform?usp=preview", "_blank");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-xl text-slate-900 tracking-tight px-1 py-1"
          >
            <img src="/icon.png" alt="CloneCV logo" className="h-7 w-7" />
            <span className="text-xl pt-[5px]">
              Clone<span className="text-[#7060fc]">CV</span>
            </span>
          </Link>
        </div>

        <div className="flex justify-end gap-3 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestFeature}
            className="hidden md:flex gap-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent h-9"
          >
            <Lightbulb className="h-4 w-4" />
            Suggest Feature
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer focus:outline-none h-9 px-3 rounded-lg">
                <div className="w-6 h-6 bg-[#7060fc] rounded-full flex items-center justify-center overflow-hidden">
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
                <span className="text-sm font-medium text-slate-700">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="h-3 w-3 text-slate-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 border border-slate-200 bg-white rounded-lg" align="end">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#7060fc] rounded-full flex items-center justify-center overflow-hidden">
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
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <div className="px-2 py-0.5 bg-blue-100 text-[#7060fc] text-xs font-semibold rounded">
                        {user?.credits} Credits
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/dashboard/credits"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Buy Credits
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
        <div className="py-2 space-y-1 bg-white border-t border-slate-200">
          {/* Mobile User Info */}
          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg mx-4 my-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#7060fc] rounded-full flex items-center justify-center overflow-hidden">
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
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-600">{user?.email}</p>
                </div>
              </div>
              <div className="px-2 py-1 bg-blue-100 text-[#7060fc] text-xs font-semibold rounded">
                {user?.credits} Credits
              </div>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 text-slate-700 font-medium text-base hover:bg-slate-50 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </div>
          </Link>

          <Link
            to="/dashboard/credits"
            className="block px-4 py-2 text-slate-700 font-medium text-base hover:bg-slate-50 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Buy Credits
            </div>
          </Link>

          <button
            onClick={handleSuggestFeature}
            className="block w-full px-4 py-2 text-left text-slate-700 font-medium text-base hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggest Feature
            </div>
          </button>

          <div className="pt-2 px-4">
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-white font-medium text-base bg-[#7060fc] hover:bg-[#6050e5] transition-all duration-200 rounded-lg"
            >
              <div className="flex items-center gap-2 justify-center">
                <LogOut className="h-4 w-4" />
                Sign Out
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
