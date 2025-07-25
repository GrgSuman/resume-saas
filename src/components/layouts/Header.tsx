import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function BrutalistHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigation = (path: string) => {
    console.log(`Navigate to: ${path}`)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b-4 border-black">
      <div className="container mx-auto px-4">
        <nav className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="font-black text-xl text-black uppercase tracking-tighter px-1 py-1 border-2 border-transparent"
          >
            CLONE
            <span className="bg-[#00E0C6] text-black px-2 inline-block transform -skew-x-12 ml-1">CV</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#features"
              className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              FEATURES
            </a>
            <a
              href="#how"
              className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              HOW IT WORKS
            </a>
            <a
              href="#pricing"
              className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              PRICING
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="/login"
              className="text-black font-bold text-sm uppercase tracking-wide px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
            >
              SIGN IN
            </a>
            <button
              className="px-4 py-2 font-bold text-sm uppercase tracking-wide bg-[#00E0C6] text-black border-2 border-black hover:bg-black hover:text-[#00E0C6] transition-all duration-200 cursor-pointer"
              onClick={() => handleNavigation("/dashboard")}
            >
              TRY FREE
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden ${menuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
          <div className="py-2 space-y-1 bg-white border-t-2 border-black">
            <a
              href="#features"
              className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              FEATURES
            </a>
            <a
              href="#how"
              className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              HOW IT WORKS
            </a>
            <a
              href="#pricing"
              className="block px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              PRICING
            </a>

            <div className="flex flex-col space-y-2 pt-2 px-4">
              <a
                href="/login"
                className="text-center px-4 py-2 text-black font-bold text-base uppercase tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                SIGN IN
              </a>
              <button
                className="px-4 py-2 font-bold text-base uppercase tracking-wide bg-[#00E0C6] text-black border-2 border-black hover:bg-black hover:text-[#00E0C6] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  handleNavigation("/dashboard")
                  setMenuOpen(false)
                }}
              >
                TRY FREE
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}