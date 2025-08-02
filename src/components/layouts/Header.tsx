import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
}

export default function BrutalistHeader({ showNotification, setShowNotification }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* Top Notification Banner */}
      {showNotification && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-[#00E0C6] border-b-2 border-black">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 hidden sm:block"></div>
                             <div className="flex items-center gap-2">
                 <span className="text-black font-bold text-xs sm:text-sm uppercase tracking-wide">
                   🎉 LIMITED TIME: Get 15 FREE credits when you sign up!
                 </span>
                 <button
                   onClick={() => navigate("/signin")}
                   className="bg-black text-white px-2 sm:px-3 py-1 text-xs font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-all duration-200 whitespace-nowrap"
                 >
                   CLAIM NOW
                 </button>
               </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-black hover:text-gray-700 transition-colors duration-200 p-1"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header
        className={`fixed ${
          showNotification ? "top-10" : "top-0"
        } left-0 w-full z-50 bg-white border-b-4 border-black`}
      >
        <div className="container mx-auto px-4">
          <nav className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="font-black text-xl text-black uppercase tracking-tighter px-1 py-1 border-2 border-transparent"
            >
              CLONE
              <span className="bg-[#00E0C6] text-black px-2 inline-block transform -skew-x-12 ml-1">
                CV
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-1">
              <a
                href="/#features"
                className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                FEATURES
              </a>
              <a
                href="/#features"
                className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                HOW IT WORKS
              </a>
              <a
                href="/blogs"
                className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                BLOGS
              </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="/signin"
                className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                SIGN IN
              </a>
              <button
                className="px-4 py-2 font-bold text-sm uppercase tracking-wide bg-[#00E0C6] text-black border-2 border-black hover:bg-black hover:text-[#00E0C6] transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                TRY FREE
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
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
            <div className="py-2 space-y-1 bg-white border-t-2 border-black">
              <a
                href="/#features"
                className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                FEATURES
              </a>
              <a
                href="/#features"
                className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                HOW IT WORKS
              </a>

              <a
                href="/blogs"
                className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                BLOGS
              </a>

              <div className="flex flex-col space-y-2 pt-2 px-4">
                <a
                  href="/signin"
                  className="text-center px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  SIGN IN
                </a>
                <button
                  className="px-4 py-2 font-bold text-base uppercase tracking-wide bg-[#00E0C6] text-black border-2 border-black hover:bg-black hover:text-[#00E0C6] transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    navigate("/signin");
                    setMenuOpen(false);
                  }}
                >
                  TRY FREE
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
