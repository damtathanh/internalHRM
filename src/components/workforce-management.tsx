import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Building2, 
  Users, 
  Briefcase,
  DollarSign
} from "lucide-react";
import { employeeService } from "../services/employee.service";
import { getStatusColor } from "../utils/status";
import type { Department, Position, SalaryGrade } from "../types";

export function WorkforceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [salaryGrades, setSalaryGrades] = useState<SalaryGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptsData, posData, gradesData] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getPositions(),
          employeeService.getSalaryGrades(),
        ]);
        setDepartments(deptsData);
        setPositions(posData);
        setSalaryGrades(gradesData);
      } catch (error) {
        console.error("Error loading workforce data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Workforce Management</h1>
        <p className="text-muted-foreground">
          Manage departments, positions, and organizational structure.
        </p>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="positions">Jobs & Positions</TabsTrigger>
          <TabsTrigger value="grades">Salary Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Departments
                </CardTitle>
                <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dept-name">Department Name</Label>
                        <Input id="dept-name" placeholder="Enter department name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-manager">Department Manager</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sarah">Sarah Johnson</SelectItem>
                            <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                            <SelectItem value="linda">Linda Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-budget">Annual Budget</Label>
                        <Input id="dept-budget" placeholder="Enter budget amount" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-description">Description</Label>
                        <Textarea id="dept-description" placeholder="Department description" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Create Department
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {dept.employees}
                        </div>
                      </TableCell>
                      <TableCell>{dept.budget}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(dept.status)}>
                          {dept.status}
                        </Badge>
                      </TableCell>
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
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Positions
                </CardTitle>
                <Dialog open={isAddPositionOpen} onOpenChange={setIsAddPositionOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Position
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Position</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pos-title">Job Title</Label>
                        <Input id="pos-title" placeholder="Enter job title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pos-department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="eng">Engineering</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pos-level">Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid-Level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pos-openings">Number of Openings</Label>
                        <Input id="pos-openings" type="number" placeholder="Enter number" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddPositionOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Create Position
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
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Openings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{position.department}</TableCell>
                      <TableCell>{position.level}</TableCell>
                      <TableCell>{position.openings}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(position.status)}>
                          {position.status}
                        </Badge>
                      </TableCell>
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
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}