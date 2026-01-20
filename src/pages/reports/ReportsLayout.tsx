import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function ReportsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/kpis")) return "kpis";
    if (location.pathname.includes("/payroll")) return "payroll";
    if (location.pathname.includes("/attendance")) return "attendance";
    if (location.pathname.includes("/org-charts")) return "org-charts";
    return "kpis"; // default
  };

  const handleTabChange = (value: string) => {
    const routeMap: Record<string, string> = {
      "kpis": "/reports/kpis",
      "payroll": "/reports/payroll",
      "attendance": "/reports/attendance",
      "org-charts": "/reports/org-charts"
    };
    navigate(routeMap[value] || "/reports/kpis");
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpis">HR KPIs</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Insights</TabsTrigger>
          <TabsTrigger value="org-charts">Org Charts</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
