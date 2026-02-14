import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Users, 
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Status = 'done' | 'mandatory' | 'pending' | 'important';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  icon: React.ElementType;
  path?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  items: TaskItem[];
}

// --- Data ---
const DATA: Section[] = [
  {
    id: 'attendance',
    title: 'مدیریت حضور و غیاب',
    icon: Clock,
    items: [
      {
        id: 'location',
        title: 'محل کار',
        description: 'محدوده‌های جغرافیایی مجاز تردد ثبت شد.',
        status: 'done',
        icon: MapPin,
        path: '/locations',
      },
      {
        id: 'calendar',
        title: 'تقویم کاری',
        description: 'تعریف تعطیلات رسمی و روزهای کاری سال ۱۴۰۳.',
        status: 'mandatory',
        icon: Calendar,
      },
      {
        id: 'policies',
        title: 'سیاست‌های کاری',
        description: 'قوانین تاخیر، تعجیل و شناوری پرسنل.',
        status: 'pending',
        icon: Briefcase,
        path: '/policies',
      },
      {
        id: 'employees',
        title: 'مدیریت کارمندان',
        description: 'افزودن نام کارمندان و تخصیص به گروه‌های کاری.',
        status: 'mandatory',
        icon: Users,
      },
      {
        id: 'groups',
        title: 'گروه‌های کاری',
        description: 'تعریف گروه‌های کاری و قوانین مرتبط.',
        status: 'pending',
        icon: Users,
      },
    ],
  },
  {
    id: 'salary',
    title: 'حقوق و دستمزد',
    icon: CreditCard,
    items: [
      {
        id: 'salary_mgmt',
        title: 'مدیریت حقوق و دستمزد',
        description: 'پایه حقوق، حق مسکن، بن خواروبار و فرمول‌ها.',
        status: 'important',
        icon: CreditCard,
      },
    ],
  },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    done: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    mandatory: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    important: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const labels = {
    done: 'انجام شده',
    mandatory: 'الزامی',
    pending: 'در انتظار',
    important: 'بسیار مهم',
  };

  const icons = {
    done: CheckCircle2,
    mandatory: AlertCircle,
    pending: Clock,
    important: AlertCircle,
  };

  const Icon = icons[status];

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap",
      styles[status]
    )}>
      <Icon className="w-3 h-3" />
      <span>{labels[status]}</span>
    </div>
  );
};

const TaskCard = ({ item, onClick }: { item: TaskItem; onClick?: () => void }) => {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 rounded-xl p-4 transition-all cursor-pointer h-full"
    >
      {/* Icon Box */}
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
        "bg-slate-700/50 text-slate-400 group-hover:text-white group-hover:bg-indigo-500/20 transition-colors"
      )}>
        <item.icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between mb-1 gap-2">
          <h3 className="text-sm font-bold text-slate-100 truncate">
            {item.title}
          </h3>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden md:block">
        <ChevronLeft className="w-4 h-4 text-slate-400" />
      </div>
      <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 md:hidden" />
    </motion.div>
  );
};

const SectionHeader = ({ 
  section, 
  isOpen, 
  onToggle 
}: { 
  section: Section; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-2 mt-2 mb-2 text-slate-300 hover:text-white transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
          <section.icon className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="text-base font-bold">{section.title}</span>
        <span className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-white/5">
          {section.items.length} مورد
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400">
        <span>{isOpen ? 'بستن' : 'مشاهده جزئیات'}</span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </div>
    </motion.button>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    attendance: true,
    salary: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completed = 25;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero / Progress Section */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none -mr-16 -mt-16" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-2 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">وضعیت راه‌اندازی سیستم</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">خوش آمدید، علی عزیز 👋</h1>
              <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                برای استفاده کامل از امکانات پنل، لطفا موارد زیر را بررسی و تکمیل نماید. این موارد برای محاسبه دقیق حقوق و دستمزد ضروری هستند.
              </p>
            </div>

            <div className="w-full md:w-64 bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-300 font-medium">پیشرفت کلی</span>
                <span className="text-white font-bold">{completed}٪</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completed}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                />
              </div>
              <div className="mt-3 text-[10px] text-slate-500 text-center">
                ۵ مورد از ۲۰ مورد تکمیل شده است
              </div>
            </div>
          </div>
        </div>

        {/* Search Mobile */}
        <div className="sm:hidden">
          <div className="relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="جستجو..." 
              className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 pr-10 pl-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-6">
          {DATA.map((section) => (
            <div key={section.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-2 sm:p-4 overflow-hidden">
              <SectionHeader 
                section={section} 
                isOpen={expandedSections[section.id]} 
                onToggle={() => toggleSection(section.id)}
              />
              <AnimatePresence initial={false}>
                {expandedSections[section.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-2 pt-0">
                      {section.items.map((item) => (
                        <TaskCard 
                          key={item.id} 
                          item={item} 
                          onClick={() => item.path && navigate(item.path)}
                        />
                      ))}
                    </div>
                    <div className="h-2" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}