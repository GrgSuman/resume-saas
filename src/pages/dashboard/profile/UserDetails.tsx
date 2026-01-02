import MyDetails from "./MyDetails";
import axiosInstance from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";

const UserDetails = () => {
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

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your profile and account preferences.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#7060fc]"></div>
              <p className="text-slate-600 font-medium">Loading your account details...</p>
            </div>
          </div>
        ) : (
          <MyDetails user={user} />
        )}
      </div>
    </div>
  )
}

export default UserDetails