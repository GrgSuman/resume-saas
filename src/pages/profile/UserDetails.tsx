import DashboardHeader from "../../components/layouts/DashboardHeader"
import { useState } from "react";
import { 
  User, 
  CreditCard, 
  // Brain
} from "lucide-react";
import MyDetails from "./MyDetails";
import BillingHistory from "./BillingHistory";
// import AISettings from "./AISettings";
import axiosInstance from "../../api/axios";
import { useQuery } from "@tanstack/react-query";

const UserDetails = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/user");
      console.log(response.data);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return [];
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "credits", label: "My Usage & Credits", icon: CreditCard },
    // { id: "settings", label: "AI & Preferences", icon: Brain },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyDetails user={user} />
      case "credits":
        return <BillingHistory user={user} />
      // case "settings":
      //   return <AISettings />
      default:
        return null;
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tab Navigation */}
        <div className="border-b-2 border-black mb-8">
          <div className="flex space-x-1 overflow-x-auto light-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 md:flex-row md:gap-2 md:px-4 md:py-3 font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap min-w-[80px] md:min-w-0 ${
                  activeTab === tab.id
                    ? "bg-black text-white border-b-2 border-black"
                    : "text-black hover:bg-gray-100 border-b-2 border-transparent hover:border-black"
                }`}
              >
                <tab.icon className="h-4 w-4 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] md:min-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails