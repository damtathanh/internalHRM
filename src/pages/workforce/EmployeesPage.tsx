import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Plus, Search, Edit2 } from "lucide-react";
import { useProfile } from "../../auth/ProfileContext";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  getEmployeeById,
  getPositions,
  getDepartments,
  getJobGradesByPosition,
} from "../../services/workforce.service";
import type { EmployeeListItem, Role, EmployeeStatus } from "../../types";

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  title: string;
}

interface JobGrade {
  id: string;
  position_id: string;
  position_title?: string | null;
}

export function EmployeesPage() {
  const { role } = useProfile();
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [availableJobGrades, setAvailableJobGrades] = useState<JobGrade[]>([]);
  const [managers, setManagers] = useState<EmployeeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);

  // Form states for Add Employee
  const [addFormData, setAddFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position_id: "",
    department_id: "",
    manager_id: "",
    job_grade_id: "",
    status: "active" as EmployeeStatus,
  });

  // Form states for Edit Employee
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position_id: "",
    department_id: "",
    manager_id: "",
    job_grade_id: "",
    status: "active" as EmployeeStatus,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesData, deptsData, positionsData] = await Promise.all([
        getEmployees().catch((err) => {
          console.error("Error in getEmployees:", err);
          return [];
        }),
        getDepartments().catch((err) => {
          console.error("Error in getDepartments:", err);
          return [];
        }),
        getPositions().catch((err) => {
          console.error("Error in getPositions:", err);
          return [];
        }),
      ]);
      
      // Ensure arrays are valid before setting state
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setDepartments(Array.isArray(deptsData) ? deptsData : []);
      setPositions(Array.isArray(positionsData) ? positionsData : []);
      
      // Managers are employees with manager or admin role
      // For now, use all employees as potential managers
      // Ensure managers array is valid
      setManagers(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty arrays on error to prevent crashes
      setEmployees([]);
      setDepartments([]);
      setPositions([]);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    const { error } = await createEmployee({
      full_name: addFormData.full_name,
      email: addFormData.email,
      phone: addFormData.phone || undefined,
      position_id: addFormData.position_id || undefined,
      department_id: addFormData.department_id || undefined,
      manager_id: addFormData.manager_id || undefined,
      job_grade_id: addFormData.job_grade_id || undefined,
      status: addFormData.status,
    });

    if (!error) {
      setIsAddEmployeeOpen(false);
      setAddFormData({
        full_name: "",
        email: "",
        phone: "",
        position_id: "",
        department_id: "",
        manager_id: "",
        job_grade_id: "",
        status: "active",
      });
      setAvailableJobGrades([]);
      loadData();
    }
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    const { error } = await updateEmployee(selectedEmployee.id, {
      full_name: editFormData.full_name,
      email: editFormData.email,
      phone: editFormData.phone || undefined,
      position_id: editFormData.position_id || undefined,
      department_id: editFormData.department_id || undefined,
      manager_id: editFormData.manager_id || undefined,
      job_grade_id: editFormData.job_grade_id || undefined,
      status: editFormData.status,
    });

    if (!error) {
      setIsEditEmployeeOpen(false);
      setSelectedEmployee(null);
      setAvailableJobGrades([]);
      loadData();
    }
  };

  const openEditDialog = async (employee: EmployeeListItem) => {
    // Safety check: ensure employee exists
    if (!employee || !employee.id) {
      console.error("Cannot open edit dialog: invalid employee data");
      return;
    }

    setSelectedEmployee(employee);
    
    try {
      // Fetch raw employee record from employees table (not view)
      const rawEmployee = await getEmployeeById(employee.id);
      
      if (rawEmployee) {
        setEditFormData({
          full_name: rawEmployee.full_name || "",
          email: rawEmployee.email || "",
          phone: rawEmployee.phone || "",
          position_id: rawEmployee.position_id || "",
          department_id: rawEmployee.department_id || "",
          manager_id: rawEmployee.manager_id || "",
          job_grade_id: rawEmployee.job_grade_id || "",
          status: rawEmployee.status || "active",
        });
        
        // Load job grades for the selected position if position exists
        if (rawEmployee.position_id) {
          try {
            const jobGrades = await getJobGradesByPosition(rawEmployee.position_id);
            setAvailableJobGrades(Array.isArray(jobGrades) ? jobGrades : []);
          } catch (err) {
            console.error("Error loading job grades:", err);
            setAvailableJobGrades([]);
          }
        } else {
          setAvailableJobGrades([]);
        }
      } else {
        // Fallback to display data if raw fetch fails
        console.warn("Could not fetch raw employee data, using display data");
        setEditFormData({
          full_name: employee.full_name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          position_id: "",
          department_id: "",
          manager_id: "",
          job_grade_id: "",
          status: employee.status || "active",
          system_role: "employee",
        });
        setAvailableJobGrades([]);
      }
    } catch (error) {
      console.error("Error opening edit dialog:", error);
      // Set safe defaults on error
      setEditFormData({
        full_name: employee.full_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        position_id: "",
        department_id: "",
        manager_id: "",
        job_grade_id: "",
        status: employee.status || "active",
        system_role: "employee",
      });
      setAvailableJobGrades([]);
    }
    
    setIsEditEmployeeOpen(true);
  };

  const filteredEmployees = (employees || []).filter((employee) => {
    if (!employee) return false;
    
    // If no search term, show all employees
    if (!searchTerm || searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = (employee.full_name || '').toLowerCase();
    const email = (employee.email || '').toLowerCase();
    const phone = (employee.phone || '').toLowerCase();
    const position = (employee.position || '').toLowerCase();
    const department = (employee.department || '').toLowerCase();
    const manager = (employee.manager || '').toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower) ||
      position.includes(searchLower) ||
      department.includes(searchLower) ||
      manager.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Employees</CardTitle>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter employee information. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <Separator />
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="add-full-name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="add-full-name"
                        placeholder="John Doe"
                        value={addFormData.full_name}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, full_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="add-email"
                        type="email"
                        placeholder="employee@example.com"
                        value={addFormData.email}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-phone">Phone</Label>
                      <Input
                        id="add-phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={addFormData.phone}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Work Information</h3>
                    <Separator />
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="add-position">Position</Label>
                      <Select
                        value={addFormData.position_id}
                        onValueChange={async (value) => {
                          setAddFormData({ ...addFormData, position_id: value, job_grade_id: "" });
                          // Load job grades for selected position
                          if (value) {
                            const jobGrades = await getJobGradesByPosition(value);
                            setAvailableJobGrades(jobGrades);
                          } else {
                            setAvailableJobGrades([]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {positions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-department">Department</Label>
                      <Select
                        value={addFormData.department_id}
                        onValueChange={(value) =>
                          setAddFormData({ ...addFormData, department_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-manager">Manager</Label>
                      <Select
                        value={addFormData.manager_id}
                        onValueChange={(value) =>
                          setAddFormData({ ...addFormData, manager_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {managers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-job-grade">Job Grade</Label>
                      <Select
                        value={addFormData.job_grade_id}
                        onValueChange={(value) =>
                          setAddFormData({ ...addFormData, job_grade_id: value })
                        }
                        disabled={!addFormData.position_id || availableJobGrades.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={!addFormData.position_id ? "Select position first" : availableJobGrades.length === 0 ? "No job grades available" : "Select job grade"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableJobGrades.map((jg) => (
                            <SelectItem key={jg.id} value={jg.id}>
                              {jg.position_title || "Job Grade"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-status">Status</Label>
                      <Select
                        value={addFormData.status}
                        onValueChange={(value) =>
                          setAddFormData({ ...addFormData, status: value as EmployeeStatus })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="resigned">Resigned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* System Role Section (Internal Only) */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">System Role (Internal)</h3>
                    <Separator />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="add-system-role">System Role</Label>
                    <Select
                      value={addFormData.system_role}
                      onValueChange={(value) =>
                        setAddFormData({ ...addFormData, system_role: value as Role })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      System role is for permission management only and will not be displayed in the employees table.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} className="gradient-primary text-white">
                    Create Employee
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer"
                      onClick={() => openEditDialog(employee)}
                    >
                      <TableCell className="font-medium">
                        {employee.full_name || "N/A"}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone || "—"}</TableCell>
                      <TableCell>{employee.position || "—"}</TableCell>
                      <TableCell>{employee.department || "—"}</TableCell>
                      <TableCell>{employee.manager || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            employee.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : employee.status === "on_leave"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(employee);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-6 py-4">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <Separator />
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-full-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-full-name"
                      value={editFormData.full_name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Work Information Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Work Information</h3>
                  <Separator />
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-position">Position</Label>
                    <Select
                      value={editFormData.position_id}
                      onValueChange={async (value) => {
                        setEditFormData({ ...editFormData, position_id: value, job_grade_id: "" });
                        // Load job grades for selected position
                        if (value) {
                          const jobGrades = await getJobGradesByPosition(value);
                          setAvailableJobGrades(jobGrades);
                        } else {
                          setAvailableJobGrades([]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select
                      value={editFormData.department_id}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, department_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-manager">Manager</Label>
                    <Select
                      value={editFormData.manager_id}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, manager_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, status: value as EmployeeStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* System Role Section (Internal Only) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">System Role (Internal)</h3>
                  <Separator />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-system-role">System Role</Label>
                  <Select
                    value={editFormData.system_role}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, system_role: value as Role })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    System role is for permission management only and will not be displayed in the employees table.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditEmployee} className="gradient-primary text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
