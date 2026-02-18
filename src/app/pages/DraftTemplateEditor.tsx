import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Lock, Plus, Save, Trash2 } from 'lucide-react';
import {
  getDraftTemplateById,
  getPayrollPackageEnabled,
  upsertDraftTemplate,
} from '../lib/draft-template-store';
import {
  createEmptyDraftTemplate,
  type DraftTemplate,
  type FixedAdjustmentItem,
  type PayrollField,
  type TaxBracket,
} from '../lib/draft-template-types';

type SectionId =
  | 'base'
  | 'attendance'
  | 'payroll_setup'
  | 'payroll_main'
  | 'payroll_job_benefits'
  | 'payroll_other_benefits'
  | 'payroll_fixed_adjustments'
  | 'payroll_time_coeffs'
  | 'payroll_shift'
  | 'payroll_legal'
  | 'payroll_deductions';

type PayrollFieldKey =
  | 'baseSalary'
  | 'seniorityBase'
  | 'housingAllowance'
  | 'foodAllowance'
  | 'childAllowancePerChild'
  | 'marriageAllowance'
  | 'attractionAllowance'
  | 'managementAllowance'
  | 'commuteAllowance'
  | 'hardshipAllowance'
  | 'otherBenefits'
  | 'overtimeFactor'
  | 'nightWorkFactor1'
  | 'nightWorkFactor2'
  | 'holidayWorkFactor'
  | 'fridayWorkFactorWithOvertime'
  | 'fridayWorkFactorWithoutOvertime'
  | 'morningEveningShiftPercent'
  | 'morningEveningNightShiftPercent'
  | 'morningNightShiftPercent'
  | 'eveningNightShiftPercent'
  | 'eydi'
  | 'severancePay';

type PayrollScalarKey =
  | 'agreedWage'
  | 'monthlyRequiredHours'
  | 'workerInsuranceRate'
  | 'employerInsuranceRate'
  | 'unemploymentInsuranceRate'
  | 'insuranceCapMultiplier'
  | 'monthlyTaxExemption'
  | 'overMinWageBenefitTarget';

const SECTION_TITLES: Record<SectionId, string> = {
  base: 'اطلاعات پایه',
  attendance: 'اطلاعات حضور و غیاب',
  payroll_setup: 'روش ورود اطلاعات حقوق و دستمزد',
  payroll_main: 'مولفه‌های اصلی حکمی',
  payroll_job_benefits: 'مزایای به تبع شغل',
  payroll_other_benefits: 'سایر مزایا',
  payroll_fixed_adjustments: 'اضافات و کسورات ثابت',
  payroll_time_coeffs: 'فوق‌العاده ضرایب زمانی',
  payroll_shift: 'فوق‌العاده نوبت کاری',
  payroll_legal: 'حدود قانونی عیدی و حق سنوات',
  payroll_deductions: 'کسورات قانونی و حدود بیمه / مالیات',
};

const MAIN_COMPONENTS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'baseSalary', label: 'حقوق پایه ماهانه' },
  { key: 'seniorityBase', label: 'پایه سنوات ماهانه' },
  { key: 'housingAllowance', label: 'حق مسکن' },
  { key: 'foodAllowance', label: 'بن خواربار/کارگری' },
  { key: 'childAllowancePerChild', label: 'حق اولاد (هر فرزند)' },
  { key: 'marriageAllowance', label: 'حق تاهل' },
];

const JOB_BENEFITS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'attractionAllowance', label: 'حق جذب' },
  { key: 'managementAllowance', label: 'حق مدیریت' },
  { key: 'commuteAllowance', label: 'ایاب و ذهاب' },
  { key: 'hardshipAllowance', label: 'سختی کار' },
];

const TIME_COEFFS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'overtimeFactor', label: 'ضریب اضافه کاری' },
  { key: 'nightWorkFactor1', label: 'ضریب شب کاری' },
  { key: 'nightWorkFactor2', label: 'ضریب شب کاری (نوع دوم)' },
  { key: 'holidayWorkFactor', label: 'ضریب تعطیل کاری' },
  { key: 'fridayWorkFactorWithOvertime', label: 'ضریب جمعه کاری' },
  { key: 'fridayWorkFactorWithoutOvertime', label: 'ضریب جمعه کاری بدون اضافه کاری' },
];

const SHIFT_BENEFITS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'morningEveningShiftPercent', label: 'درصد شیفت صبح و عصر' },
  { key: 'morningEveningNightShiftPercent', label: 'درصد شیفت صبح و عصر و شب' },
  { key: 'morningNightShiftPercent', label: 'درصد شیفت صبح و شب' },
  { key: 'eveningNightShiftPercent', label: 'درصد شیفت عصر و شب' },
];

const LEGAL_FIELDS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'eydi', label: 'عیدی' },
  { key: 'severancePay', label: 'حق سنوات' },
];

const DEDUCTION_FIELDS: Array<{ key: PayrollScalarKey; label: string }> = [
  { key: 'workerInsuranceRate', label: 'نرخ بیمه سهم کارگر (%)' },
  { key: 'employerInsuranceRate', label: 'نرخ بیمه سهم کارفرما (%)' },
  { key: 'unemploymentInsuranceRate', label: 'نرخ بیمه بیکاری (%)' },
  { key: 'insuranceCapMultiplier', label: 'ضریب سقف مشمول بیمه' },
  { key: 'monthlyTaxExemption', label: 'معافیت مالیاتی ماهانه' },
];

