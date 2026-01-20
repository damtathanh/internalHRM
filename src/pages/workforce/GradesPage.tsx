import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Plus, Edit2, Trash2, DollarSign } from "lucide-react";
import { employeeService } from "../../services/employee.service";
import type { SalaryGrade } from "../../types";

export function GradesPage() {
  const [salaryGrades, setSalaryGrades] = useState<SalaryGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gradesData = await employeeService.getSalaryGrades();
        setSalaryGrades(gradesData);
      } catch (error) {
        console.error("Error loading salary grades:", error);
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
              <DollarSign className="h-5 w-5 text-primary" />
              Salary Grades
            </CardTitle>
            <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Grade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Salary Grade</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade-code">Grade Code</Label>
                    <Input id="grade-code" placeholder="e.g., G6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade-level">Level</Label>
                    <Input id="grade-level" placeholder="e.g., Manager" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-salary">Minimum Salary</Label>
                      <Input id="min-salary" placeholder="SAR 0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-salary">Maximum Salary</Label>
                      <Input id="max-salary" placeholder="SAR 0" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="gradient-primary text-white">
                      Create Grade
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Minimum Salary</TableHead>
                <TableHead>Maximum Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.grade}</TableCell>
                  <TableCell>{grade.level}</TableCell>
                  <TableCell>{grade.minSalary}</TableCell>
                  <TableCell>{grade.maxSalary}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
