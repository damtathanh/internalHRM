import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function AttendanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/overview")) return "overview";
    if (location.pathname.includes("/leaves")) return "leaves";
    if (location.pathname.includes("/remote")) return "remote";
    if (location.pathname.includes("/overtime")) return "overtime";
    return "overview"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/attendance/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Attendance Overview</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="remote">Remote Work</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
