import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Login } from "./components/login";
import { useAuth } from "./auth/AuthContext";
import { useProfile } from "./auth/ProfileContext";
import { getDefaultRoute } from "./config/role";
// Layouts
import { AppLayout } from "./pages/layouts/AppLayout";
// Dashboard
import { DashboardPage } from "./pages/dashboard/DashboardPage";
// Workforce module
import { WorkforceLayout } from "./pages/workforce/WorkforceLayout";
import { EmployeesPage } from "./pages/workforce/EmployeesPage";
import { DepartmentsPage } from "./pages/workforce/DepartmentsPage";
import { GradesPage } from "./pages/workforce/GradesPage";
// Recruitment module
import { RecruitmentLayout } from "./pages/recruitment/RecruitmentLayout";
import { HiringRequestsPage } from "./pages/recruitment/HiringRequestsPage";
import { ApplicationsPage } from "./pages/recruitment/ApplicationsPage";
import { InterviewsPage } from "./pages/recruitment/InterviewsPage";
import { OnboardingPage } from "./pages/recruitment/OnboardingPage";
// Payroll module
import { PayrollLayout } from "./pages/payroll/PayrollLayout";
import { PayrollRunsPage } from "./pages/payroll/PayrollRunsPage";
import { ComponentsPage } from "./pages/payroll/ComponentsPage";
import { PayslipsPage } from "./pages/payroll/PayslipsPage";
import { GosiPage } from "./pages/payroll/GosiPage";
import { BankTransfersPage } from "./pages/payroll/BankTransfersPage";
// Self-service module
import { SelfServiceLayout } from "./pages/self-service/SelfServiceLayout";
import { LeavesPage } from "./pages/self-service/LeavesPage";
import { LoansPage } from "./pages/self-service/LoansPage";
import { DocumentsPage } from "./pages/self-service/DocumentsPage";
import { DependentsPage } from "./pages/self-service/DependentsPage";
// Training module
import { TrainingLayout } from "./pages/training/TrainingLayout";
import { CoursesPage } from "./pages/training/CoursesPage";
import { TrainingRequestsPage } from "./pages/training/TrainingRequestsPage";
import { ProgressPage } from "./pages/training/ProgressPage";
// Performance module
import { PerformanceLayout } from "./pages/performance/PerformanceLayout";
import { GoalsPage } from "./pages/performance/GoalsPage";
import { ReviewsPage } from "./pages/performance/ReviewsPage";
import { ReportsPage as PerformanceReportsPage } from "./pages/performance/ReportsPage";
// Compensation module
import { CompensationLayout } from "./pages/compensation/CompensationLayout";
import { BonusesPage } from "./pages/compensation/BonusesPage";
import { PromotionsPage } from "./pages/compensation/PromotionsPage";
import { AllowancesPage } from "./pages/compensation/AllowancesPage";
// Attendance module
import { AttendanceLayout } from "./pages/attendance/AttendanceLayout";
import { OverviewPage } from "./pages/attendance/OverviewPage";
import { LeavesManagementPage } from "./pages/attendance/LeavesManagementPage";
import { RemoteWorkPage } from "./pages/attendance/RemoteWorkPage";
import { OvertimePage } from "./pages/attendance/OvertimePage";
// Reports module
import { ReportsLayout } from "./pages/reports/ReportsLayout";
import { KPIsPage } from "./pages/reports/KPIsPage";
import { PayrollReportsPage } from "./pages/reports/PayrollReportsPage";
import { AttendanceReportsPage } from "./pages/reports/AttendanceReportsPage";
import { OrgChartsPage } from "./pages/reports/OrgChartsPage";
// Admin module
import { AdminLayout } from "./pages/admin/AdminLayout";
import { PermissionsPage } from "./pages/admin/PermissionsPage";
import { WorkflowsPage } from "./pages/admin/WorkflowsPage";
import { MasterDataPage } from "./pages/admin/MasterDataPage";
// Coming Soon
import { ComingSoonPage } from "./pages/coming-soon/ComingSoonPage";

export default function App() {
  const { authUser, authLoading } = useAuth();
  const { role, profileLoading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  // Combined loading state: wait for both auth and profile to be ready
  const loading = authLoading || profileLoading;

  // Navigate to default route after auth loading finishes (if at root)
  useEffect(() => {
    if (!loading && authUser && location.pathname === '/') {
      const defaultRoute = getDefaultRoute(role);
      navigate(`/${defaultRoute}`, { replace: true });
    }
  }, [loading, authUser, location.pathname, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="workforce" element={<WorkforceLayout />}>
          <Route index element={<Navigate to="/workforce/employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="grades" element={<GradesPage />} />
        </Route>

        <Route path="recruitment" element={<RecruitmentLayout />}>
          <Route index element={<Navigate to="/recruitment/hiring-requests" replace />} />
          <Route path="hiring-requests" element={<HiringRequestsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="payroll" element={<PayrollLayout />}>
          <Route index element={<Navigate to="/payroll/runs" replace />} />
          <Route path="runs" element={<PayrollRunsPage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="payslips" element={<PayslipsPage />} />
          <Route path="gosi" element={<GosiPage />} />
          <Route path="transfers" element={<BankTransfersPage />} />
        </Route>

        <Route path="self-service" element={<SelfServiceLayout />}>
          <Route index element={<Navigate to="/self-service/leaves" replace />} />
          <Route path="leaves" element={<LeavesPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="dependents" element={<DependentsPage />} />
        </Route>

        <Route path="training" element={<TrainingLayout />}>
          <Route index element={<Navigate to="/training/courses" replace />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="requests" element={<TrainingRequestsPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>

        <Route path="performance" element={<PerformanceLayout />}>
          <Route index element={<Navigate to="/performance/goals" replace />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reports" element={<PerformanceReportsPage />} />
        </Route>

        <Route path="compensation" element={<CompensationLayout />}>
          <Route index element={<Navigate to="/compensation/bonuses" replace />} />
          <Route path="bonuses" element={<BonusesPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="allowances" element={<AllowancesPage />} />
        </Route>

        <Route path="attendance" element={<AttendanceLayout />}>
          <Route index element={<Navigate to="/attendance/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="leaves" element={<LeavesManagementPage />} />
          <Route path="remote" element={<RemoteWorkPage />} />
          <Route path="overtime" element={<OvertimePage />} />
        </Route>

        <Route path="reports" element={<ReportsLayout />}>
          <Route index element={<Navigate to="/reports/kpis" replace />} />
          <Route path="kpis" element={<KPIsPage />} />
          <Route path="payroll" element={<PayrollReportsPage />} />
          <Route path="attendance" element={<AttendanceReportsPage />} />
          <Route path="org-charts" element={<OrgChartsPage />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/permissions" replace />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="master-data" element={<MasterDataPage />} />
        </Route>

        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  );
}
