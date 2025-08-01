import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";

const Layout = () => {
  const [showNotification, setShowNotification] = useState(true);
  
  return (
    <div>
      <Header showNotification={showNotification} setShowNotification={setShowNotification} />
      <main className={showNotification ? "pt-16" : "pt-0"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
