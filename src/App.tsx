import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider
} from "./components/ui/sidebar";
import { AppHeader } from "./components/app-header";
import { Dashboard } from "./components/dashboard";
import { WorkforceManagement } from "./components/workforce-management";
import { Recruitment } from "./components/recruitment";
import { Payroll } from "./components/payroll";
import { EmployeeSelfService } from "./components/employee-self-service";
import { Login } from "./components/login";
import { useAuth } from "./contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Target, 
  DollarSign, 
  Calculator, 
  Clock, 
  User, 
  BarChart3, 
  Settings,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  Award,
  CreditCard,
  UserCheck,
  TrendingUp,
  Shield
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard"
  },
  {
    title: "Workforce Management",
    icon: Building2,
    key: "workforce",
    submenu: [
      { title: "Departments", icon: Building2, key: "departments" },
      { title: "Jobs & Positions", icon: Briefcase, key: "positions" },
      { title: "Salary Grades", icon: DollarSign, key: "grades" }
    ]
  },
  {
    title: "Recruitment & Onboarding",
    icon: UserPlus,
    key: "recruitment",
    submenu: [
      { title: "Hiring Requests", icon: FileText, key: "hiring-requests" },
      { title: "Applications", icon: UserPlus, key: "applications" },
      { title: "Interviews", icon: Calendar, key: "interviews" },
      { title: "Onboarding", icon: UserCheck, key: "onboarding" }
    ]
  },
  {
    title: "Training & Development",
    icon: GraduationCap,
    key: "training",
    submenu: [
      { title: "Training Courses", icon: GraduationCap, key: "courses" },
      { title: "Training Requests", icon: FileText, key: "training-requests" },
      { title: "Progress Dashboard", icon: TrendingUp, key: "training-progress" }
    ]
  },
  {
    title: "Performance Evaluation",
    icon: Target,
    key: "performance",
    submenu: [
      { title: "Goal Setting", icon: Target, key: "goals" },
      { title: "Reviews", icon: Award, key: "reviews" },
      { title: "Reports", icon: BarChart3, key: "performance-reports" }
    ]
  },
  {
    title: "Compensation & Promotions",
    icon: Award,
    key: "compensation",
    submenu: [
      { title: "Annual Bonuses", icon: DollarSign, key: "bonuses" },
      { title: "Promotions", icon: TrendingUp, key: "promotions" },
      { title: "Allowances", icon: CreditCard, key: "allowances" }
    ]
  },
  {
    title: "Payroll & Benefits",
    icon: Calculator,
    key: "payroll",
    submenu: [
      { title: "Payroll Runs", icon: Calculator, key: "payroll-runs" },
      { title: "Payslips", icon: FileText, key: "payslips" },
      { title: "GOSI Integration", icon: Shield, key: "gosi" },
      { title: "Bank Transfers", icon: CreditCard, key: "transfers" }
    ]
  },
  {
    title: "Attendance & Leaves",
    icon: Clock,
    key: "attendance",
    submenu: [
      { title: "Attendance Overview", icon: Clock, key: "attendance-overview" },
      { title: "Leave Management", icon: Calendar, key: "leaves" },
      { title: "Remote Work", icon: Users, key: "remote-work" },
      { title: "Overtime", icon: Clock, key: "overtime" }
    ]
  },
  {
    title: "Employee Self-Service",
    icon: User,
    key: "self-service",
    submenu: [
      { title: "Leave Requests", icon: Calendar, key: "employee-leaves" },
      { title: "Loan Requests", icon: DollarSign, key: "employee-loans" },
      { title: "Documents", icon: FileText, key: "employee-documents" },
      { title: "Dependents", icon: Users, key: "employee-dependents" }
    ]
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    key: "reports",
    submenu: [
      { title: "HR KPIs", icon: BarChart3, key: "hr-kpis" },
      { title: "Payroll Summary", icon: Calculator, key: "payroll-reports" },
      { title: "Attendance Insights", icon: Clock, key: "attendance-reports" },
      { title: "Org Charts", icon: Building2, key: "org-charts" }
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    key: "admin",
    submenu: [
      { title: "Permissions", icon: Shield, key: "permissions" },
      { title: "Workflows", icon: Settings, key: "workflows" },
      { title: "Master Data", icon: Settings, key: "master-data" }
    ]
  }
];

export default function App() {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.dir = 'rtl';
    } else {
      document.documentElement.classList.remove('rtl');
      document.dir = 'ltr';
    }
  }, [isRTL]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    setCurrentLanguage(newLang);
    setIsRTL(newLang === 'ar');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "workforce":
      case "departments":
      case "positions":
      case "grades":
        return <WorkforceManagement />;
      case "recruitment":
      case "hiring-requests":
      case "applications":
      case "interviews":
      case "onboarding":
        return <Recruitment />;
      case "payroll":
      case "payroll-runs":
      case "payslips":
      case "gosi":
      case "transfers":
        return <Payroll />;
      case "self-service":
      case "employee-leaves":
      case "employee-loans":
      case "employee-documents":
      case "employee-dependents":
        return <EmployeeSelfService />;
      case "training":
      case "courses":
      case "training-requests":
      case "training-progress":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Training & Development</h2>
              <p className="text-muted-foreground">Training module coming soon...</p>
            </div>
          </div>
        );
      case "performance":
      case "goals":
      case "reviews":
      case "performance-reports":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Target className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Performance Evaluation</h2>
              <p className="text-muted-foreground">Performance module coming soon...</p>
            </div>
          </div>
        );
      case "compensation":
      case "bonuses":
      case "promotions":
      case "allowances":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Award className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Compensation & Promotions</h2>
              <p className="text-muted-foreground">Compensation module coming soon...</p>
            </div>
          </div>
        );
      case "attendance":
      case "attendance-overview":
      case "leaves":
      case "remote-work":
      case "overtime":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Attendance & Leaves</h2>
              <p className="text-muted-foreground">Attendance module coming soon...</p>
            </div>
          </div>
        );
      case "reports":
      case "hr-kpis":
      case "payroll-reports":
      case "attendance-reports":
      case "org-charts":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Reports & Analytics</h2>
              <p className="text-muted-foreground">Reports module coming soon...</p>
            </div>
          </div>
        );
      case "admin":
      case "permissions":
      case "workflows":
      case "master-data":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Settings className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2>Administration</h2>
              <p className="text-muted-foreground">Admin module coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">HR Management</h2>
                <p className="text-xs text-muted-foreground">
                  {currentLanguage === 'ar' ? 'نظام إدارة الموارد البشرية' : 'Hello Health Group'}
                </p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveModule(item.key)}
                    isActive={activeModule === item.key || (item.submenu && item.submenu.some(sub => sub.key === activeModule))}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.submenu && (activeModule === item.key || item.submenu.some(sub => sub.key === activeModule)) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <SidebarMenuButton
                          key={subItem.key}
                          onClick={() => setActiveModule(subItem.key)}
                          isActive={activeModule === subItem.key}
                          size="sm"
                          className="w-full text-sm"
                        >
                          <subItem.icon className="h-3 w-3" />
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              <p>© 2026 All right reserved</p>
              <p>HR Management System v1.0</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <AppHeader 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isRTL={isRTL}
            toggleLanguage={toggleLanguage}
            currentLanguage={currentLanguage}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}