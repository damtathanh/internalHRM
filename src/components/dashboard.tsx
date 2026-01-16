import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  FileText,
  UserPlus
} from "lucide-react";
import { dashboardService } from "../services/dashboard.service";
import { getStatusColor } from "../utils/status";
import type { DashboardStat, RecentRequest, UpcomingEvent } from "../types";

const getEventIcon = (type: string) => {
  switch (type) {
    case "training": return Calendar;
    case "review": return CheckCircle;
    case "onboarding": return UserPlus;
    default: return Clock;
  }
};

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, requestsData, eventsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentRequests(5),
          dashboardService.getUpcomingEvents(10),
        ]);
        setStats(statsData);
        setRecentRequests(requestsData);
        setUpcomingEvents(eventsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">HR Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your organization today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-4 text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          stats.map((stat, index) => (
          <div key={stat.title}>
            <Card className="glass-card border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Payroll Progress */}
        <div>
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Payroll Cycle Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Collection</span>
                  <span className="text-green-600">Completed</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing</span>
                  <span className="text-blue-600">In Progress</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Approval</span>
                  <span className="text-gray-500">Pending</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <Button className="w-full gradient-primary text-white">
                View Payroll Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests */}
        <div>
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
                ) : (
                  recentRequests.slice(0, 4).map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.type}</p>
                      <p className="text-xs text-muted-foreground">{request.employee}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
                ) : (
                  upcomingEvents.map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-start gap-3">
                      <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  );
                  })
                )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col gap-2" variant="outline">
                <UserPlus className="h-6 w-6" />
                Add Employee
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Calendar className="h-6 w-6" />
                Schedule Interview
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <DollarSign className="h-6 w-6" />
                Run Payroll
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <FileText className="h-6 w-6" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}