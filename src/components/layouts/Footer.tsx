export default function BrutalistFooter() {
  return (
    <footer className="py-12 bg-white border-t-4 border-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-base font-mono text-gray-600 border-2 border-black px-4 py-2 bg-white">
            © 2025 CLONECV. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-base">
            <span className="font-black uppercase border-2 border-black px-4 py-2 bg-white">
              MADE WITH <span className="text-red-500">♥</span>
            </span>
            <span className="font-black uppercase border-2 border-black px-4 py-2 bg-[#00E0C6]">
              TRUSTED BY 100+ USERS
            </span>
            <span role="button" onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSeA2tZS8ukqiGWVCFIGN-pOPZJ-krue3EM44vwZ47MiToU3wA/viewform?usp=preview", "_blank")} className="font-black uppercase border-2 border-black px-4 py-2 cursor-pointer bg-white">
              CONTACT US
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}