import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Calculator } from "lucide-react";
import { payrollService } from "../../services/payroll.service";
import type { PayrollComponent } from "../../types";

export function ComponentsPage() {
  const [payrollComponents, setPayrollComponents] = useState<PayrollComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const componentsData = await payrollService.getPayrollComponents();
        setPayrollComponents(componentsData);
      } catch (error) {
        console.error("Error loading payroll components:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Payroll Components Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollComponents.map((component) => (
              <div
                key={component.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{component.name}</h3>
                  <p className="text-sm text-muted-foreground">{component.employees} employees</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{component.amount}</div>
                  <div className="text-sm text-muted-foreground">{component.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
