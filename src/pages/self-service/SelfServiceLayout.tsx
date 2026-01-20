import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function SelfServiceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/leaves")) return "leaves";
    if (location.pathname.includes("/loans")) return "loans";
    if (location.pathname.includes("/documents")) return "documents";
    if (location.pathname.includes("/dependents")) return "dependents";
    return "leaves"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/self-service/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="loans">Loan Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="dependents">Dependents</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
