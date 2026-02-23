import { useState, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, CheckCircle2, AlertCircle, UploadCloud, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import MonthlyFixedForm from '../components/contract/MonthlyFixedForm';
import type { MonthlyFixedAgreement } from '../contract/types';
import { LEGAL_CONSTANTS_2026 } from '../contract/salaryCalculations';

type Step = 1 | 2 | 3 | 4;
type MaritalStatus = 'single' | 'married' | 'divorced';
type AgreementType = 'monthly-fixed' | 'daily-wage' | 'hourly' | 'project-based' | 'consulting';

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
  position: string;
  fatherName: string;
  birthDate: string;
  accountNumber: string;
  cardNumber: string;
  shaba: string;
  guarantees: string;
  contractStartDate: string;
  contractEndDate: string;
  agreementType: AgreementType;
  agreement: MonthlyFixedAgreement;
}

const WORK_GROUPS = ['تیم طراحی', 'تیم فنی', 'مالی', 'اداری'];
const POSITIONS = ['کارشناس', 'مدیر', 'سرپرست', 'کارآموز'];

const createDefaultAgreement = (): MonthlyFixedAgreement => ({
  type: 'monthly-fixed',
  entryMode: 'breakdown',
  agreedTotalAmount: 0,
  surplusAllocation: 'attraction',
  baseSalary: LEGAL_CONSTANTS_2026.minimumDailyWage * 30,
  seniorityBase: LEGAL_CONSTANTS_2026.seniorityBaseDailyRate,
  housingAllowance: LEGAL_CONSTANTS_2026.housingAllowanceMonthly,
  foodAllowance: LEGAL_CONSTANTS_2026.foodAllowanceMonthly,
  childAllowancePerChild: LEGAL_CONSTANTS_2026.minimumDailyWage * 3,
  maritalAllowance: LEGAL_CONSTANTS_2026.maritalAllowanceMonthly,
  attractionAllowance: 0,
  managementAllowance: 0,
  transportAllowance: 0,
  hardshipAllowance: 0,
  otherAllowance: 0,
  shiftModels: {
    twoShifts: { enabled: false, percent: 10 },
    threeShifts: { enabled: false, percent: 15 },
    dayNight: { enabled: false, percent: 22.5 },
    afternoonNight: { enabled: false, percent: 22.5 },
  },
  coefficients: {
    overtime: 1.4,
    nightWork: 1.35,
    holidayWork: 1.4,
    fridayWork: 1.8,
    fridayWorkNoOvertime: 1.4,
  },
  missionAllowance: {
    enabled: false,
    minimumDailyRate: LEGAL_CONSTANTS_2026.minimumDailyWage,
  },
  wageBaseComponents: {
    baseSalary: true,
    seniorityBase: true,
    attractionAllowance: true,
    managementAllowance: true,
    transportAllowance: false,
    hardshipAllowance: true,
  },
  bonusMonths: 2,
  bonusPaymentType: 'annual',
  severancePaymentType: 'end-of-service',
  leavesBuyback: false,
  insuranceRate: LEGAL_CONSTANTS_2026.employeeInsuranceRate,
  taxExemption: LEGAL_CONSTANTS_2026.monthlyTaxExemption,
});

