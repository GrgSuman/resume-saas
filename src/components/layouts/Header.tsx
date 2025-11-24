import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/icon.png"
                alt="CloneCV logo"
                className="h-8 w-8 transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                CloneCV
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="https://clonecv.com/#features"
              className="text-sm font-medium text-slate-600 hover:text-[#0e4e42] transition-colors"
            >
              Features
            </a>
            <a
              href="https://clonecv.com/#pricing"
              className="text-sm font-medium text-slate-600 hover:text-[#0e4e42] transition-colors"
            >
              Pricing
            </a>
            <a
              href="https://clonecv.com/blogs"
              className="text-sm font-medium text-slate-600 hover:text-[#0e4e42] transition-colors"
            >
              Blogs
            </a>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <Link
                to="https://app.clonecv.com"
                target="_blank"
                className="text-sm font-medium text-slate-900 hover:text-[#4e69fe] transition-colors"
              >
                Sign in
              </Link>

              {/* UPDATED BUTTON: Matches the "Star" in your logo.
                   Uses a gradient from Blue (#4e69fe) to Violet (#8b5cf6).
                   This creates a high-energy "AI" look that is NOT dull.
                */}
              <Button
                className=" hover:from-blue-700 hover:to-violet-700 text-white shadow-sm transition-all rounded-full hover:scale-[1.02] hover:shadow-blue-500/25 border-0"
                asChild
              >
                <Link
                  to="https://app.clonecv.com/dashboard/resume"
                  target="_blank"
                  className="flex items-center font-medium gap-2"
                >
                  <span>Try Free</span>
                  <ArrowRight className="h-4 w-4 opacity-90" />
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl md:hidden animate-in slide-in-from-top-5">
            <div className="space-y-1">
              <a
                href="https://clonecv.com/#features"
                className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="https://clonecv.com/#pricing"
                className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="https://clonecv.com/blogs"
                className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </a>
              <Link
                to="https://app.clonecv.com"
                className="block px-4 py-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <Button
                className="w-full  text-white h-12  rounded-full shadow-sm"
                asChild
              >
                <Link
                  to="https://app.clonecv.com/dashboard/resume"
                  target="_blank"
                  className="flex items-center justify-center font-medium gap-2"
                >
                  <span>Try Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
