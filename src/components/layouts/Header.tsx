import { Button } from "../ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { Link } from "react-router";

const NAV_LINKS = [
  { label: "Resume Builder", href: "https://app.clonecv.com/dashboard/resume" },
  { label: "Cover Letter Generator", href: "https://app.clonecv.com/dashboard/cover-letter" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Career Advice", href: "/blogs" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="CloneCV logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              CloneCV
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <a
                href="https://app.clonecv.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
              >
                Sign in
              </a>

              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                asChild
              >
                <a
                  href="https://app.clonecv.com/dashboard/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span>Try Free</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu (CSS only) */}
          <details className="md:hidden relative group">
            <summary className="list-none cursor-pointer p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <Menu className="h-6 w-6" />
            </summary>

            <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-200 bg-white shadow-xl p-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="my-2 border-t border-slate-100" />

              <a
                href="https://app.clonecv.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </a>

              <Button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white" asChild>
                <a
                  href="https://app.clonecv.com/dashboard/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Try Free</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
