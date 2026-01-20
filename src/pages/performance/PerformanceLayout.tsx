import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function PerformanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/goals")) return "goals";
    if (location.pathname.includes("/reviews")) return "reviews";
    if (location.pathname.includes("/reports")) return "reports";
    return "goals"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/performance/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
