import { useState } from "react";
import { 
  User, 
  // CreditCard, 
  // Brain
} from "lucide-react";
import MyDetails from "./MyDetails";
// import BillingHistory from "./BillingHistory";
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
    // { id: "credits", label: "My Usage & Credits", icon: CreditCard },
    // { id: "settings", label: "AI & Preferences", icon: Brain },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyDetails user={user} />
      // case "credits":
      //   return <BillingHistory user={user} />
      // case "settings":
      //   return <AISettings />
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-600">Manage your profile and account preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-[#7060fc] border-[#7060fc]"
                  : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#7060fc]"></div>
              <p className="text-slate-600 font-medium">Loading your account details...</p>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  )
}

export default UserDetails