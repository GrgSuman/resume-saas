import { Link } from 'react-router'
import { Twitter, Github, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white text-slate-800 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        {/* Brand */}
        <div className="inline-flex items-center gap-2">
          <img src="/icon.png" alt="CloneCV" className="h-7 w-7 rounded" />
          <span className="text-xl font-semibold text-slate-900">CloneCV</span>
        </div>

        {/* Tagline */}
        <p className="mt-5 max-w-2xl mx-auto text-slate-500 font-medium text-sm sm:text-base leading-6">
        The world's first conversational AI resume builder. Create professional, ATS-optimized resumes by chatting with AI. No forms required.
        </p>

        {/* Socials */}
        <div className="mt-6 flex items-center justify-center gap-8 text-slate-600">
          <Link to="https://twitter.com" className="inline-flex items-center gap-2 hover:text-slate-900">
            <Twitter className="h-5 w-5" /> <span className="text-sm">Twitter</span>
          </Link>
          <Link to="https://github.com" className="inline-flex items-center gap-2 hover:text-slate-900">
            <Github className="h-5 w-5" /> <span className="text-sm">GitHub</span>
          </Link>
          <Link to="/discord" className="inline-flex items-center gap-2 hover:text-slate-900">
            <MessageCircle className="h-5 w-5" /> <span className="text-sm">Discord</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-xs text-slate-500">
          © 2026 CloneCV. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer