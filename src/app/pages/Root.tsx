import { Outlet, useNavigate } from 'react-router';
import {
  Menu,
  Bell,
  LayoutDashboard,
  CheckCircle2,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  Search,
  GitBranch,
  FileText,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-l border-white/5 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 text-slate-100 font-bold text-lg border-b border-white/5">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <span>سازمان من</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 px-4 py-2">منوی اصلی</div>
        {[
          { icon: LayoutDashboard, label: 'داشبورد', active: currentPath === '/', path: '/' },
          { icon: CheckCircle2, label: 'چک لیست راه اندازی', active: currentPath === '/', path: '/' },
          { icon: Building2, label: 'محل های کار', active: currentPath === '/locations', path: '/locations' },
          { icon: GitBranch, label: 'گروه های کاری', active: currentPath === '/work-groups', path: '/work-groups' },
          { icon: Calendar, label: 'سیاست های کاری', active: currentPath === '/policies', path: '/policies' },
          { icon: FileText, label: 'قرارداد حقوق', active: currentPath === '/payroll-contract', path: '/payroll-contract' },
          {
            icon: Users,
            label: 'کاربران',
            active: currentPath === '/employees' || currentPath.startsWith('/employees/'),
            path: '/employees',
          },
          { icon: Calendar, label: 'تقویم', active: false, path: '/' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              item.active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="text-xs font-semibold text-slate-500 px-4 py-2 mt-6">تنظیمات</div>
        {[
          { icon: Settings, label: 'تنظیمات سیستم', active: false },
          { icon: HelpCircle, label: 'راهنما و پشتیبانی', active: false },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>
  );
};

export default function Root() {
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-['Vazirmatn'] selection:bg-indigo-500/30 flex" dir="rtl">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-600/5 blur-[120px]" />
      </div>

      <Sidebar currentPath={currentPath} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <button className="p-2 -mr-2 rounded-lg hover:bg-white/5 text-slate-400">
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-slate-100">سازمان من</span>
            </div>

            <div className="hidden sm:flex flex-1 max-w-md relative group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="جستجو در بخش ها و تنظیمات..."
                className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900" />
              </button>

              <div className="h-8 w-px bg-white/10 hidden sm:block" />

              <button className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-left">
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-slate-200">علی محمدی</div>
                  <div className="text-[10px] text-slate-500">مدیر سیستم</div>
                </div>
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                  ع
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