const OVER_MIN_WAGE_TARGET_LABELS: Record<string, string> = {
  attractionAllowance: 'حق جذب',
  managementAllowance: 'حق مدیریت',
  commuteAllowance: 'ایاب و ذهاب',
  hardshipAllowance: 'سختی کار',
  otherBenefits: 'سایر مزایا',
};

const AGREED_TARGETS = new Set(['attractionAllowance', 'managementAllowance', 'commuteAllowance', 'hardshipAllowance', 'otherBenefits']);

const LEGAL_TOTAL_COMPONENT_KEYS: PayrollFieldKey[] = [
  ...MAIN_COMPONENTS.map((item) => item.key),
  ...JOB_BENEFITS.map((item) => item.key),
  'otherBenefits',
];

const ALL_PAYROLL_FIELD_KEYS: PayrollFieldKey[] = [
  ...LEGAL_TOTAL_COMPONENT_KEYS,
  ...TIME_COEFFS.map((item) => item.key),
  ...SHIFT_BENEFITS.map((item) => item.key),
  ...LEGAL_FIELDS.map((item) => item.key),
];

const toNumber = (value: string): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const createFixedAdjustment = (kind: 'addition' | 'deduction'): FixedAdjustmentItem => ({
  id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  kind,
  calcType: 'fixed',
  value: '',
  insurance: true,
  tax: true,
  baseWage: false,
});

const hydrateTemplate = (input: DraftTemplate): DraftTemplate => {
  const base = createEmptyDraftTemplate();
  const rawPayroll = input.payroll ?? base.payroll;
  const mergedPayroll = {
    ...base.payroll,
    ...rawPayroll,
    fixedAdjustments: Array.isArray(rawPayroll.fixedAdjustments)
      ? rawPayroll.fixedAdjustments.map((item) => ({
          ...item,
          insurance: item.insurance ?? true,
          tax: item.tax ?? true,
          baseWage: item.baseWage ?? false,
        }))
      : [],
    agreedExtraAdditionIds: Array.isArray(rawPayroll.agreedExtraAdditionIds) ? rawPayroll.agreedExtraAdditionIds : [],
    agreedDeficitDeductionIds: Array.isArray(rawPayroll.agreedDeficitDeductionIds)
      ? rawPayroll.agreedDeficitDeductionIds
      : [],
  };

  const payrollWithFields = ALL_PAYROLL_FIELD_KEYS.reduce<typeof mergedPayroll>((acc, key) => {
    acc[key] = { ...base.payroll[key], ...(rawPayroll as DraftTemplate['payroll'])[key] };
    return acc;
  }, mergedPayroll);

  return {
    ...base,
    ...input,
    attendance: { ...base.attendance, ...input.attendance },
    payroll: payrollWithFields,
    savedSections: { ...base.savedSections, ...input.savedSections },
  };
};

type AgreedAnalysis = {
  legalTotal: number;
  agreedTotal: number;
  diff: number;
  finalFieldValues: Record<PayrollFieldKey, number>;
  selectedExtraAdditions: FixedAdjustmentItem[];
  selectedDeficitDeductions: FixedAdjustmentItem[];
};

const calculateAgreedAnalysis = (template: DraftTemplate): AgreedAnalysis => {
  const finalFieldValues = ALL_PAYROLL_FIELD_KEYS.reduce<Record<PayrollFieldKey, number>>((acc, key) => {
    acc[key] = toNumber(template.payroll[key].value);
    return acc;
  }, {} as Record<PayrollFieldKey, number>);

  const legalTotal = LEGAL_TOTAL_COMPONENT_KEYS.reduce((sum, key) => sum + finalFieldValues[key], 0);
  const agreedTotal = toNumber(template.payroll.agreedWage);
  const diff = agreedTotal - legalTotal;

  if (diff > 0 && AGREED_TARGETS.has(template.payroll.overMinWageBenefitTarget)) {
    const target = template.payroll.overMinWageBenefitTarget as PayrollFieldKey;
    finalFieldValues[target] += diff;
  }

  const selectedExtraAdditions = template.payroll.fixedAdjustments.filter(
    (item) =>
      item.kind === 'addition' &&
      item.calcType === 'fixed' &&
      template.payroll.agreedExtraAdditionIds.includes(item.id),
  );

  const selectedDeficitDeductions = template.payroll.fixedAdjustments.filter(
    (item) =>
      item.kind === 'deduction' &&
      item.calcType === 'fixed' &&
      template.payroll.agreedDeficitDeductionIds.includes(item.id),
  );

  return {
    legalTotal,
    agreedTotal,
    diff,
    finalFieldValues,
    selectedExtraAdditions,
    selectedDeficitDeductions,
  };
};

const requiredBaseError = (item: DraftTemplate): string | null => {
  if (!item.title.trim()) return 'عنوان اطلاعات پایه الزامی است.';
  if (!item.periodStart) return 'تاریخ شروع بازه زمانی الزامی است.';
  if (!item.description.trim()) return 'توضیحات اطلاعات پایه الزامی است.';
  return null;
};

