import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { Button } from "../../../components/ui/button";
import {
  PanelLeft,
  ChevronDown,
  Plus,
  FileText,
  Mail,
  Home,
  CreditCard,
  User,
  LogOut,
  // Briefcase,
  // Puzzle,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useAuth } from "../../../hooks/useAuth";
import { manageLocalStorage } from "../../../lib/localstorage";
import { cn } from "../../../lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/resume", label: "Resumes", icon: FileText },
  { href: "/dashboard/cover-letter", label: "Cover Letters", icon: Mail },
  // { href: "/dashboard/jobs", label: "Job Space", icon: Briefcase },
  { href: "/dashboard/subscription", label: "Billing and Usage", icon: CreditCard },
];

const BaseDashboardLayout = () => {
  const { user, setUser, setAuthStates } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [headerAvatarError, setHeaderAvatarError] = useState(false);
  const [dropdownAvatarError, setDropdownAvatarError] = useState(false);

  // Reset avatar errors when user changes
  useEffect(() => {
    setHeaderAvatarError(false);
    setDropdownAvatarError(false);
  }, [user?.picture]);

  // Responsive sidebar
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const isDesktop = mq.matches;
    setIsMobile(!isDesktop);
    setIsSidebarOpen(isDesktop);

    const handler = (e: MediaQueryListEvent) => {
      const isDesktop = e.matches;
      setIsMobile(!isDesktop);
      setIsSidebarOpen(isDesktop);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleLogout = () => {
    manageLocalStorage.remove("token");
    setUser(null);
    setAuthStates({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-white border-r border-slate-200",
          "transition-all duration-300 ease-in-out z-50",
          isMobile
            ? isSidebarOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-64"
            : isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-16 translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col gap-4 transition-all duration-300",
            isSidebarOpen ? "px-4 py-4" : "px-2 py-4"
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex items-center transition-all",
              isSidebarOpen ? "justify-between" : "justify-center"
            )}
          >
            <Link
              to="/"
              className={cn(
                "flex items-center transition-all",
                isSidebarOpen ? "gap-2" : "justify-center"
              )}
            >
              <img src="/icon.png" alt="CloneCV" className="h-7 w-7" />
              {isSidebarOpen && (
                <span className="text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap">
                  Clone<span className="text-[#7060fc]">CV</span>
                </span>
              )}
            </Link>

            {isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:bg-slate-100"
                onClick={() => setIsSidebarOpen(false)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isSidebarOpen ? (
                <Button className="w-full justify-between bg-slate-900 hover:bg-slate-800 text-white font-medium mt-2 h-auto py-2 px-3">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              ) : (
                <button
                  className={cn(
                    "relative w-auto mx-auto flex items-center justify-center rounded-md text-sm font-medium transition-colors mt-2 py-2 px-2",
                    "bg-slate-900 hover:bg-slate-800 text-white"
                  )}
                  title="Create New"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isSidebarOpen ? "start" : "end"}
              sideOffset={isSidebarOpen ? 0 : 8}
              className="w-56"
            >
              <DropdownMenuItem
                onClick={() =>
                  navigate("/dashboard/resume", {
                    state: { openCreateModal: true },
                  })
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate("/dashboard/cover-letter", {
                    state: { openCreateModal: true },
                  })
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Cover Letter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link key={item.href} to={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-md text-sm font-medium transition-colors",
                      isSidebarOpen
                        ? "gap-3 px-3 py-2"
                        : "justify-center px-0 py-2",
                      isActive
                        ? "bg-slate-200 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    onClick={() => {
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}

            {/* Chrome Extension Link - Bottom */}
            {/* <div className="mt-auto pt-4 border-t border-slate-200">
              <Link to="/dashboard/extension">
                <div
                  className={cn(
                    "relative group rounded-md transition-colors",
                    isSidebarOpen ? "px-3 py-2" : "px-0 py-2 flex justify-center",
                    pathname === "/dashboard/extension"
                      ? "bg-slate-100"
                      : "hover:bg-slate-50"
                  )}
                  onClick={() => {
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  title={!isSidebarOpen ? "Chrome Extension" : undefined}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      isSidebarOpen ? "gap-3" : "justify-center"
                    )}
                  >
                    <Puzzle
                      className={cn(
                        "h-4 w-4 shrink-0",
                        pathname === "/dashboard/extension"
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900"
                      )}
                    />
                    {isSidebarOpen && (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          pathname === "/dashboard/extension"
                            ? "text-slate-900 font-semibold"
                            : "text-slate-600 group-hover:text-slate-900"
                        )}
                      >
                        Chrome Extension
                      </span>
                    )}
                  </div>

                  {isSidebarOpen && (
                    <span className="absolute top-0 right-0 inline-flex items-center rounded-full bg-[#7060fc]/10 text-[#7060fc] text-[11px] font-medium px-2 py-0.5">
                      Quick install
                    </span>
                  )}
                </div>
              </Link>
            </div> */}
          </nav>
        </div>
      </aside>

      {/* HEADER */}
      <header
        className={cn(
          "fixed top-0 right-0 h-13 bg-white border-b border-slate-200 z-40",
          "transition-[left] duration-300",
          isMobile
            ? isSidebarOpen
              ? "left-64"
              : "left-0"
            : isSidebarOpen
            ? "left-64"
            : "left-16"
        )}
      >
        <div className="flex h-full items-center justify-between px-6">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-500 hover:bg-slate-100"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // You can replace this with your feedback link/modal
                window.open("mailto:support@clonecv.com?subject=Feedback", "_blank");
              }}
              className="flex items-center gap-1.5 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Button>

            {user?.subscription.plan === "FREE" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/pricing")}
              className="flex items-center gap-1.5 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none"
            >
              <CreditCard className="h-4 w-4" />
              Upgrade
            </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-slate-200 hover:bg-slate-100 shadow-none"
                >
                  {/* Avatar (smaller than button) */}
                  <div className="w-7 h-7 rounded-full  flex items-center justify-center overflow-hidden">
                    {user?.picture && !headerAvatarError ? (
                      <img
                        src={user.picture}
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover"
                        onError={() => setHeaderAvatarError(true)}
                      />
                    ) : (
                      <div className="bg-[#7060fc] w-6 h-6 rounded-full flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {user?.name?.split(" ")[0]}
                  </span>

                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-72 rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                {/* User Card */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.picture && !dropdownAvatarError ? (
                        <img
                          src={user.picture}
                          alt="User"
                          className="w-8 h-8 rounded-full object-cover"
                          onError={() => setDropdownAvatarError(true)}
                        />
                      ) : (
                        <div className="bg-[#7060fc] w-8 h-8 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Plan Badge */}
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full border",
                        user?.role === "pro"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      {user?.subscription.plan}
                    </span>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/subscription")}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <CreditCard className="h-4 w-4" />
                      Manage Subscription
                    </DropdownMenuItem>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-1" />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* CONTENT */}
      <main
        className={cn(
          "pt-14 transition-[margin] duration-300",
          isMobile
            ? isSidebarOpen
              ? "lg:ml-64"
              : "lg:ml-0"
            : isSidebarOpen
            ? "lg:ml-64"
            : "lg:ml-16"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default BaseDashboardLayout;
