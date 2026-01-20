import { Outlet, useLocation, NavLink } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider
} from "../../components/ui/sidebar";
import { AppHeader } from "../../components/app-header";
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
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

const allNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
    module: "dashboard",
    path: "/dashboard"
  },
  {
    title: "Workforce Management",
    icon: Building2,
    key: "workforce",
    module: "workforce",
    path: "/workforce",
    submenu: [
      { title: "Employees", icon: Users, key: "employees", module: "workforce", path: "/workforce/employees" },
      { title: "Departments", icon: Building2, key: "departments", module: "workforce", path: "/workforce/departments" },
      { title: "Salary Grades", icon: DollarSign, key: "grades", module: "workforce", path: "/workforce/grades" }
    ]
  },
  {
    title: "Recruitment & Onboarding",
    icon: UserPlus,
    key: "recruitment",
    module: "recruitment",
    path: "/recruitment",
    submenu: [
      { title: "Hiring Requests", icon: FileText, key: "hiring-requests", module: "recruitment", path: "/recruitment/hiring-requests" },
      { title: "Applications", icon: UserPlus, key: "applications", module: "recruitment", path: "/recruitment/applications" },
      { title: "Interviews", icon: Calendar, key: "interviews", module: "recruitment", path: "/recruitment/interviews" },
      { title: "Onboarding", icon: UserCheck, key: "onboarding", module: "recruitment", path: "/recruitment/onboarding" }
    ]
  },
  {
    title: "Training & Development",
    icon: GraduationCap,
    key: "training",
    module: "training",
    path: "/training",
    submenu: [
      { title: "Training Courses", icon: GraduationCap, key: "courses", module: "training", path: "/training/courses" },
      { title: "Training Requests", icon: FileText, key: "training-requests", module: "training", path: "/training/requests" },
      { title: "Progress Dashboard", icon: TrendingUp, key: "training-progress", module: "training", path: "/training/progress" }
    ]
  },
  {
    title: "Performance Evaluation",
    icon: Target,
    key: "performance",
    module: "performance",
    path: "/performance",
    submenu: [
      { title: "Goal Setting", icon: Target, key: "goals", module: "performance", path: "/performance/goals" },
      { title: "Reviews", icon: Award, key: "reviews", module: "performance", path: "/performance/reviews" },
      { title: "Reports", icon: BarChart3, key: "performance-reports", module: "performance", path: "/performance/reports" }
    ]
  },
  {
    title: "Compensation & Promotions",
    icon: Award,
    key: "compensation",
    module: "compensation",
    path: "/compensation",
    submenu: [
      { title: "Annual Bonuses", icon: DollarSign, key: "bonuses", module: "compensation", path: "/compensation/bonuses" },
      { title: "Promotions", icon: TrendingUp, key: "promotions", module: "compensation", path: "/compensation/promotions" },
      { title: "Allowances", icon: CreditCard, key: "allowances", module: "compensation", path: "/compensation/allowances" }
    ]
  },
  {
    title: "Payroll & Benefits",
    icon: Calculator,
    key: "payroll",
    module: "payroll",
    path: "/payroll",
    submenu: [
      { title: "Payroll Runs", icon: Calculator, key: "payroll-runs", module: "payroll", path: "/payroll/runs" },
      { title: "Payslips", icon: FileText, key: "payslips", module: "payroll", path: "/payroll/payslips" },
      { title: "GOSI Integration", icon: Shield, key: "gosi", module: "payroll", path: "/payroll/gosi" },
      { title: "Bank Transfers", icon: CreditCard, key: "transfers", module: "payroll", path: "/payroll/transfers" }
    ]
  },
  {
    title: "Attendance & Leaves",
    icon: Clock,
    key: "attendance",
    module: "attendance",
    path: "/attendance",
    submenu: [
      { title: "Attendance Overview", icon: Clock, key: "attendance-overview", module: "attendance", path: "/attendance/overview" },
      { title: "Leave Management", icon: Calendar, key: "leaves", module: "attendance", path: "/attendance/leaves" },
      { title: "Remote Work", icon: Users, key: "remote-work", module: "attendance", path: "/attendance/remote" },
      { title: "Overtime", icon: Clock, key: "overtime", module: "attendance", path: "/attendance/overtime" }
    ]
  },
  {
    title: "Employee Self-Service",
    icon: User,
    key: "self-service",
    module: "self-service",
    path: "/self-service",
    submenu: [
      { title: "Leave Requests", icon: Calendar, key: "employee-leaves", module: "self-service", path: "/self-service/leaves" },
      { title: "Loan Requests", icon: DollarSign, key: "employee-loans", module: "self-service", path: "/self-service/loans" },
      { title: "Documents", icon: FileText, key: "employee-documents", module: "self-service", path: "/self-service/documents" },
      { title: "Dependents", icon: Users, key: "employee-dependents", module: "self-service", path: "/self-service/dependents" }
    ]
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    key: "reports",
    module: "reports",
    path: "/reports",
    submenu: [
      { title: "HR KPIs", icon: BarChart3, key: "hr-kpis", module: "reports", path: "/reports/kpis" },
      { title: "Payroll Summary", icon: Calculator, key: "payroll-reports", module: "reports", path: "/reports/payroll" },
      { title: "Attendance Insights", icon: Clock, key: "attendance-reports", module: "reports", path: "/reports/attendance" },
      { title: "Org Charts", icon: Building2, key: "org-charts", module: "reports", path: "/reports/org-charts" }
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    key: "admin",
    module: "admin",
    path: "/admin",
    submenu: [
      { title: "Permissions", icon: Shield, key: "permissions", module: "admin", path: "/admin/permissions" },
      { title: "Workflows", icon: Settings, key: "workflows", module: "admin", path: "/admin/workflows" },
      { title: "Master Data", icon: Settings, key: "master-data", module: "admin", path: "/admin/master-data" }
    ]
  }
];

