import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function WorkforceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/departments")) return "departments";
    if (location.pathname.includes("/employees")) return "employees";
    if (location.pathname.includes("/grades")) return "grades";
    return "employees"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/workforce/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="grades">Salary Grades</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
