import { useState } from "react";
import { Menu, X } from "lucide-react";


export default function BrutalistHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const siteURL = "https://clonecv.com"
  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur border-b border-slate-200`}
      >
        <div className="container mx-auto px-4">
          <nav className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href={siteURL}
              className="flex items-center gap-2 font-semibold text-xl text-slate-900 tracking-tight px-1 py-1"
            >
              <img src="/icon.png" alt="CloneCV logo" className="h-7 w-7" />
              <span className="text-xl pt-[5px]">
                Clone<span className="text-[#7060fc]">CV</span>
              </span>
            </a>

            {/* Desktop Navigation and Buttons (right side) */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="/signin"
                className="text-slate-800 font-medium text-base px-4 py-2 rounded-lg border border-black hover:bg-slate-50 transition-colors"
              >
                Sign in
              </a>
              <a href="/signin"
                className="px-4 py-2 font-medium text-base rounded-lg bg-[#7060fc] text-white hover:bg-[#6050e5] transition-colors cursor-pointer"
              >
                Try free
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={24} strokeWidth={3} />
              ) : (
                <Menu size={24} strokeWidth={3} />
              )}
            </button>
          </nav>

          {/* Mobile Menu */}
            <div
            className={`md:hidden ${
              menuOpen ? "block" : "hidden"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="py-2 space-y-1 bg-white/80 backdrop-blur border-t border-slate-200">
              <div className="flex flex-col space-y-2 pt-2 px-4">
                <a
                  href="/signin"
                    className="text-center px-4 py-2 text-slate-800 font-medium text-lg rounded-lg border border-black hover:bg-slate-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </a>
                <a href="/signin"
                    className="text-center px-4 py-2 font-medium text-lg rounded-lg bg-[#7060fc] text-white hover:bg-[#6050e5] transition-colors cursor-pointer"
                >
                  Try free
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
