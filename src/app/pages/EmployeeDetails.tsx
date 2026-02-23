import { type ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, ChevronRight, ContactRound, FileText, IdCard, UserRound } from 'lucide-react';
import { cn } from '../lib/utils';

type DetailsItem = {
  key: 'management' | 'extra' | 'bank' | 'draft';
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
};

const DETAILS_ITEMS: DetailsItem[] = [
  {
    key: 'management',
    title: 'اطلاعات مدیریت کاربران',
    subtitle: 'سطح دسترسی و وضعیت کارمند',
    icon: UserRound,
  },
  {
    key: 'extra',
    title: 'اطلاعات تکمیلی',
    subtitle: 'وضعیت تاهل، واحد سازمانی و توضیحات',
    icon: ContactRound,
  },
  {
    key: 'bank',
    title: 'مشخصات حساب بانکی',
    subtitle: 'شماره حساب، کارت و شبا',
    icon: IdCard,
  },
  {
    key: 'draft',
    title: 'پیش نویس قرارداد',
    subtitle: 'نوع قرارداد و تنظیمات مالی',
    icon: FileText,
  },
];

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employees')}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">جزئیات کارمند</h1>
            <p className="text-sm text-slate-400 mt-1">فلو جزئیات به صورت صفحه بعدی (Next Page)</p>
          </div>
        </div>

        <section className="space-y-3">
          {DETAILS_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(`/employees/${id}/${item.key}`)}
              className={cn(
                'w-full rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4',
                'hover:border-indigo-400/40 hover:bg-slate-900 transition-all text-right'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
