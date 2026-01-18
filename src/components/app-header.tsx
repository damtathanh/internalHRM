import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Languages
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useProfile } from "../auth/ProfileContext";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isRTL: boolean;
  toggleLanguage: () => void;
  currentLanguage: 'en' | 'ar';
}

export function AppHeader({ title, subtitle, isDarkMode, toggleDarkMode, toggleLanguage, currentLanguage }: AppHeaderProps) {
  const { authUser, signOut } = useAuth();
  const { profile } = useProfile();
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications] = useState([
    { id: 1, title: "New leave request", message: "Ahmed Al-Rashid submitted a leave request", time: "5 min ago", unread: true },
    { id: 2, title: "Payroll completed", message: "January payroll has been processed", time: "1 hour ago", unread: true },
    { id: 3, title: "Interview scheduled", message: "Technical interview with John Mitchell", time: "2 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Safeguard: render null if no authenticated user
  if (!authUser) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    if (authUser?.email) {
      return authUser.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (profile?.email) {
      return profile.email.split("@")[0];
    }
    if (authUser?.email) {
      return authUser.email.split("@")[0];
    }
    return "User";
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 h-full">
        {/* Left: Title & Subtitle */}
        {(title || subtitle) && (
          <div className="flex flex-col justify-center flex-shrink-0 min-w-0 pr-4">
            {title && <h1 className="text-xl font-semibold leading-tight">{title}</h1>}
            {subtitle && <p className="text-sm text-muted-foreground leading-tight mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Middle: Search Bar (flex-grow, auto-resize) */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex items-center w-full max-w-2xl">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-3" />
            <Input
              placeholder={currentLanguage === 'ar' ? "البحث..." : "Search employees, requests, or documents..."}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="flex-1 bg-background/50 pl-3"
            />
          </div>
        </div>

        {/* Right: Fixed Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentLanguage === 'ar' ? 'العربية' : 'English'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>
                {currentLanguage === 'ar' ? 'الإشعارات' : 'Notifications'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {notification.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-sm text-primary">
                  {currentLanguage === 'ar' ? 'عرض جميع الإشعارات' : 'View all notifications'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authUser?.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email || authUser?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {currentLanguage === 'ar' ? 'حسابي' : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                {currentLanguage === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                {currentLanguage === 'ar' ? 'الإعدادات' : 'Settings'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                {currentLanguage === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}