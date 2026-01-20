import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Play, FileText, Download } from "lucide-react";
import { payrollService } from "../../services/payroll.service";
import { getStatusColor } from "../../utils/status";
import type { PayrollRun } from "../../types";

export function PayrollRunsPage() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const runsData = await payrollService.getPayrollRuns();
        setPayrollRuns(runsData);
      } catch (error) {
        console.error("Error loading payroll runs:", error);
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Payroll Runs
            </CardTitle>
            <Button className="gradient-primary text-white">
              <Play className="h-4 w-4 mr-2" />
              Run Payroll
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Payroll Progress */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">February 2024 Payroll</h3>
                  <p className="text-sm text-muted-foreground">Processing 1,251 employees</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  In Progress
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance Data Collection</span>
                    <span className="text-green-600">Completed</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Salary Calculations</span>
                    <span className="text-blue-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deductions & Benefits</span>
                    <span className="text-gray-500">Pending</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Run Date</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.period}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(run.status)}>
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{run.employees.toLocaleString()}</TableCell>
                    <TableCell>{run.totalAmount}</TableCell>
                    <TableCell>{run.runDate}</TableCell>
                    <TableCell>{run.approvedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
