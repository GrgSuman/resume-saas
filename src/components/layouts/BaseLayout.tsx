import { Outlet } from "react-router";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";

const Layout = () => {
  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Settings</Button>
            <Button variant="ghost">Logout</Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="p-4 bg-gray-200">Footer</footer>
    </div>
  );
};

export default Layout;
