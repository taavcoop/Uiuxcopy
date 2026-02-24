import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, CheckCircle2, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

type Step = 1 | 2;
type MaritalStatus = 'single' | 'married' | 'divorced';

interface FormData {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  childrenCount: string;
  maritalStatus: MaritalStatus;
  personnelCode: string;
  workGroup: string;
  orgUnits: string[];
}

const WORK_GROUPS = ['تیم طراحی', 'تیم فنی', 'مالی', 'اداری'];
const DEFAULT_ORG_UNITS = ['منابع انسانی', 'مالی', 'فنی', 'پشتیبانی', 'فروش'];

export default function AddEmployee() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [orgUnitInput, setOrgUnitInput] = useState('');
  const [orgUnitOptions, setOrgUnitOptions] = useState<string[]>(DEFAULT_ORG_UNITS);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    nationalId: '',
    childrenCount: '',
    maritalStatus: 'single',
    personnelCode: '',
    workGroup: '',
    orgUnits: [],
  });

  const progress = useMemo(() => (currentStep / 2) * 100, [currentStep]);
  const steps = [
    { step: 1 as const, title: 'اطلاعات پایه' },
    { step: 2 as const, title: 'اطلاعات سازمانی' },
  ];

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/employees');
      return;
    }
    setCurrentStep(1);
  };

  const toggleOrgUnit = (unit: string) => {
    setFormData((prev) => ({
      ...prev,
      orgUnits: prev.orgUnits.includes(unit) ? prev.orgUnits.filter((u) => u !== unit) : [...prev.orgUnits, unit],
    }));
  };

  const addCustomOrgUnit = () => {
    const cleaned = orgUnitInput.trim();
    if (!cleaned) return;
    if (!orgUnitOptions.includes(cleaned)) setOrgUnitOptions((prev) => [cleaned, ...prev]);
    setFormData((prev) => ({
      ...prev,
      orgUnits: prev.orgUnits.includes(cleaned) ? prev.orgUnits : [...prev.orgUnits, cleaned],
    }));
    setOrgUnitInput('');
  };

  const removeSelectedOrgUnit = (unit: string) => {
    setFormData((prev) => ({ ...prev, orgUnits: prev.orgUnits.filter((u) => u !== unit) }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    const newId = `emp-${Date.now()}`;
    navigate(`/employees/${newId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/15 via-slate-900 to-cyan-600/10 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title={currentStep === 1 ? 'بازگشت' : 'مرحله قبل'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">افزودن کارمند</h1>
                <p className="text-sm text-slate-300/90 mt-1">فرم ثبت کارمند در دو مرحله کوتاه</p>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs text-slate-300">پیشرفت فرم</div>
              <div className="text-xl font-black text-white">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {steps.map((item) => (
              <button
                key={item.step}
                onClick={() => item.step <= currentStep && setCurrentStep(item.step)}
                className={cn(
                  'rounded-2xl border px-3 py-3 text-right transition-all',
                  item.step === currentStep
                    ? 'bg-indigo-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                    : item.step < currentStep
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold',
                      item.step === currentStep
                        ? 'bg-indigo-400 text-slate-950'
                        : item.step < currentStep
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    )}
                  >
                    {item.step < currentStep ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </span>
                </div>
                <div className={cn('mt-2 text-sm font-bold', item.step === currentStep ? 'text-white' : item.step < currentStep ? 'text-emerald-300' : 'text-slate-300')}>
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-extrabold text-lg">اطلاعات پایه</h2>
                <p className="text-xs text-slate-400 mt-1">مشابه فلو سرویس مدیریت کاربران</p>
              </div>
              <div className="text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-3 py-1.5 rounded-full">Step 1</div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabeledField label="شماره موبایل">
                  <input className="input-field" placeholder="0912..." value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                </LabeledField>
                <LabeledField label="ایمیل">
                  <input className="input-field" placeholder="example@company.com" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                </LabeledField>
                <LabeledField label="نام">
                  <input className="input-field" placeholder="نام" value={formData.firstName} onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))} />
                </LabeledField>
                <LabeledField label="نام خانوادگی">
                  <input className="input-field" placeholder="نام خانوادگی" value={formData.lastName} onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))} />
                </LabeledField>
                <LabeledField label="کد ملی" className="sm:col-span-2">
                  <input className="input-field" placeholder="کد ملی 10 رقمی" value={formData.nationalId} onChange={(e) => setFormData((p) => ({ ...p, nationalId: e.target.value }))} />
                </LabeledField>
              </div>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-extrabold text-lg">اطلاعات سازمانی</h2>
                <p className="text-xs text-slate-400 mt-1">نام پدر و تاریخ تولد حذف شده و واحد سازمانی چندتایی است.</p>
              </div>
              <div className="text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-3 py-1.5 rounded-full">Step 2</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledField label="تعداد فرزند">
                <input className="input-field" type="number" placeholder="0" value={formData.childrenCount} onChange={(e) => setFormData((p) => ({ ...p, childrenCount: e.target.value }))} />
              </LabeledField>
              <LabeledField label="وضعیت تاهل">
                <select className="input-field" value={formData.maritalStatus} onChange={(e) => setFormData((p) => ({ ...p, maritalStatus: e.target.value as MaritalStatus }))}>
                  <option value="single">مجرد</option>
                  <option value="married">متاهل</option>
                  <option value="divorced">مطلقه</option>
                </select>
              </LabeledField>
              <LabeledField label="کد پرسنلی">
                <input className="input-field" placeholder="کد پرسنلی" value={formData.personnelCode} onChange={(e) => setFormData((p) => ({ ...p, personnelCode: e.target.value }))} />
              </LabeledField>
              <LabeledField label="گروه کاری">
                <select className="input-field" value={formData.workGroup} onChange={(e) => setFormData((p) => ({ ...p, workGroup: e.target.value }))}>
                  <option value="">انتخاب گروه کاری</option>
                  {WORK_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </LabeledField>
              <LabeledField label="واحد سازمانی" className="sm:col-span-2">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {orgUnitOptions.map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => toggleOrgUnit(unit)}
                        className={cn(
                          'px-3 py-1.5 rounded-full border text-xs transition-colors',
                          formData.orgUnits.includes(unit)
                            ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200'
                            : 'bg-slate-800/60 border-white/15 text-slate-300 hover:border-white/30'
                        )}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className="input-field"
                      placeholder="افزودن واحد سازمانی جدید"
                      value={orgUnitInput}
                      onChange={(e) => setOrgUnitInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addCustomOrgUnit}
                      className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-200 hover:border-white/30 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن
                    </button>
                  </div>

                  {formData.orgUnits.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.orgUnits.map((unit) => (
                        <span key={unit} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs">
                          {unit}
                          <button type="button" onClick={() => removeSelectedOrgUnit(unit)} className="text-emerald-100/80 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </LabeledField>
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 bg-slate-900/65 border border-white/10 rounded-2xl p-4">
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            {currentStep === 1 ? 'بازگشت به کارمندان' : 'مرحله قبل'}
          </button>
          <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25">
            {currentStep === 2 ? 'ورود به جزئیات کارمند' : 'مرحله بعد'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LabeledField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs text-slate-400">{label}</label>
      {children}
    </div>
  );
}
