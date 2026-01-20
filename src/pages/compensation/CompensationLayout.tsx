import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function CompensationLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab value from URL path
  const getTabValue = () => {
    if (location.pathname.includes("/bonuses")) return "bonuses";
    if (location.pathname.includes("/promotions")) return "promotions";
    if (location.pathname.includes("/allowances")) return "allowances";
    return "bonuses"; // default
  };

  const handleTabChange = (value: string) => {
    navigate(`/compensation/${value}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bonuses">Annual Bonuses</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="allowances">Allowances</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