export default function AddEmployee() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [alertMessage, setAlertMessage] = useState<{ type: 'info' | 'warning' | 'success'; text: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
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
    position: '',
    fatherName: '',
    birthDate: '',
    accountNumber: '',
    cardNumber: '',
    shaba: '',
    guarantees: '',
    contractStartDate: '',
    contractEndDate: '',
    agreementType: 'monthly-fixed',
    agreement: createDefaultAgreement(),
  });

  const steps = [
    { step: 1, title: 'اطلاعات پایه' },
    { step: 2, title: 'اطلاعات فردی', optional: true },
    { step: 3, title: 'اطلاعات پرداخت', optional: true },
    { step: 4, title: 'قرارداد و مزایا' },
  ] as const;

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBack = () => {
    setAlertMessage(null);
    if (currentStep === 1) navigate('/employees');
    else setCurrentStep((prev) => (prev - 1) as Step);
  };

  const handleNext = () => {
    setAlertMessage(null);
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handleSkip = () => {
    setAlertMessage(null);
    if (currentStep === 2 || currentStep === 3) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handleSave = () => {
    console.log('Saving employee with contract:', formData);
    setAlertMessage({ type: 'success', text: 'کاربر و قرارداد با موفقیت ثبت شد.' });
    setTimeout(() => navigate('/employees'), 1200);
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
                <h1 className="text-2xl sm:text-3xl font-black text-white">افزودن کاربر</h1>
                <p className="text-sm text-slate-300/90 mt-1">طراحی‌شده برای ورود سریع، دقیق و مرحله‌به‌مرحله اطلاعات پرسنلی</p>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs text-slate-300">پیشرفت فرم</div>
              <div className="text-xl font-black text-white">{Math.round((currentStep / 4) * 100)}%</div>
            </div>
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((item) => (
              <button
                key={item.step}
                onClick={() => item.step <= currentStep && setCurrentStep(item.step)}
                className={cn(
                  'group rounded-2xl border px-3 py-3 text-right transition-all',
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
                  {item.optional && <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">اختیاری</span>}
                </div>
                <div
                  className={cn(
                    'mt-2 text-sm font-bold',
                    item.step === currentStep ? 'text-white' : item.step < currentStep ? 'text-emerald-300' : 'text-slate-300'
                  )}
                >
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {alertMessage && (
          <div
            className={cn(
              'p-4 rounded-lg mb-6 flex items-start gap-3',
              alertMessage.type === 'success' && 'bg-green-500/10 border border-green-500/20 text-green-400',
              alertMessage.type === 'warning' && 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
              alertMessage.type === 'info' && 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
            )}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{alertMessage.text}</p>
          </div>
        )}

        {currentStep === 1 && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-extrabold text-lg">اطلاعات پایه</h2>
                <p className="text-xs text-slate-400 mt-1">اطلاعات هویتی و کانال‌های ارتباطی کاربر را ثبت کنید.</p>
              </div>
              <div className="text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-3 py-1.5 rounded-full">Step 1</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
                <div className="text-xs text-slate-400 mb-3">تصویر پروفایل</div>
                <label className="block cursor-pointer">
                  <div className="h-40 rounded-xl border border-dashed border-indigo-400/35 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors flex flex-col items-center justify-center gap-2">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-24 h-24 rounded-full object-cover border border-white/20" />
                    ) : (
                      <>
                        <UploadCloud className="w-7 h-7 text-indigo-300" />
                        <span className="text-xs text-slate-300">آپلود تصویر</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-extrabold text-lg">اطلاعات فردی</h2>
                <p className="text-xs text-slate-400 mt-1">جزئیات شناسنامه‌ای و سازمانی فرد را تنظیم کنید.</p>
              </div>
              <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full">اختیاری</div>
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
              <LabeledField label="سمت سازمانی">
                <select className="input-field" value={formData.position} onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}>
                  <option value="">انتخاب سمت سازمانی</option>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </LabeledField>
              <LabeledField label="نام پدر">
                <input className="input-field" placeholder="نام پدر" value={formData.fatherName} onChange={(e) => setFormData((p) => ({ ...p, fatherName: e.target.value }))} />
              </LabeledField>
              <LabeledField label="تاریخ تولد" className="sm:col-span-2">
                <input className="input-field" type="date" value={formData.birthDate} onChange={(e) => setFormData((p) => ({ ...p, birthDate: e.target.value }))} />
              </LabeledField>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-extrabold text-lg">اطلاعات پرداخت</h2>
                <p className="text-xs text-slate-400 mt-1">اطلاعات بانکی و موارد مالی تکمیلی را وارد کنید.</p>
              </div>
              <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full">اختیاری</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledField label="شماره حساب">
                <input className="input-field" placeholder="شماره حساب" value={formData.accountNumber} onChange={(e) => setFormData((p) => ({ ...p, accountNumber: e.target.value }))} />
              </LabeledField>
              <LabeledField label="شماره کارت بانکی">
                <input className="input-field" placeholder="شماره کارت بانکی" value={formData.cardNumber} onChange={(e) => setFormData((p) => ({ ...p, cardNumber: e.target.value }))} />
              </LabeledField>
              <LabeledField label="شماره شبا" className="sm:col-span-2">
                <input className="input-field" placeholder="IR..." value={formData.shaba} onChange={(e) => setFormData((p) => ({ ...p, shaba: e.target.value }))} />
              </LabeledField>
              <LabeledField label="ضمانت‌ها" className="sm:col-span-2">
                <textarea className="input-field min-h-[100px]" placeholder="توضیحات ضمانت‌ها" value={formData.guarantees} onChange={(e) => setFormData((p) => ({ ...p, guarantees: e.target.value }))} />
              </LabeledField>
            </div>
          </section>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4 text-white">
                <FileText className="w-4 h-4 text-indigo-300" />
                <h2 className="font-bold">قرارداد</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400">نوع قرارداد مالی</label>
                  <select
                    className="input-field mt-2"
                    value={formData.agreementType}
                    onChange={(e) => setFormData((p) => ({ ...p, agreementType: e.target.value as AgreementType }))}
                  >
                    <option value="monthly-fixed">ثابت ماهیانه</option>
                    <option value="daily-wage">روزمزد</option>
                    <option value="hourly">ساعتی</option>
                    <option value="project-based">پروژه‌ای</option>
                    <option value="consulting">مشاوره‌ای</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">تاریخ شروع قرارداد</label>
                  <input className="input-field mt-2" type="date" value={formData.contractStartDate} onChange={(e) => setFormData((p) => ({ ...p, contractStartDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">تاریخ پایان قرارداد (اختیاری)</label>
                  <input className="input-field mt-2" type="date" value={formData.contractEndDate} onChange={(e) => setFormData((p) => ({ ...p, contractEndDate: e.target.value }))} />
                </div>
              </div>
              {formData.agreementType !== 'monthly-fixed' && (
                <div className="mt-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-lg p-3">
                  در نسخه فعلی، محاسبات کامل فقط برای قرارداد «ثابت ماهیانه» فعال است.
                </div>
              )}
            </section>

            {formData.agreementType === 'monthly-fixed' ? (
              <MonthlyFixedForm agreement={formData.agreement} onChange={(agreement) => setFormData((p) => ({ ...p, agreement }))} />
            ) : (
              <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6 text-sm text-slate-300">
                این نوع قرارداد هنوز به موتور محاسبات حقوق متصل نشده است.
              </section>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 bg-slate-900/65 border border-white/10 rounded-2xl p-4">
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            {currentStep === 1 ? 'بازگشت به کاربران' : 'مرحله قبل'}
          </button>
          <div className="flex items-center gap-2">
            {(currentStep === 2 || currentStep === 3) && (
              <button onClick={handleSkip} className="px-4 py-2.5 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-slate-200 transition-all">
                رد کردن این مرحله
              </button>
            )}
            {currentStep < 4 ? (
              <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25">
                مرحله بعد
              </button>
            ) : (
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-semibold transition-all shadow-lg shadow-emerald-500/25">
                ثبت کاربر
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabeledField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-xs text-slate-400">{label}</label>
      {children}
    </div>
  );
}
