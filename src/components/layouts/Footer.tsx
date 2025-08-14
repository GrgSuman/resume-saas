export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col-reverse md:flex-row-reverse justify-between items-center gap-4">
          {/* Essential Links */}
          <div className="flex flex-col md:flex-row items-center gap-8 text-base">
            <a href="/about" className="text-gray-600 hover:text-[#7060fc] transition-colors font-medium">
              About
            </a>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeA2tZS8ukqiGWVCFIGN-pOPZJ-krue3EM44vwZ47MiToU3wA/viewform?usp=preview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#7060fc] transition-colors font-medium"
            >
              Contact
            </a>
            <a href="/privacy" className="text-gray-600 hover:text-[#7060fc] transition-colors font-medium">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-600 hover:text-[#7060fc] transition-colors font-medium">
              Terms of Service
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 text-base">
            © 2025 CloneCV. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}