// Helper to get route path for navigation items
const getRoutePath = (key: string): string => {
  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard',
    'workforce': '/workforce/employees', // Parent route -> default child
    'employees': '/workforce/employees',
    'departments': '/workforce/departments',
    'positions': '/workforce/positions',
    'grades': '/workforce/grades',
    'recruitment': '/recruitment/hiring-requests', // Parent route -> default child
    'hiring-requests': '/recruitment/hiring-requests',
    'applications': '/recruitment/applications',
    'interviews': '/recruitment/interviews',
    'onboarding': '/recruitment/onboarding',
    'payroll': '/payroll/runs', // Parent route -> default child
    'payroll-runs': '/payroll/runs',
    'payslips': '/payroll/payslips',
    'gosi': '/payroll/gosi',
    'transfers': '/payroll/transfers',
    'self-service': '/self-service/leaves', // Parent route -> default child
    'employee-leaves': '/self-service/leaves',
    'employee-loans': '/self-service/loans',
    'employee-documents': '/self-service/documents',
    'employee-dependents': '/self-service/dependents',
    'training': '/training/courses', // Parent route -> default child
    'courses': '/training/courses',
    'training-requests': '/training/requests',
    'training-progress': '/training/progress',
    'performance': '/performance/goals', // Parent route -> default child
    'goals': '/performance/goals',
    'reviews': '/performance/reviews',
    'performance-reports': '/performance/reports',
    'compensation': '/compensation/bonuses', // Parent route -> default child
    'bonuses': '/compensation/bonuses',
    'promotions': '/compensation/promotions',
    'allowances': '/compensation/allowances',
    'attendance': '/attendance/overview', // Parent route -> default child
    'attendance-overview': '/attendance/overview',
    'leaves': '/attendance/leaves',
    'remote-work': '/attendance/remote',
    'overtime': '/attendance/overtime',
    'reports': '/reports/kpis', // Parent route -> default child
    'hr-kpis': '/reports/kpis',
    'payroll-reports': '/reports/payroll',
    'attendance-reports': '/reports/attendance',
    'org-charts': '/reports/org-charts',
    'admin': '/admin/permissions', // Parent route -> default child
    'permissions': '/admin/permissions',
    'workflows': '/admin/workflows',
    'master-data': '/admin/master-data',
  };
  return routeMap[key] || `/${key}`;
};

