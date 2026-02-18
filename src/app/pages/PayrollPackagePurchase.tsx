import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle2, ChevronRight, CreditCard, Lock } from 'lucide-react';
import { setPayrollPackageEnabled } from '../lib/draft-template-store';

export default function PayrollPackagePurchase() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnTo = useMemo(() => {
    const raw = searchParams.get('returnTo');
    if (!raw) return '/draft-templates';
    return raw;
  }, [searchParams]);

  const activate = () => {
    setPayrollPackageEnabled(true);
    navigate(returnTo);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(returnTo)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">فعال‌سازی پکیج حقوق و دستمزد</h1>
            <p className="text-sm text-slate-400 mt-1">برای ثبت و مدیریت آیتم‌های حقوقی قالب‌های پیش‌نویس.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300">
            <CreditCard className="w-5 h-5" />
            <h2 className="font-bold">فلو خرید</h2>
          </div>
          <ol className="space-y-2 text-sm text-slate-300">
            <li>1. بررسی امکانات پکیج حقوق و دستمزد</li>
            <li>2. تایید خرید و فعال‌سازی سرویس</li>
            <li>3. بازگشت خودکار به صفحه مدیریت قالب</li>
          </ol>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold">امکاناتی که بعد از فعال‌سازی باز می‌شوند</h3>
          </div>
          <p className="text-sm text-emerald-100/90">
            ثبت مولفه‌های حکمی، مزایای تبعی، ضرایب زمانی، نوبت‌کاری، عیدی/سنوات و کسورات قانونی به‌صورت کامل.
          </p>
          <button
            onClick={activate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <Lock className="w-4 h-4" />
            تایید و فعال‌سازی پکیج
          </button>
        </div>
      </div>
    </div>
  );
}
