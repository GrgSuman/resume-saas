import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import CircularLoadingIndicator from "../sections/CircularLoadingIndicator";

const Layout = () => {
  const { authStates } = useAuth();
  if(authStates.isLoading){
    return <CircularLoadingIndicator />;
  }
  return (
    <div>
      <Header/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