const normalizeTaxBrackets = (exemption: string, brackets: TaxBracket[]): TaxBracket[] => {
  const out: TaxBracket[] = [];
  for (let i = 0; i < brackets.length; i += 1) {
    out.push({
      ...brackets[i],
      start: i === 0 ? exemption : out[i - 1]?.end ?? '',
    });
  }
  return out;
};

const getSavedLabel = (date?: string) => {
  if (!date) return 'ذخیره نشده';
  try {
    return new Date(date).toLocaleString('fa-IR');
  } catch {
    return 'ذخیره شده';
  }
};

export default function DraftTemplateEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const isEdit = Boolean(id && id !== 'add');
  const existing = isEdit ? getDraftTemplateById(id as string) : null;
  const [template, setTemplate] = useState<DraftTemplate>(() => hydrateTemplate(existing ?? createEmptyDraftTemplate()));
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const hasPayrollPackage = getPayrollPackageEnabled();

  const baseError = useMemo(() => requiredBaseError(template), [template]);
  const baseReady = !baseError;
  const agreedAnalysis = useMemo(() => calculateAgreedAnalysis(template), [template]);

  if (isEdit && !existing) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-slate-900/40 border border-white/5 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">قالب موردنظر پیدا نشد</h2>
          <button
            onClick={() => navigate('/draft-templates')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
          >
            بازگشت به فهرست
          </button>
        </div>
      </div>
    );
  }

  const setPayrollScalar = (key: PayrollScalarKey, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: value,
        taxBrackets:
          key === 'monthlyTaxExemption'
            ? normalizeTaxBrackets(value, prev.payroll.taxBrackets)
            : prev.payroll.taxBrackets,
      },
    }));
  };

  const setPayrollField = (key: PayrollFieldKey, patch: Partial<PayrollField>) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: {
          ...prev.payroll[key],
          ...patch,
        },
      },
    }));
  };

  const addFixedAdjustment = (kind: 'addition' | 'deduction') => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: [...prev.payroll.fixedAdjustments, createFixedAdjustment(kind)],
      },
    }));
  };

  const updateFixedAdjustment = (id: string, patch: Partial<FixedAdjustmentItem>) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: prev.payroll.fixedAdjustments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    }));
  };

  const removeFixedAdjustment = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: prev.payroll.fixedAdjustments.filter((item) => item.id !== id),
        agreedExtraAdditionIds: prev.payroll.agreedExtraAdditionIds.filter((itemId) => itemId !== id),
        agreedDeficitDeductionIds: prev.payroll.agreedDeficitDeductionIds.filter((itemId) => itemId !== id),
      },
    }));
  };

  const toggleAgreedExtraAddition = (id: string) => {
    setTemplate((prev) => {
      const exists = prev.payroll.agreedExtraAdditionIds.includes(id);
      return {
        ...prev,
        payroll: {
          ...prev.payroll,
          agreedExtraAdditionIds: exists
            ? prev.payroll.agreedExtraAdditionIds.filter((itemId) => itemId !== id)
            : [...prev.payroll.agreedExtraAdditionIds, id],
        },
      };
    });
  };

  const toggleAgreedDeficitDeduction = (id: string) => {
    setTemplate((prev) => {
      const exists = prev.payroll.agreedDeficitDeductionIds.includes(id);
      return {
        ...prev,
        payroll: {
          ...prev.payroll,
          agreedDeficitDeductionIds: exists
            ? prev.payroll.agreedDeficitDeductionIds.filter((itemId) => itemId !== id)
            : [...prev.payroll.agreedDeficitDeductionIds, id],
        },
      };
    });
  };

  const saveSection = (section: SectionId) => {
    if (section !== 'base' && !baseReady) {
      setNotice({ type: 'error', text: 'ابتدا اطلاعات پایه را کامل و ذخیره کنید.' });
      return;
    }
    if (section === 'base' && baseError) {
      setNotice({ type: 'error', text: baseError });
      return;
    }
    if (section.startsWith('payroll') && !hasPayrollPackage) {
      setNotice({ type: 'error', text: 'برای ثبت آیتم‌های حقوق و دستمزد باید پکیج مربوطه فعال شود.' });
      return;
    }
    if (section === 'payroll_setup' && template.payroll.inputMode === 'agreed') {
      if (!template.payroll.agreedWage) {
        setNotice({ type: 'error', text: 'در حالت توافقی، وارد کردن مبلغ حقوق توافقی الزامی است.' });
        return;
      }

      if (agreedAnalysis.diff > 0) {
        if (!AGREED_TARGETS.has(template.payroll.overMinWageBenefitTarget)) {
          setNotice({ type: 'error', text: 'برای مازاد مبلغ توافقی، محل ثبت مازاد را انتخاب کنید.' });
          return;
        }
        if (
          template.payroll.overMinWageBenefitTarget === 'otherBenefits' &&
          agreedAnalysis.selectedExtraAdditions.length === 0
        ) {
          setNotice({ type: 'error', text: 'برای «سایر مزایا» حداقل یک اضافه ثابت (مبلغ ثابت) را انتخاب یا ایجاد کنید.' });
          return;
        }
      }

      if (agreedAnalysis.diff < 0 && agreedAnalysis.selectedDeficitDeductions.length === 0) {
        setNotice({ type: 'error', text: 'برای کسری مبلغ توافقی، حداقل یک کسور ثابت (مبلغ ثابت) را انتخاب یا ایجاد کنید.' });
        return;
      }
    }

    const prepared: DraftTemplate = {
      ...template,
      isPeriodEndOpen: !template.periodEnd,
      payroll: {
        ...template.payroll,
        taxBrackets: normalizeTaxBrackets(template.payroll.monthlyTaxExemption, template.payroll.taxBrackets),
      },
      updatedAt: new Date().toISOString(),
      savedSections: {
        ...template.savedSections,
        [section]: new Date().toISOString(),
      },
    };
    upsertDraftTemplate(prepared);
    setTemplate(prepared);
    setNotice({ type: 'success', text: `بخش «${SECTION_TITLES[section]}» ذخیره شد.` });
    if (!isEdit) navigate(`/draft-templates/${prepared.id}`, { replace: true });
  };

  const monthly = Number(template.payroll.monthlyRequiredHours || 0);
  const perDay = monthly ? (monthly / 30).toFixed(2) : '0';
  const perWeek = monthly ? ((monthly * 12) / 52).toFixed(2) : '0';
  const perYear = monthly ? (monthly * 12).toFixed(2) : '0';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/draft-templates')}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isEdit ? 'ویرایش قالب پیش‌نویس قرارداد' : 'ثبت قالب پیش‌نویس قرارداد'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">ذخیره هر بخش به‌صورت مستقل انجام می‌شود.</p>
          </div>
        </div>

        {notice && (
          <div
            className={`rounded-xl p-3 text-sm border ${
              notice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}
          >
            {notice.text}
          </div>
        )}

        <SectionCard
          title="اطلاعات پایه"
          subtitle="تعریف عنوان، بازه زمانی و توضیحات"
          savedAt={template.savedSections.base}
          onSave={() => saveSection('base')}
        >
          <div className="grid grid-cols-1 gap-4">
            <Field label="عنوان" required>
              <input
                type="text"
                value={template.title}
                onChange={(e) => setTemplate((prev) => ({ ...prev, title: e.target.value }))}
                className="input-field"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="شروع" required>
                <input
                  type="date"
                  value={template.periodStart}
                  onChange={(e) => setTemplate((prev) => ({ ...prev, periodStart: e.target.value }))}
                  className="input-field"
                />
              </Field>
              <Field label="پایان">
                <input
                  type="date"
                  value={template.periodEnd}
                  onChange={(e) =>
                    setTemplate((prev) => ({
                      ...prev,
                      periodEnd: e.target.value,
                      isPeriodEndOpen: !e.target.value,
                    }))
                  }
                  className="input-field"
                />
              </Field>
            </div>
            <div>
              <Field label="توضیحات" required>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  className="input-field min-h-24"
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="اطلاعات حضور و غیاب"
          subtitle="تنظیم مرخصی و اضافه‌کاری"
          savedAt={template.savedSections.attendance}
          onSave={() => saveSection('attendance')}
          disabledSave={!baseReady}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="سقف مرخصی ماهیانه">
              <input
                type="number"
                value={template.attendance.monthlyLeaveCap}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, monthlyLeaveCap: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
            <Field label="حداکثر انتقال مرخصی به سال بعد">
              <input
                type="number"
                value={template.attendance.maxLeaveCarryToNextYear}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, maxLeaveCarryToNextYear: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
            <Field label="سقف ساعت اضافه کاری ماهانه">
              <input
                type="number"
                value={template.attendance.monthlyOvertimeCap}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, monthlyOvertimeCap: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
          </div>
        </SectionCard>

        {!hasPayrollPackage && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-200 mb-1">بخش حقوق و دستمزد قفل است</h3>
                <p className="text-xs text-amber-100/90 mb-3">
                  برای ثبت آیتم‌های حقوق و دستمزد ابتدا پکیج حقوق و دستمزد را خریداری کنید.
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/draft-templates/payroll-package?returnTo=${encodeURIComponent(
                        isEdit ? `/draft-templates/${template.id}` : '/draft-templates/add',
                      )}`,
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 text-sm font-semibold"
                >
                  رفتن به خرید پکیج حقوق و دستمزد
                </button>
              </div>
            </div>
          </div>
        )}

        {hasPayrollPackage && (
          <>
            <SectionCard
              title="روش ورود اطلاعات حقوق و دستمزد"
              subtitle="انتخاب ثبت دستی یا حقوق توافقی"
              savedAt={template.savedSections.payroll_setup}
              onSave={() => saveSection('payroll_setup')}
              disabledSave={!baseReady}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 flex items-center gap-2">
                  <input
                    type="radio"
                    name="input-mode"
                    checked={template.payroll.inputMode === 'manual'}
                    onChange={() => setTemplate((prev) => ({ ...prev, payroll: { ...prev.payroll, inputMode: 'manual' } }))}
                  />
                  ورود دستی همه اطلاعات
                </label>
                <label className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 flex items-center gap-2">
                  <input
                    type="radio"
                    name="input-mode"
                    checked={template.payroll.inputMode === 'agreed'}
                    onChange={() => setTemplate((prev) => ({ ...prev, payroll: { ...prev.payroll, inputMode: 'agreed' } }))}
                  />
                  تعیین حقوق توافقی
                </label>
              </div>
              {template.payroll.inputMode === 'agreed' && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="حقوق توافقی">
                      <input
                        type="number"
                        value={template.payroll.agreedWage}
                        onChange={(e) => setPayrollScalar('agreedWage', e.target.value)}
                        className="input-field"
                      />
                    </Field>
                    <Field label="مازاد حد اداره کار در کدام مزایا ثبت شود؟">
                      <select
                        value={template.payroll.overMinWageBenefitTarget}
                        onChange={(e) => setPayrollScalar('overMinWageBenefitTarget', e.target.value)}
                        className="input-field"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="attractionAllowance">حق جذب</option>
                        <option value="managementAllowance">حق مدیریت</option>
                        <option value="commuteAllowance">ایاب و ذهاب</option>
                        <option value="hardshipAllowance">سختی کار</option>
                        <option value="otherBenefits">سایر مزایا</option>
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MiniStat label="جمع قانونی دریافتی" value={agreedAnalysis.legalTotal.toLocaleString('fa-IR')} />
                    <MiniStat label="حقوق توافقی" value={agreedAnalysis.agreedTotal.toLocaleString('fa-IR')} />
                    <MiniStat
                      label="مابه‌التفاوت توافقی"
                      value={agreedAnalysis.diff.toLocaleString('fa-IR')}
                    />
                  </div>

                  {agreedAnalysis.diff > 0 && template.payroll.overMinWageBenefitTarget === 'otherBenefits' && (
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">انتخاب یا ایجاد اضافات ثابت برای مابه‌التفاوت</h4>
                        <button
                          type="button"
                          onClick={() => addFixedAdjustment('addition')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          اضافه ثابت جدید
                        </button>
                      </div>
                      {template.payroll.fixedAdjustments.filter((item) => item.kind === 'addition').length === 0 && (
                        <p className="text-xs text-slate-400">هنوز اضافه ثابتی ثبت نشده است.</p>
                      )}
                      {template.payroll.fixedAdjustments
                        .filter((item) => item.kind === 'addition')
                        .map((item) => (
                          <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-lg p-3 space-y-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={template.payroll.agreedExtraAdditionIds.includes(item.id)}
                                onChange={() => toggleAgreedExtraAddition(item.id)}
                                disabled={item.calcType !== 'fixed'}
                              />
                              استفاده در مابه‌التفاوت توافقی
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                              <Field label="عنوان">
                                <input
                                  type="text"
                                  className="input-field"
                                  value={item.title}
                                  onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                                />
                              </Field>
                              <Field label="نوع محاسبه">
                                <select
                                  className="input-field"
                                  value={item.calcType}
                                  onChange={(e) =>
                                    updateFixedAdjustment(item.id, {
                                      calcType: e.target.value as FixedAdjustmentItem['calcType'],
                                    })
                                  }
                                >
                                  <option value="fixed">مبلغ ثابت</option>
                                  <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                                </select>
                              </Field>
                              <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                                <input
                                  type="number"
                                  className="input-field"
                                  value={item.value}
                                  onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                                />
                              </Field>
                              <button
                                type="button"
                                onClick={() => removeFixedAdjustment(item.id)}
                                className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.insurance}
                                  onChange={(e) => updateFixedAdjustment(item.id, { insurance: e.target.checked })}
                                />
                                مشمول بیمه
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.tax}
                                  onChange={(e) => updateFixedAdjustment(item.id, { tax: e.target.checked })}
                                />
                                مشمول مالیات
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.baseWage}
                                  onChange={(e) => updateFixedAdjustment(item.id, { baseWage: e.target.checked })}
                                />
                                قابل احتساب در مزد مبنا
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {agreedAnalysis.diff < 0 && (
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">انتخاب یا ایجاد کسورات ثابت برای کسری توافقی</h4>
                        <button
                          type="button"
                          onClick={() => addFixedAdjustment('deduction')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          کسور ثابت جدید
                        </button>
                      </div>
                      {template.payroll.fixedAdjustments.filter((item) => item.kind === 'deduction').length === 0 && (
                        <p className="text-xs text-slate-400">هنوز کسور ثابتی ثبت نشده است.</p>
                      )}
                      {template.payroll.fixedAdjustments
                        .filter((item) => item.kind === 'deduction')
                        .map((item) => (
                          <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-lg p-3 space-y-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={template.payroll.agreedDeficitDeductionIds.includes(item.id)}
                                onChange={() => toggleAgreedDeficitDeduction(item.id)}
                                disabled={item.calcType !== 'fixed'}
                              />
                              استفاده در کسری توافقی
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                              <Field label="عنوان">
                                <input
                                  type="text"
                                  className="input-field"
                                  value={item.title}
                                  onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                                />
                              </Field>
                              <Field label="نوع محاسبه">
                                <select
                                  className="input-field"
                                  value={item.calcType}
                                  onChange={(e) =>
                                    updateFixedAdjustment(item.id, {
                                      calcType: e.target.value as FixedAdjustmentItem['calcType'],
                                    })
                                  }
                                >
                                  <option value="fixed">مبلغ ثابت</option>
                                  <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                                </select>
                              </Field>
                              <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                                <input
                                  type="number"
                                  className="input-field"
                                  value={item.value}
                                  onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                                />
                              </Field>
                              <button
                                type="button"
                                onClick={() => removeFixedAdjustment(item.id)}
                                className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.insurance}
                                  onChange={(e) => updateFixedAdjustment(item.id, { insurance: e.target.checked })}
                                />
                                مشمول بیمه
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.tax}
                                  onChange={(e) => updateFixedAdjustment(item.id, { tax: e.target.checked })}
                                />
                                مشمول مالیات
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={item.baseWage}
                                  onChange={(e) => updateFixedAdjustment(item.id, { baseWage: e.target.checked })}
                                />
                                قابل احتساب در مزد مبنا
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>
            {template.payroll.inputMode === 'agreed' ? (
              <PayrollReadonlyReport
                template={template}
                agreedAnalysis={agreedAnalysis}
                perDay={perDay}
                perWeek={perWeek}
                perYear={perYear}
              />
            ) : (
              <>
                <SectionCard
                  title="مولفه‌های اصلی حکمی"
                  subtitle="ساعت موظفی و مزایای اصلی"
                  savedAt={template.savedSections.payroll_main}
                  onSave={() => saveSection('payroll_main')}
                  disabledSave={!baseReady}
                >
                  <Field label="ساعت موظفی در ماه (برای محاسبه نرخ ساعتی)">
                    <input
                      type="number"
                      value={template.payroll.monthlyRequiredHours}
                      onChange={(e) => setPayrollScalar('monthlyRequiredHours', e.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    <MiniStat label="معادل روزانه" value={`${perDay} ساعت`} />
                    <MiniStat label="معادل هفتگی" value={`${perWeek} ساعت`} />
                    <MiniStat label="معادل سالانه" value={`${perYear} ساعت`} />
                  </div>
                  <div className="space-y-3">
                    {MAIN_COMPONENTS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        field={template.payroll[item.key]}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="مزایای به تبع شغل"
                  subtitle="مزایای شغلی"
                  savedAt={template.savedSections.payroll_job_benefits}
                  onSave={() => saveSection('payroll_job_benefits')}
                  disabledSave={!baseReady}
                >
                  <div className="space-y-3">
                    {JOB_BENEFITS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        field={template.payroll[item.key]}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="سایر مزایا"
                  subtitle="مزایای مستقل خارج از گروه مزایای شغلی"
                  savedAt={template.savedSections.payroll_other_benefits}
                  onSave={() => saveSection('payroll_other_benefits')}
                  disabledSave={!baseReady}
                >
                  <PayrollFieldRow
                    label="سایر مزایا"
                    field={template.payroll.otherBenefits}
                    onChange={(patch) => setPayrollField('otherBenefits', patch)}
                  />
                </SectionCard>

                <SectionCard
                  title="اضافات و کسورات ثابت"
                  subtitle="تعریف آیتم‌های مبلغ ثابت یا ضریب مزد مبنا"
                  savedAt={template.savedSections.payroll_fixed_adjustments}
                  onSave={() => saveSection('payroll_fixed_adjustments')}
                  disabledSave={!baseReady}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => addFixedAdjustment('addition')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      افزودن اضافه
                    </button>
                    <button
                      type="button"
                      onClick={() => addFixedAdjustment('deduction')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      افزودن کسور
                    </button>
                  </div>

                  {template.payroll.fixedAdjustments.length === 0 && (
                    <p className="text-xs text-slate-400">هنوز آیتمی ثبت نشده است.</p>
                  )}

                  <div className="space-y-3">
                    {template.payroll.fixedAdjustments.map((item) => (
                      <div key={item.id} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                          <Field label="عنوان">
                            <input
                              type="text"
                              className="input-field"
                              value={item.title}
                              onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                            />
                          </Field>
                          <Field label="نوع آیتم">
                            <select
                              className="input-field"
                              value={item.kind}
                              onChange={(e) =>
                                updateFixedAdjustment(item.id, {
                                  kind: e.target.value as FixedAdjustmentItem['kind'],
                                })
                              }
                            >
                              <option value="addition">اضافه</option>
                              <option value="deduction">کسور</option>
                            </select>
                          </Field>
                          <Field label="روش محاسبه">
                            <select
                              className="input-field"
                              value={item.calcType}
                              onChange={(e) =>
                                updateFixedAdjustment(item.id, {
                                  calcType: e.target.value as FixedAdjustmentItem['calcType'],
                                })
                              }
                            >
                              <option value="fixed">مبلغ ثابت</option>
                              <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                            </select>
                          </Field>
                          <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                            <input
                              type="number"
                              className="input-field"
                              value={item.value}
                              onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                            />
                          </Field>
                          <button
                            type="button"
                            onClick={() => removeFixedAdjustment(item.id)}
                            className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={item.insurance}
                              onChange={(e) => updateFixedAdjustment(item.id, { insurance: e.target.checked })}
                            />
                            مشمول بیمه
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={item.tax}
                              onChange={(e) => updateFixedAdjustment(item.id, { tax: e.target.checked })}
                            />
                            مشمول مالیات
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={item.baseWage}
                              onChange={(e) => updateFixedAdjustment(item.id, { baseWage: e.target.checked })}
                            />
                            قابل احتساب در مزد مبنا
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="فوق العاده ضرایب زمانی"
                  subtitle="ضرایب اضافه‌کاری و شب‌کاری"
                  savedAt={template.savedSections.payroll_time_coeffs}
                  onSave={() => saveSection('payroll_time_coeffs')}
                  disabledSave={!baseReady}
                >
                  <div className="space-y-3">
                    {TIME_COEFFS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        field={template.payroll[item.key]}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="فوق العاده نوبت کاری"
                  subtitle="درصد شیفت‌های نوبتی"
                  savedAt={template.savedSections.payroll_shift}
                  onSave={() => saveSection('payroll_shift')}
                  disabledSave={!baseReady}
                >
                  <div className="space-y-3">
                    {SHIFT_BENEFITS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        field={template.payroll[item.key]}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="حدود قانونی عیدی و حق سنوات"
                  subtitle="تنظیمات عیدی و سنوات"
                  savedAt={template.savedSections.payroll_legal}
                  onSave={() => saveSection('payroll_legal')}
                  disabledSave={!baseReady}
                >
                  <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3">
                    عیدی پیش‌فرض: حداقل دو برابر آخرین مزد مبنا و حداکثر معادل 90 روز حداقل مزد روزانه. قابل ویرایش است.
                  </p>
                  <div className="space-y-3">
                    {LEGAL_FIELDS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        field={template.payroll[item.key]}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="کسورات قانونی و حدود بیمه / مالیات"
                  subtitle="نرخ‌های بیمه و مالیات"
                  savedAt={template.savedSections.payroll_deductions}
                  onSave={() => saveSection('payroll_deductions')}
                  disabledSave={!baseReady}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {DEDUCTION_FIELDS.map((item) => (
                      <Field key={item.key} label={item.label}>
                        <input
                          type="number"
                          value={template.payroll[item.key]}
                          onChange={(e) => setPayrollScalar(item.key, e.target.value)}
                          className="input-field"
                        />
                      </Field>
                    ))}
                  </div>

                  <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100">پله های مالیات حقوق</h4>
                      <button
                        onClick={() =>
                          setTemplate((prev) => ({
                            ...prev,
                            payroll: {
                              ...prev.payroll,
                              taxBrackets: normalizeTaxBrackets(prev.payroll.monthlyTaxExemption, [
                                ...prev.payroll.taxBrackets,
                                { id: `tax-${Date.now()}`, start: '', end: '', rate: '' },
                              ]),
                            },
                          }))
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        افزودن پله
                      </button>
                    </div>

                    {template.payroll.taxBrackets.map((bracket, idx) => (
                      <div key={bracket.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <Field label={`پله ${idx + 1} - مبلغ شروع`}>
                          <input type="text" className="input-field opacity-70" value={bracket.start} readOnly />
                        </Field>
                        <Field label="مبلغ پایان">
                          <input
                            type="number"
                            className="input-field"
                            value={bracket.end}
                            onChange={(e) =>
                              setTemplate((prev) => {
                                const next = prev.payroll.taxBrackets.map((row) =>
                                  row.id === bracket.id ? { ...row, end: e.target.value } : row,
                                );
                                return {
                                  ...prev,
                                  payroll: {
                                    ...prev.payroll,
                                    taxBrackets: normalizeTaxBrackets(prev.payroll.monthlyTaxExemption, next),
                                  },
                                };
                              })
                            }
                          />
                        </Field>
                        <Field label="درصد">
                          <input
                            type="number"
                            className="input-field"
                            value={bracket.rate}
                            onChange={(e) =>
                              setTemplate((prev) => ({
                                ...prev,
                                payroll: {
                                  ...prev.payroll,
                                  taxBrackets: prev.payroll.taxBrackets.map((row) =>
                                    row.id === bracket.id ? { ...row, rate: e.target.value } : row,
                                  ),
                                },
                              }))
                            }
                          />
                        </Field>
                        <button
                          onClick={() =>
                            setTemplate((prev) => {
                              if (prev.payroll.taxBrackets.length <= 1) return prev;
                              return {
                                ...prev,
                                payroll: {
                                  ...prev.payroll,
                                  taxBrackets: normalizeTaxBrackets(
                                    prev.payroll.monthlyTaxExemption,
                                    prev.payroll.taxBrackets.filter((row) => row.id !== bracket.id),
                                  ),
                                },
                              };
                            })
                          }
                          disabled={template.payroll.taxBrackets.length <= 1}
                          className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف پله
                        </button>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  savedAt,
  onSave,
  disabledSave,
  children,
}: {
  title: string;
  subtitle: string;
  savedAt?: string;
  onSave: () => void;
  disabledSave?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          <p className="text-[11px] text-slate-500 mt-1">آخرین ذخیره: {getSavedLabel(savedAt)}</p>
        </div>
        <button
          onClick={onSave}
          disabled={disabledSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          ذخیره این بخش
        </button>
      </div>
      {children}
    </section>
  );
}

function PayrollReadonlyReport({
  template,
  agreedAnalysis,
  perDay,
  perWeek,
  perYear,
}: {
  template: DraftTemplate;
  agreedAnalysis: AgreedAnalysis;
  perDay: string;
  perWeek: string;
  perYear: string;
}) {
  const selectedTarget = OVER_MIN_WAGE_TARGET_LABELS[template.payroll.overMinWageBenefitTarget] ?? 'ثبت نشده';
  const reportGroups: Array<{ title: string; items: Array<{ key: PayrollFieldKey; label: string }> }> = [
    { title: 'مولفه‌های اصلی حکمی', items: MAIN_COMPONENTS },
    { title: 'مزایای به تبع شغل', items: JOB_BENEFITS },
    { title: 'فوق العاده ضرایب زمانی', items: TIME_COEFFS },
    { title: 'فوق العاده نوبت کاری', items: SHIFT_BENEFITS },
    { title: 'حدود قانونی عیدی و حق سنوات', items: LEGAL_FIELDS },
  ];

  return (
    <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">گزارش حقوق و دستمزد</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          در حالت «تعیین حقوق توافقی»، بخش‌های زیر فقط نمایشی هستند و امکان ویرایش ندارند.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ReportItem label="جمع قانونی دریافتی" value={agreedAnalysis.legalTotal.toLocaleString('fa-IR')} />
        <ReportItem label="حقوق توافقی" value={agreedAnalysis.agreedTotal.toLocaleString('fa-IR')} />
        <ReportItem label="مابه‌التفاوت توافقی" value={agreedAnalysis.diff.toLocaleString('fa-IR')} />
        <ReportItem label="ثبت مازاد حد اداره کار در" value={selectedTarget} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MiniStat label="معادل روزانه" value={`${perDay} ساعت`} />
        <MiniStat label="معادل هفتگی" value={`${perWeek} ساعت`} />
        <MiniStat label="معادل سالانه" value={`${perYear} ساعت`} />
      </div>

      {reportGroups.map((group) => (
        <div key={group.title} className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-100 mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((item) => (
              <ReportItem
                key={item.key}
                label={item.label}
                value={agreedAnalysis.finalFieldValues[item.key].toLocaleString('fa-IR')}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-100 mb-3">سایر مزایا</h3>
        <ReportItem label="سایر مزایا" value={agreedAnalysis.finalFieldValues.otherBenefits.toLocaleString('fa-IR')} />
      </div>

      <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-100 mb-3">کسورات قانونی و حدود بیمه / مالیات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEDUCTION_FIELDS.map((item) => (
            <ReportItem key={item.key} label={item.label} value={template.payroll[item.key] || '-'} />
          ))}
        </div>
      </div>

      <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-bold text-slate-100">پله های مالیات حقوق</h3>
        {template.payroll.taxBrackets.map((bracket, idx) => (
          <div key={bracket.id} className="text-xs text-slate-300">
            پله {idx + 1}: شروع {bracket.start || '-'} | پایان {bracket.end || '-'} | درصد {bracket.rate || '-'}
          </div>
        ))}
      </div>

      {agreedAnalysis.diff > 0 && template.payroll.overMinWageBenefitTarget === 'otherBenefits' && (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">اضافات ثابت انتخاب‌شده برای مابه‌التفاوت</h3>
          {agreedAnalysis.selectedExtraAdditions.length === 0 ? (
            <p className="text-xs text-slate-400">آیتمی انتخاب نشده است.</p>
          ) : (
            agreedAnalysis.selectedExtraAdditions.map((item) => (
              <div key={item.id} className="text-xs text-slate-300">
                {item.title || 'بدون عنوان'} | مبلغ ثابت: {toNumber(item.value).toLocaleString('fa-IR')} | بیمه:{' '}
                {item.insurance ? 'بله' : 'خیر'} | مالیات: {item.tax ? 'بله' : 'خیر'} | مزد مبنا:{' '}
                {item.baseWage ? 'بله' : 'خیر'}
              </div>
            ))
          )}
        </div>
      )}

      {agreedAnalysis.diff < 0 && (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">کسورات ثابت انتخاب‌شده برای کسری توافقی</h3>
          {agreedAnalysis.selectedDeficitDeductions.length === 0 ? (
            <p className="text-xs text-slate-400">آیتمی انتخاب نشده است.</p>
          ) : (
            agreedAnalysis.selectedDeficitDeductions.map((item) => (
              <div key={item.id} className="text-xs text-slate-300">
                {item.title || 'بدون عنوان'} | مبلغ ثابت: {toNumber(item.value).toLocaleString('fa-IR')} | بیمه:{' '}
                {item.insurance ? 'بله' : 'خیر'} | مالیات: {item.tax ? 'بله' : 'خیر'} | مزد مبنا:{' '}
                {item.baseWage ? 'بله' : 'خیر'}
              </div>
            ))
          )}
        </div>
      )}

      <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        برای ویرایش جزئیات حقوق و دستمزد، روش ورود را روی «ورود دستی همه اطلاعات» قرار دهید.
      </p>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-slate-300">
        {label}
        {required && <span className="text-rose-400 mr-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function ReportItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function PayrollFieldRow({
  label,
  field,
  onChange,
}: {
  label: string;
  field: PayrollField;
  onChange: (patch: Partial<PayrollField>) => void;
}) {
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
        <div className="text-sm text-slate-200 font-medium">{label}</div>
        <input
          type="number"
          className="input-field"
          value={field.value}
          onChange={(e) => onChange({ value: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={field.insurance} onChange={(e) => onChange({ insurance: e.target.checked })} />
          مشمول بیمه
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={field.tax} onChange={(e) => onChange({ tax: e.target.checked })} />
          مشمول مالیات
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={field.baseWage} onChange={(e) => onChange({ baseWage: e.target.checked })} />
          قابل احتساب در مزد مبنا
        </label>
      </div>
    </div>
  );
}
