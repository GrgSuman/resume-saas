export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © 2025 CloneCV. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              Made with <span className="text-red-500">♥</span> 
              <span className="text-gray-500">serving 5000+ users</span>
            </span>
            
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeA2tZS8ukqiGWVCFIGN-pOPZJ-krue3EM44vwZ47MiToU3wA/viewform?usp=preview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}