// Get page title and subtitle based on current pathname
const getPageHeader = (pathname: string): { title: string; subtitle: string } => {
  if (pathname === '/dashboard' || pathname === '/') {
    return {
      title: "HR Dashboard",
      subtitle: "Welcome back! Here's what's happening in your organization today."
    };
  }
  if (pathname === '/workforce/employees') {
    return {
      title: "Employees",
      subtitle: "Manage employee profiles and organizational assignments."
    };
  }
  if (pathname.startsWith('/workforce/')) {
    return {
      title: "Workforce Management",
      subtitle: "Manage departments, positions, and organizational structure."
    };
  }
  if (pathname.startsWith('/recruitment/')) {
    return {
      title: "Recruitment & Onboarding",
      subtitle: "Manage hiring requests, applications, and interview processes."
    };
  }
  if (pathname.startsWith('/payroll/')) {
    return {
      title: "Payroll & Benefits",
      subtitle: "Manage payroll runs, employee compensation, and benefit distribution."
    };
  }
  if (pathname.startsWith('/self-service/')) {
    return {
      title: "Employee Self-Service",
      subtitle: "Access your personal information and submit requests."
    };
  }
  if (pathname.startsWith('/training/')) {
    return {
      title: "Training & Development",
      subtitle: "Manage training courses, requests, and progress tracking."
    };
  }
  if (pathname.startsWith('/performance/')) {
    return {
      title: "Performance Evaluation",
      subtitle: "Manage goal setting, reviews, and performance reports."
    };
  }
  if (pathname.startsWith('/compensation/')) {
    return {
      title: "Compensation & Promotions",
      subtitle: "Manage bonuses, promotions, and allowances."
    };
  }
  if (pathname.startsWith('/attendance/')) {
    return {
      title: "Attendance & Leaves",
      subtitle: "Manage attendance, leaves, remote work, and overtime."
    };
  }
  if (pathname.startsWith('/reports/')) {
    return {
      title: "Reports & Analytics",
      subtitle: "View HR KPIs, payroll summaries, and organizational insights."
    };
  }
  if (pathname.startsWith('/admin/')) {
    return {
      title: "Administration",
      subtitle: "Manage permissions, workflows, and master data."
    };
  }
  // Default
  return {
    title: "HR Dashboard",
    subtitle: "Welcome back! Here's what's happening in your organization today."
  };
};

export function AppLayout() {
  const location = useLocation();
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

  const pageHeader = getPageHeader(location.pathname);

  // Check if a route is active (including parent routes)
  const isRouteActive = (path: string): boolean => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navigation = allNavigation;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b h-16 px-4 py-0">
            <div className="flex items-center gap-3 h-full">
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
              {navigation.map((item) => {
                const itemPath = getRoutePath(item.key);
                const isParentActive = item.submenu ? item.submenu.some(sub => isRouteActive(getRoutePath(sub.key))) : isRouteActive(itemPath);
                
                return (
                  <SidebarMenuItem key={item.key}>
                    <NavLink to={itemPath} className="block">
                      {({ isActive }) => (
                        <SidebarMenuButton
                          isActive={isActive || isParentActive}
                          className="w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                    {item.submenu && isParentActive && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const subPath = getRoutePath(subItem.key);
                          return (
                            <NavLink key={subItem.key} to={subPath}>
                              {({ isActive }) => (
                                <SidebarMenuButton
                                  isActive={isActive}
                                  size="sm"
                                  className="w-full text-sm"
                                >
                                  <subItem.icon className="h-3 w-3" />
                                  <span>{subItem.title}</span>
                                </SidebarMenuButton>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
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
            title={pageHeader.title}
            subtitle={pageHeader.subtitle}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isRTL={isRTL}
            toggleLanguage={toggleLanguage}
            currentLanguage={currentLanguage}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
