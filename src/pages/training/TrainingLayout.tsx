import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function TrainingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/courses")) return "courses";
    if (location.pathname.includes("/requests")) return "requests";
    if (location.pathname.includes("/progress")) return "progress";
    return "courses"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/training/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="requests">Training Requests</TabsTrigger>
          <TabsTrigger value="progress">Progress Dashboard</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
