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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Eye, 
  Calendar,
  UserPlus,
  FileText,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { recruitmentService } from "../services/recruitment.service";
import { getStatusColor, getPriorityColor } from "../utils/status";
import type { HiringRequest, Application, Interview } from "../types";

export function Recruitment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsData, appsData, interviewsData] = await Promise.all([
          recruitmentService.getHiringRequests(),
          recruitmentService.getApplications(),
          recruitmentService.getInterviews(),
        ]);
        setHiringRequests(requestsData);
        setApplications(appsData);
        setInterviews(interviewsData);
      } catch (error) {
        console.error("Error loading recruitment data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Recruitment & Onboarding</h1>
        <p className="text-muted-foreground">
          Manage hiring requests, applications, and interview processes.
        </p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Hiring Requests</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Hiring Plan Requests
                </CardTitle>
                <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Hiring Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="req-position">Position</Label>
                        <Input id="req-position" placeholder="Enter position title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="req-department">Department</Label>
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
                        <Label htmlFor="req-priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="req-deadline">Deadline</Label>
                        <Input id="req-deadline" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="req-justification">Justification</Label>
                        <Textarea id="req-justification" placeholder="Reason for hiring request" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddRequestOpen(false)}>
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
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hiringRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.position}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.deadline}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
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

        <TabsContent value="applications" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Job Applications
                </CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-lg p-4 glass-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={application.avatar} />
                          <AvatarFallback>{application.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium">{application.name}</h3>
                            <p className="text-sm text-muted-foreground">{application.position}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{application.email}</span>
                            <span>{application.phone}</span>
                            <span>{application.experience} experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{application.rating}/5</span>
                            <span className="text-xs text-muted-foreground">Applied {application.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button size="sm" className="gradient-primary text-white">
                          Schedule Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Interview Schedule
                </CardTitle>
                <Dialog open={isScheduleInterviewOpen} onOpenChange={setIsScheduleInterviewOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Interview</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="int-candidate">Candidate</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select candidate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="omar">Omar Abdullah</SelectItem>
                            <SelectItem value="fatima">Fatima Al-Zahra</SelectItem>
                            <SelectItem value="john">John Mitchell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="int-interviewer">Interviewer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ahmed">Ahmed Al-Rashid</SelectItem>
                            <SelectItem value="sarah">Sarah Johnson</SelectItem>
                            <SelectItem value="linda">Linda Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="int-date">Date</Label>
                          <Input id="int-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="int-time">Time</Label>
                          <Input id="int-time" type="time" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="int-type">Interview Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="behavioral">Behavioral</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="panel">Panel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsScheduleInterviewOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="gradient-primary text-white">
                          Schedule
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
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.candidate}</TableCell>
                      <TableCell>{interview.position}</TableCell>
                      <TableCell>{interview.interviewer}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{interview.date}</div>
                          <div className="text-sm text-muted-foreground">{interview.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{interview.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {interview.status === 'scheduled' && (
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                New Employee Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Onboarding Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Documentation</span>
                            <span className="text-green-600">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>System Access</span>
                            <span className="text-blue-600">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Training Modules</span>
                            <span className="text-orange-600">50%</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Hires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JM</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Mitchell</p>
                            <p className="text-xs text-muted-foreground">Senior Engineer - Day 3</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Aisha Salam</p>
                            <p className="text-xs text-muted-foreground">Marketing Specialist - Day 1</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}