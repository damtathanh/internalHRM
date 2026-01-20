import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/permissions")) return "permissions";
    if (location.pathname.includes("/workflows")) return "workflows";
    if (location.pathname.includes("/master-data")) return "master-data";
    return "permissions"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="master-data">Master Data</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
