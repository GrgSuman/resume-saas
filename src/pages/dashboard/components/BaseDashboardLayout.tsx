import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Button } from "../../../components/ui/button";
import {
  Menu,
  ChevronDown,
  X,
  Plus,
  FileText,
  Mail,
  // Settings,
  Home,
  MessageSquare,
} from "lucide-react";
import { CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { manageLocalStorage } from "../../../lib/localstorage";
import { cn } from "../../../lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/resume", label: "Resumes", icon: FileText },
  { href: "/dashboard/cover-letter", label: "Cover Letters", icon: Mail },
  // { href: "/dashboard/preferences", label: "Preferences", icon: Settings },
];

const BaseDashboardLayout = () => {
  const { user, setUser, setAuthStates } = useAuth();
  const handleLogout = () => {
    manageLocalStorage.remove("token");
    setUser(null);
    setAuthStates({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Open by default on desktop, closed on mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsSidebarOpen(mq.matches);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Fixed Sidebar with slide in/out */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-[#f5f5f5] border-r  z-60 lg:z-[50]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col gap-4 p-4">
          {/* Mobile header with close button */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-border">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-xl text-slate-900 tracking-tight"
            >
              <img src="/icon.png" alt="CloneCV logo" className="h-7 w-6.5" />
              <span className="text-xl pt-[5px]">
                Clone<span className="text-[#7060fc]">CV</span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop logo inside sidebar */}
          <div className="hidden lg:flex items-center justify-between">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 font-semibold text-xl text-slate-900 tracking-tight"
              )}
            >
              <img src="/icon.png" alt="CloneCV logo" className="h-7 w-6.5" />
              <span className="text-xl pt-[5px] font-medium">
                Clone<span className="text-[#7060fc]">CV</span>
              </span>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={cn("w-full justify-between mt-2")}>
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create New</span>
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 z-[70]">
              <DropdownMenuItem onClick={() => navigate("/dashboard/resume", { state: { openCreateModal: true } })}>
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/cover-letter", { state: { openCreateModal: true } })}>
                <Mail className="mr-2 h-4 w-4" />
                Cover Letter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href}to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full",
                      "justify-start",
                      "text-neutral-700",
                      "cursor-pointer",
                      isActive && "bg-[#e5e5e5] text-neutral-900"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 mr-2")} />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Fixed Header that shifts based on sidebar */}
      <header
        className={cn(
          "fixed top-0 right-0 left-0 h-16 border-b border-slate-200 bg-white  z-50",
          isSidebarOpen ? "lg:left-64" : "lg:left-0"
        )}
      >
        <div className="h-full flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen((v) => !v)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-end w-full gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSeA2tZS8ukqiGWVCFIGN-pOPZJ-krue3EM44vwZ47MiToU3wA/viewform?usp=preview", "_blank")}
              className="text-slate-800 hidden lg:flex bg-white font-medium hover:bg-slate-50 shadow-none"
            >
              <MessageSquare className="mr-0.5 mt-0.5 h-4 w-4" />
              Feedback
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={()=>navigate("/dashboard/pricing")}
              className="text-slate-800 bg-white font-medium hover:bg-slate-50 shadow-none"
            >
              <CreditCard className="mr-0.5 mt-0.5 h-4 w-4" />
              Upgrade Plan
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                >
                  <div className="w-6 h-6 bg-[#7060fc] rounded-full flex items-center justify-center overflow-hidden">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="user profile"
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
                      className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        user?.picture ? "hidden" : ""
                      }`}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 border border-slate-200 bg-white rounded-lg"
                align="end"
              >
                <div className="px-3  border-b border-slate-100">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-6 h-6 bg-[#7060fc] rounded-full flex items-center justify-center overflow-hidden">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="user profile"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          user?.picture ? "hidden" : ""
                        }`}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {user?.name}
                        </p>
                        <div className="px-2 py-0.5 bg-blue-100 text-[#7060fc] text-xs font-semibold rounded">
                          {/* {user?.credits} Credits */}
                          {user?.isPaidUser ? "Pro Plan" : "Free Plan"}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/pricing"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    Upgrade Plan
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
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <main
        className={cn(
          "min-h-screen pt-16",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      > 
        <Outlet />
      </main>
    </div>
  );
};

export default BaseDashboardLayout;
