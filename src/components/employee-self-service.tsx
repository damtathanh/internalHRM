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
import { Checkbox } from "./ui/checkbox";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  FileText, 
  CreditCard, 
  Users, 
  Download,
  Clock,
  Home,
  Car
} from "lucide-react";
import { motion } from "motion/react";
import { attendanceService } from "../services/attendance.service";
import { loanService } from "../services/loan.service";
import { getStatusColor } from "../utils/status";
import { useAuth } from "../contexts/AuthContext";
import type { LeaveRequest, LoanRequest, Dependent } from "../types";

export function EmployeeSelfService() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);
  const [isLoanRequestOpen, setIsLoanRequestOpen] = useState(false);
  const [isAddDependentOpen, setIsAddDependentOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeeId = user?.id;
        const [leavesData, loansData, depsData] = await Promise.all([
          attendanceService.getLeaveRequests(employeeId ? { employeeId } : undefined),
          loanService.getLoanRequests(employeeId),
          loanService.getDependents(employeeId),
        ]);
        setLeaveRequests(leavesData);
        setLoanRequests(loansData);
        setDependents(depsData);
      } catch (error) {
        console.error("Error loading self-service data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2">Employee Self-Service</h1>
        <p className="text-muted-foreground">
          Access your personal information and submit requests.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <Calendar className="h-8 w-8 mx-auto text-blue-600" />
              <h3 className="font-medium">Request Leave</h3>
              <p className="text-xs text-muted-foreground">Submit leave application</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <DollarSign className="h-8 w-8 mx-auto text-green-600" />
              <h3 className="font-medium">Loan Request</h3>
              <p className="text-xs text-muted-foreground">Apply for loan/advance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <FileText className="h-8 w-8 mx-auto text-purple-600" />
              <h3 className="font-medium">Salary Letter</h3>
              <p className="text-xs text-muted-foreground">Download salary certificate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <CreditCard className="h-8 w-8 mx-auto text-orange-600" />
              <h3 className="font-medium">ID Card Request</h3>
              <p className="text-xs text-muted-foreground">Request new ID card</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaves" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="loans">Loans & Advances</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="dependents">Dependents</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Leave Requests
                </CardTitle>
                <Dialog open={isLeaveRequestOpen} onOpenChange={setIsLeaveRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Leave Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="leave-type">Leave Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="personal">Personal Leave</SelectItem>
                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                            <SelectItem value="emergency">Emergency Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leave-reason">Reason</Label>
                        <Textarea id="leave-reason" placeholder="Explain the reason for your leave request" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="half-day" />
                        <Label htmlFor="half-day">Half day leave</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsLeaveRequestOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Leave Balance Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Annual Leave</p>
                          <p className="text-xl font-bold">15 days</p>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Sick Leave</p>
                          <p className="text-xl font-bold">12 days</p>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Home className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Personal Leave</p>
                          <p className="text-xl font-bold">5 days</p>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.type}</TableCell>
                        <TableCell>{request.startDate}</TableCell>
                        <TableCell>{request.endDate}</TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Loans & Salary Advances
                </CardTitle>
                <Dialog open={isLoanRequestOpen} onOpenChange={setIsLoanRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Loan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Loan Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="loan-type">Loan Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="emergency">Emergency Loan</SelectItem>
                            <SelectItem value="advance">Salary Advance</SelectItem>
                            <SelectItem value="housing">Housing Loan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loan-amount">Requested Amount</Label>
                        <Input id="loan-amount" placeholder="SAR 0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loan-purpose">Purpose</Label>
                        <Textarea id="loan-purpose" placeholder="Explain the purpose of this loan" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loan-installments">Preferred Installments</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select installment period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                            <SelectItem value="36">36 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsLoanRequestOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Submit Request
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
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Installments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.type}</TableCell>
                      <TableCell>{request.amount}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.installments} months</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Salary Definition Letter</h3>
                        <p className="text-sm text-muted-foreground">Official salary certificate for bank/visa applications</p>
                        <Button size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Request Letter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-medium">Employee ID Card</h3>
                        <p className="text-sm text-muted-foreground">Request new or replacement ID card</p>
                        <Button size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Request ID Card
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Experience Certificate</h3>
                        <p className="text-sm text-muted-foreground">Employment experience and service certificate</p>
                        <Button size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Request Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Car className="h-10 w-10 text-orange-600" />
                      <div>
                        <h3 className="font-medium">Parking Permit</h3>
                        <p className="text-sm text-muted-foreground">Request parking access permit</p>
                        <Button size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Request Permit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependents" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Dependents & Insurance
                </CardTitle>
                <Dialog open={isAddDependentOpen} onOpenChange={setIsAddDependentOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Dependent
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Dependent</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dep-name">Full Name</Label>
                        <Input id="dep-name" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dep-relationship">Relationship</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="son">Son</SelectItem>
                            <SelectItem value="daughter">Daughter</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dep-birth">Birth Date</Label>
                        <Input id="dep-birth" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dep-id">ID Number</Label>
                        <Input id="dep-id" placeholder="Enter ID number" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dep-insurance" />
                        <Label htmlFor="dep-insurance">Include in medical insurance</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddDependentOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Add Dependent
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
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependents.map((dependent) => (
                    <TableRow key={dependent.id}>
                      <TableCell className="font-medium">{dependent.name}</TableCell>
                      <TableCell>{dependent.relationship}</TableCell>
                      <TableCell>{dependent.birthDate}</TableCell>
                      <TableCell>{dependent.idNumber}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={dependent.insurance ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {dependent.insurance ? 'Covered' : 'Not Covered'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}