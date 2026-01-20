import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar, Edit2, CheckCircle } from "lucide-react";
import { recruitmentService } from "../../services/recruitment.service";
import { getStatusColor } from "../../utils/status";
import type { Interview } from "../../types";

export function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const interviewsData = await recruitmentService.getInterviews();
        setInterviews(interviewsData);
      } catch (error) {
        console.error("Error loading interviews:", error);
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
    </div>
  );
}
