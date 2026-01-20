import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function RecruitmentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/hiring-requests")) return "requests";
    if (location.pathname.includes("/applications")) return "applications";
    if (location.pathname.includes("/interviews")) return "interviews";
    if (location.pathname.includes("/onboarding")) return "onboarding";
    return "requests"; // default
  };

  const handleTabChange = (value: string) => {
    const routeMap: Record<string, string> = {
      "requests": "/recruitment/hiring-requests",
      "applications": "/recruitment/applications",
      "interviews": "/recruitment/interviews",
      "onboarding": "/recruitment/onboarding"
    };
    navigate(routeMap[value] || "/recruitment/hiring-requests");
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Hiring Requests</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
