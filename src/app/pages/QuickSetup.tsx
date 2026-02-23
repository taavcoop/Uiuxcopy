import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Rocket } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Step1Location from '../components/quick-setup/Step1Location';
import Step2CalendarShift from '../components/quick-setup/Step2CalendarShift';
import Step3Policy from '../components/quick-setup/Step3Policy';

type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1 as const, title: 'ثبت محل سریع' },
  { id: 2 as const, title: 'ثبت تقویم' },
  { id: 3 as const, title: 'ثبت سیاست کاری' },
];

export default function QuickSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [exitOpen, setExitOpen] = useState(false);

  const progress = useMemo(() => (step / 3) * 100, [step]);

  const goBack = () => {
    if (step === 1) {
      setExitOpen(true);
      return;
    }
    setStep((prev) => (prev - 1) as Step);
  };

  const goNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as Step);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/15 via-slate-900 to-cyan-600/10 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">راه اندازی سریع</h1>
              <p className="text-sm text-slate-300/90 mt-1">سه مرحله ضروری برای شروع سریع: محل کار، تقویم و سیاست کاری</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-sm border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 transition-colors" onClick={() => setExitOpen(true)}>
              خروج
            </button>
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STEPS.map((item) => (
              <button
                key={item.id}
                onClick={() => setStep(item.id)}
                className={`rounded-2xl border px-3 py-3 text-right transition-all ${item.id === step ? 'bg-indigo-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/20' : item.id < step ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15' : 'bg-slate-900/60 border-white/10'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${item.id === step ? 'bg-indigo-400 text-slate-950' : item.id < step ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    {item.id < step ? <CheckCircle2 className="w-4 h-4" /> : item.id}
                  </span>
                  {item.id === step && <Rocket className="w-4 h-4 text-indigo-300" />}
                </div>
                <div className={`mt-2 text-sm font-bold ${item.id === step ? 'text-white' : item.id < step ? 'text-emerald-300' : 'text-slate-300'}`}>{item.title}</div>
              </button>
            ))}
          </div>
        </section>

        {step === 1 && <Step1Location />}
        {step === 2 && <Step2CalendarShift onValidityChange={() => {}} />}

        {step === 3 && <Step3Policy />}

        <div className="flex items-center justify-between">
          <button className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 transition-colors" onClick={goBack}>
            {step === 1 ? 'خروج' : 'مرحله قبل'}
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors" onClick={goNext}>
            {step === 3 ? 'پایان' : 'مرحله بعد'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={exitOpen}
        onOpenChange={setExitOpen}
        title="خروج از راه اندازی سریع"
        description="این تنظیمات برای راه اندازی الزامی است. در صورت خارج شدن باید از فلو تنظیمات این اطلاعات را ثبت کنید."
        confirmText="خروج"
        cancelText="ادامه"
        onConfirm={() => navigate('/')}
        destructive
      />
    </div>
  );
}
