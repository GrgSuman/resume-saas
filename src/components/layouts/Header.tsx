import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-semibold text-2xl hover:text-gray-700 transition-colors">
          CVFAST
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-700 hover:text-black transition-colors">
            Features
          </a>
          <a href="#how" className="text-gray-700 hover:text-black transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-gray-700 hover:text-black transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Sign in
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 transition-all duration-200"
            onClick={() => navigate("/dashboard")}
          >
            Try free
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-4">
          <a href="#features" className="block text-gray-700 hover:text-black transition-colors">
            Features
          </a>
          <a href="#how" className="block text-gray-700 hover:text-black transition-colors">
            How it works
          </a>
          <a href="#pricing" className="block text-gray-700 hover:text-black transition-colors">
            Pricing
          </a>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => navigate("/login")} size="sm" className="flex-1">
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 transition-all duration-200"
              onClick={() => navigate("/dashboard")}
            >
              Try free
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
